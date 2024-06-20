import { AppService } from '../../app.service';
import { state, style, trigger, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { modeB } from 'src/environments/environments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mode-b-add',
  templateUrl: './reminderB-add.component.html',
  styleUrls: ['./reminderB-add.component.css'],
  animations:[
    trigger('toggleAddMed',[
      state('true',style({
        'margin':'20px', 
      })),
      state('false',style({
        'height':'0px',
        'width':'0px',
      })),
      transition('true<=>false',animate(90))
    ])
  ] 
})
export class ReminderBAddComponent{
  results:any;
  boxNumbersFull:{"medb_id":number,"medb_box_no":number}[]=[];
  hours12:String[]=['0'];
  hours24:String[]=['0'];
  mins:String[]=['0'];
  addMed:String='false';
  isSubmitDisabled:boolean=true;
  isAddTimeDisabled:boolean=true;
  timeModeStatus:String = "12-Hr"
  addReminderForm:FormGroup;

  constructor(private http: HttpClient, private appService:AppService){
    this.fillTimeArrays();

    this.addReminderForm=new FormGroup({
      boxSelectForm:new FormControl(0),
      nameSelectForm:new FormControl(0),
      is12hrCheckForm:new FormControl(true),
      times12Form: new FormArray([]),
      times24Form: new FormArray([])
    }); 

    this.appService.getMessage.subscribe(
      (val)=>this.updateNewValues(val))
    this.addReminderForm.get('is12hrCheckForm')?.valueChanges.subscribe(
      (value)=> this.toggleTimeMode(value))
    this.addReminderForm.get('boxSelectForm')?.valueChanges.subscribe(
      (value)=> this.updateOnChangeBox(value));
    this.addReminderForm.get('nameSelectForm')?.valueChanges.subscribe(
      (value)=> this.updateOnChangeMed(value))
    
    this.addToTimes12Form();
  }



  addToTimes12Form(hour:number=12,minute:number=0,ampm:String="Pm", dosage:number=1, time_id:number = 0){
    const form = new FormGroup({
      hour12Form:new FormControl(hour, Validators.required),
      minForm:new FormControl(minute, Validators.required),
      amPmForm:new FormControl(ampm, Validators.required),
      dosageForm:new FormControl(dosage, Validators.required),
      time_id:new FormControl(time_id)
    });
    (<FormArray>this.addReminderForm.get('times12Form')).push(form);
  }
  addToTimes24Form(hour:number=12,minute:number=0, dosage:number=1, time_id:number = 0){
    const form = new FormGroup({
      hour24Form:new FormControl(hour, Validators.required),
      minForm:new FormControl(minute, Validators.required),
      dosageForm:new FormControl(dosage, Validators.required),
      time_id:new FormControl(time_id)
    });
    (<FormArray>this.addReminderForm.get('times24Form')).push(form);
  }


  updateOnChangeMed(medb_id:number){
    this.addReminderForm.get("boxSelectForm")?.setValue(medb_id,{emitEvent:false})
    for(let result of this.results)
      if(result.medb_id == medb_id){
        this.updateTimeValues(result.timeb_times)
        break;
      } 
    this.isSubmitDisabled=false;
    this.isAddTimeDisabled=false;
  }
  updateOnChangeBox(medb_id:number){
    this.addReminderForm.get("nameSelectForm")?.setValue(medb_id,{emitEvent:false})
    for(let result of this.results)
      if(result.medb_id == medb_id){
        this.updateTimeValues(result.timeb_times)
        break;
      }   
    this.isSubmitDisabled=false;
    this.isAddTimeDisabled=false;
  }


  updateTimeValues(times:{timeb_time:String, timeb_dosage:number, timeb_id:number}[]){
    if(this.addReminderForm.get('is12hrCheckForm')?.value){
      (<FormArray>this.addReminderForm.get('times12Form')).clear()
      for(let time of times){
        console.log(time)
        let hourMinute = time.timeb_time.split(':')
        let convertedTime = this.convert24to12({"hour":Number(hourMinute[0]),"minute":Number(hourMinute[1])})
        this.addToTimes12Form(convertedTime.hr, convertedTime.min, convertedTime.ampm, time.timeb_dosage, time.timeb_id);
      }
    }else{
      (<FormArray>this.addReminderForm.get('times24Form')).clear()
      for(let time of times){
        console.log(time)
        let hourMinute = time.timeb_time.split(':')
        this.addToTimes24Form(Number(hourMinute[0]), Number(hourMinute[1]), time.timeb_dosage, time.timeb_id);
      }
    }
  }


