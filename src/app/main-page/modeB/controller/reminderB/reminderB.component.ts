import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { AppService } from 'src/app/main-page/app.service';
import { Medicine } from '../../model/medicine';
import { modeB } from 'src/environments/environments';
import { ReminderService } from '../../service/reminderB.service';
import { Reminder } from '../../model/reminder';
import { Time } from '../../model/time';

@Component({
  selector: 'app-mode-b-reminders',
  templateUrl: './reminderB.component.html',
  styleUrls: ['./reminderB.component.css'],
  animations:[
    trigger('toggleAddMed',[
      state('true',style({
        'margin':'20px', 
      })),
      state('false',style({
        'height':'0px',
        'width':'0px',
      })),
      transition('true<=>false',animate(250))
    ])
  ]
})
export class ReminderBComponent {
  boxNumbersFull:{"med_id":number,"med_box_no":number}[]=[];
  hours12:String[]=['0'];
  hours24:String[]=['0'];
  mins:String[]=['0'];
  addMed:String='false';
  isSubmitDisabled:boolean=true;
  isAddTimeDisabled:boolean=true;
  timeModeStatus:String = "12-Hr"
  addReminderForm:FormGroup;
  reminders:Reminder[] = []

  constructor(private http: HttpClient, private appService:AppService, private reminderService:ReminderService){
    this.refreshValues();
    this.fillTimeArrays();

    this.addReminderForm=new FormGroup({
      boxSelectForm:new FormControl(0),
      is12hrCheckForm:new FormControl(true),
      times12Form: new FormArray([]),
      times24Form: new FormArray([])
    }); 

    this.appService.getMessage.subscribe(
      (val:Medicine)=>this.updateNewValues(val))

    this.addReminderForm.get('is12hrCheckForm')?.valueChanges.subscribe(
      (value)=> this.toggleTimeMode(value))
    this.addReminderForm.get('boxSelectForm')?.valueChanges.subscribe(
      (value)=> this.updateOnChangeBox(value));

    
    this.addToTimes12Form();
  }



  private addToTimes12Form(hour:number=12,minute:number=0,ampm:String="Pm", dosage:number=1, time_id:number = 0){
    const form = new FormGroup({
      hour12Form:new FormControl(hour, Validators.required),
      minForm:new FormControl(minute, Validators.required),
      amPmForm:new FormControl(ampm, Validators.required),
      dosageForm:new FormControl(dosage, Validators.required),
      time_id:new FormControl(time_id)
    });
    (<FormArray>this.addReminderForm.get('times12Form')).push(form);
  }
  private addToTimes24Form(hour:number=12,minute:number=0, dosage:number=1, time_id:number = 0){
    const form = new FormGroup({
      hour24Form:new FormControl(hour, Validators.required),
      minForm:new FormControl(minute, Validators.required),
      dosageForm:new FormControl(dosage, Validators.required),
      time_id:new FormControl(time_id)
    });
    (<FormArray>this.addReminderForm.get('times24Form')).push(form);
  }

  private updateOnChangeBox(med_id:number){
    this.addReminderForm.get("boxSelectForm")?.setValue(med_id,{emitEvent:false})
    for(let reminder of this.reminders)
      if(reminder.med_id == med_id){
        this.updateTimeValues(reminder.times)
        break;
      }   
    this.isSubmitDisabled=false;
    this.isAddTimeDisabled=false;
  }


  private updateTimeValues(times:Time[]){
    if(this.addReminderForm.get('is12hrCheckForm')?.value){
      (<FormArray>this.addReminderForm.get('times12Form')).clear()
      for(let time of times){
        let hourMinute = time.time.split(':')
        let convertedTime = this.convert24to12({"hour":Number(hourMinute[0]),"minute":Number(hourMinute[1])})
        this.addToTimes12Form(convertedTime.hr, convertedTime.min,
                              convertedTime.ampm, time.dosage,
                              time.time_id
                            );
      }
    }else{
      (<FormArray>this.addReminderForm.get('times24Form')).clear()
      for(let time of times){
        let hourMinute = time.time.split(':')
        this.addToTimes24Form(Number(hourMinute[0]), Number(hourMinute[1]), time.dosage, time.time_id);
      }
    }
  }