  toggleTimeMode(mode:boolean){
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


  addReminder(){
    let timeList:Object[]=[];
    let medb_id = this.addReminderForm.get("boxSelectForm")?.value

    if(!this.addReminderForm.get('is12hrCheckForm')?.value){
      (<FormArray>this.addReminderForm.get('times24Form')).controls.forEach((a)=>{
        let obj = a.value;
        let time24 = this.addZeroAstetic(obj.hour24Form)+":"+this.addZeroAstetic(obj.minForm)
        timeList.push({timeb_id : obj.time_id, timeb_time : time24 ,timeb_dosage : obj.dosageForm});
      })
    }else{
      (<FormArray>this.addReminderForm.get('times12Form')).controls.forEach((a)=>{
        let obj = a.value;
        let time24 = this.convert12to24({"hour":Number(obj.hour12Form),"minute":Number(obj.minForm),"ampm":String(obj.amPmForm)});
        let time24String = this.addZeroAstetic(time24.hr)+":"+this.addZeroAstetic(time24.min)
        timeList.push({timeb_id : obj.time_id, timeb_time : time24String, timeb_dosage : obj.dosageForm});
      })
    }
   
    this.http.post(modeB.addReminderAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
      medb_id:medb_id,
      times:timeList
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        // console.log(res);
      } catch (error) {
        console.log("ERROR");
      }   
    })
  }
  

  updateNewValues({medb_id,emitEvent}:{medb_id:number,emitEvent:boolean}){
    this.refreshValues(true).subscribe((val)=>{
      this.afterGetRequest(val)
      this.addReminderForm.get("boxSelectForm")?.setValue(medb_id,{emitEvent:emitEvent})
    })
  }


  refreshValues(returnSubscribe:boolean=false):Observable<any>{
    let observableRequest = this.http.post(modeB.getAllRemindersAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
    }).pipe(map((response: any) => response))

    if(returnSubscribe)
      return observableRequest

    observableRequest.subscribe(res=>{
      try {
        this.afterGetRequest(res)
      } catch (error) {
        console.log("ERROR"); 
        console.log(error);
      } 
    })
    return observableRequest
  }


  afterGetRequest(value:any){
    this.results=value.Reminders;
    console.log(this.results);

    this.boxNumbersFull=[];
    for(var a of this.results)
      this.boxNumbersFull.push({"medb_id": Number(a.medb_id),"medb_box_no":Number(a.medb_box_no)})
    this.boxNumbersFull.sort((n1,n2)=> Number(n1.medb_box_no) - Number(n2.medb_box_no))
  }


  convert12to24({hour, minute, ampm}:{hour:number, minute:number,ampm:String}):
  {hr:number,min:number}{
    if(hour==12){
      if(ampm=="Am")
        return {hr:0, min:minute}
      return {hr:12, min:minute}
    }else if(ampm=="Pm")
      return {hr:hour+12, min:minute}
    return {hr:hour, min:minute}
  }


  convert24to12({hour, minute}:{hour:number, minute:number}):
  {hr:number, min:number, ampm:String}{
    if(hour==12)
      return {hr:12,min:minute ,ampm:'Pm'}
    if(hour==0)
      return {hr:12, min:minute, ampm:'Am'}
    if(hour>12)
      return {hr:hour-12, min:minute, ampm:'Pm'}
    return {hr:hour, min:minute, ampm:'Am'}
  } 


  getTimes24(){
    return this.addReminderForm.get("times24Form") as FormArray
  }


  getTimes12(){
    return this.addReminderForm.get("times12Form") as FormArray
  }


  toggleMed(){
    this.addMed=='true'? this.addMed='false' : this.addMed='true';
  }


  addZeroAstetic(num:number):String{
    if(num<=9) return ('0'+ String(num)); return String(num)
  }


  addTimeToTimesForm(){
    if(this.addReminderForm.get('is12hrCheckForm')?.value){
      this.addToTimes12Form()
    }else{
      this.addToTimes24Form()
    }
  }

  
  removeTimeFromTimesForm(index:number){
    if(this.addReminderForm.get('is12hrCheckForm')?.value)
      (<FormArray>this.addReminderForm.get('times12Form')).removeAt(index)
    else
      (<FormArray>this.addReminderForm.get('times24Form')).removeAt(index)
  }


  generateRandValues(){
    this.addReminderForm.get('is12hrCheckForm')?.setValue(false);
    let randNo = Math.floor(Math.random() * this.results.length);
    this.addReminderForm.get("boxSelectForm")?.setValue(this.results[randNo].medb_id);
    let randSizeOfTimes = Math.floor(Math.random() * 5)+1;
    for(let i=0;i<randSizeOfTimes;i++){
      let hr24 = Math.floor(Math.random() * 23);
      let min24 = Math.floor(Math.random() * 59);
      let dosage = Math.floor(Math.random() * 5)+1;
      this.addToTimes24Form(hr24, min24, dosage);
    }
    (<FormArray>this.addReminderForm.get('times12Form')).clear()
  } 


  fillTimeArrays(){
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


}