  private toggleTimeMode(mode:boolean){
    mode==true? this.timeModeStatus="12-Hr" : this.timeModeStatus="24-Hr"
    if(!this.addReminderForm.get('is12hrCheckForm')?.value){
      while(((<FormArray>this.addReminderForm.get('times12Form')).length)!=0){
        let obj = (<FormArray>this.addReminderForm.get('times12Form')).at(0).value
        let time = {"hour":Number(obj.hour12Form),"minute":Number(obj.minForm),"ampm":String(obj.amPmForm)}
        let time24 = this.convert12to24(time)
        this.addToTimes24Form(time24.hr, time24.min, obj.dosageForm, obj.time_id);
        (<FormArray>this.addReminderForm.get('times12Form')).removeAt(0)
      }
    }else{
      while(((<FormArray>this.addReminderForm.get('times24Form')).length)!=0){
        let obj = (<FormArray>this.addReminderForm.get('times24Form')).at(0).value
        let time12 = this.convert24to12({"hour":Number(obj.hour24Form), "minute":Number(obj.minForm)})
        this.addToTimes12Form(time12.hr, time12.min, time12.ampm, obj.dosageForm, obj.time_id);
        (<FormArray>this.addReminderForm.get('times24Form')).removeAt(0)
      }
    }
  }

  private findReminderById(med_id:number):number{
    for(let i=0;i<this.reminders.length;i++)
      if(this.reminders[i].med_id == med_id)
        return i
    return NaN
  }

  public addReminder(){
    let med_id = this.addReminderForm.get("boxSelectForm")?.value
    let currentReminder:Reminder = this.getReminderById(med_id)
    let timeList:Array<Time>=[];


    if(!this.addReminderForm.get('is12hrCheckForm')?.value){
      (<FormArray>this.addReminderForm.get('times24Form')).controls.forEach((a)=>{
        let obj = a.value;
        let time24 = this.addZeroAstetic(obj.hour24Form)+":"+this.addZeroAstetic(obj.minForm)
        timeList.push({time_id : obj.time_id, time : time24 , dosage : obj.dosageForm}as Time);
      })
    }else{
      (<FormArray>this.addReminderForm.get('times12Form')).controls.forEach((a)=>{
        let obj = a.value;
        let time24 = this.convert12to24({"hour":Number(obj.hour12Form),"minute":Number(obj.minForm),"ampm":String(obj.amPmForm)});
        let time24String = this.addZeroAstetic(time24.hr)+":"+this.addZeroAstetic(time24.min)
        timeList.push({time_id : obj.time_id, time : time24String, dosage : obj.dosageForm}as Time);
      })
    }

    let reminderToAdd:Reminder = {
      med_id:currentReminder.med_id,
      med_name:currentReminder.med_name,
      med_box_no:currentReminder.med_box_no,
      med_amount:currentReminder.med_amount,
      times: timeList
    } as Reminder

    var tempReminder:Reminder = this.reminders[0]
    this.reminderService.addReminder(reminderToAdd).subscribe({
      next:(addedReminder:Reminder)=>{
        console.log(addedReminder)
        tempReminder = addedReminder
      },error(error:HttpErrorResponse){
        alert(error.message)
      },complete:()=>{
        var reminderIndex:number =  this.findReminderById(med_id)
        this.reminders[reminderIndex] = tempReminder 
        this.updateOnChangeBox(this.reminders[reminderIndex].med_id)
        this.reminderService.getReminders().subscribe({
          next:(response:Reminder[])=>{
            this.reminders = response
          },error:(error:HttpErrorResponse)=>{
            alert(error.message)
          },complete:()=>{
            this.afterGetRequest()
          }
        })
      }
    })
  }


  private getReminderById(med_id:number):Reminder{
    for(var reminder of this.reminders)
      if(reminder.med_id == med_id)
        return reminder
    return  {
      medicine:{},
      times: [{}]
    } as Reminder
  }
  

  private updateNewValues(medicine:Medicine){
    if(medicine.med_id != 0){
      this.reminderService.getReminders().subscribe({
        next:(response:Reminder[])=>{
          console.log(response)
          this.reminders = response
        },error:(error:HttpErrorResponse)=>{
          alert(error.message)
        },complete:()=>{
          this.afterGetRequest()
          this.addReminderForm.get("boxSelectForm")?.setValue(medicine.med_id,{emitEvent:true})
        }
      })
    }
  }


  public refreshValues(){
    this.reminderService.getReminders().subscribe({
      next:(response:Reminder[])=>{
        console.log(response)
        this.reminders = response
      },error:(error:HttpErrorResponse)=>{
        alert(error.message)
      },complete:()=>{
        this.afterGetRequest()
      }
    })
  }


  private async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }


  afterGetRequest(){
    this.boxNumbersFull=[];
    for(var a of this.reminders)
      this.boxNumbersFull.push({"med_id": Number(a.med_id),"med_box_no":Number(a.med_box_no)})
    this.boxNumbersFull.sort((n1,n2)=> Number(n1.med_box_no) - Number(n2.med_box_no))
  }


  private convert12to24({hour, minute, ampm}:{hour:number, minute:number,ampm:String}):
  {hr:number,min:number}{
    if(hour==12){
      if(ampm=="Am")
        return {hr:0, min:minute}
      return {hr:12, min:minute}
    }else if(ampm=="Pm")
      return {hr:hour+12, min:minute}
    return {hr:hour, min:minute}
  }


  private convert24to12({hour, minute}:{hour:number, minute:number}):
  {hr:number, min:number, ampm:String}{
    if(hour==12)
      return {hr:12,min:minute ,ampm:'Pm'}
    if(hour==0)
      return {hr:12, min:minute, ampm:'Am'}
    if(hour>12)
      return {hr:hour-12, min:minute, ampm:'Pm'}
    return {hr:hour, min:minute, ampm:'Am'}
  } 


  public getTimes24(){
    return this.addReminderForm.get("times24Form") as FormArray
  }


  public getTimes12(){
    return this.addReminderForm.get("times12Form") as FormArray
  }


  public toggleMed(){
    this.addMed=='true'? this.addMed='false' : this.addMed='true';
  }


  private addZeroAstetic(num:number):String{
    if(num<=9) return ('0'+ String(num)); return String(num)
  }


  public addTimeToTimesForm(){
    if(this.addReminderForm.get('is12hrCheckForm')?.value){
      this.addToTimes12Form()
    }else{
      this.addToTimes24Form()
    }
  }


  public removeTimeFromTimesForm(index:number){
    if(this.addReminderForm.get('is12hrCheckForm')?.value)
      (<FormArray>this.addReminderForm.get('times12Form')).removeAt(index)
    else
      (<FormArray>this.addReminderForm.get('times24Form')).removeAt(index)
  }


  public generateRandValues(){
    this.addReminderForm.get('is12hrCheckForm')?.setValue(false);
    let randNo = Math.floor(Math.random() * this.reminders.length);
    this.addReminderForm.get("boxSelectForm")?.setValue(this.reminders[randNo].med_id);
    let randSizeOfTimes = Math.floor(Math.random() * 5)+1;
    for(let i=0;i<randSizeOfTimes;i++){
      let hr24 = Math.floor(Math.random() * 23);
      let min24 = Math.floor(Math.random() * 59);
      let dosage = Math.floor(Math.random() * 5)+1;
      this.addToTimes24Form(hr24, min24, dosage);
    }
    (<FormArray>this.addReminderForm.get('times12Form')).clear()
  } 


  private fillTimeArrays(){
    this.hours12=[];
    this.hours24=[];
    this.mins=[];

    for(let i=1;i<=12;i++)
      (i<=9) ? this.hours12.push('0'+ i) : this.hours12.push(String(i));
    for(let i=0;i<24;i++)
      (i<=9) ? this.hours24.push('0'+ i) : this.hours24.push(String(i));
    for(let i=1;i<60;i++)
      (i<=9) ? this.mins.push('0'+ i) : this.mins.push(String(i));
  }

  public getSortedMedicinesByName():Medicine[]{
    let meds:Medicine[] = this.reminders
    return meds.sort((n1,n2)=> n1.med_name > n2.med_name ? 1: -1)
  }


  public getSortedMedicinesByBox():Medicine[]{
    let meds:Medicine[] = this.reminders
    return meds.sort((n1,n2)=> n1.med_box_no - n2.med_box_no)
  }
}
