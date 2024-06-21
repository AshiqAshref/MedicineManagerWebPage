
import { Component,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { modeA } from 'src/environments/environments';
import { Observable } from 'rxjs/internal/Observable';
import { ReminderA } from '../../../model/reminderA';


@Component({
  selector: 'app-reminder-add',
  templateUrl: './reminderA-add.component.html',
  styleUrls: ['./reminderA-add.component.css']
})
export class ReminderAAddComponent implements OnInit{
  results:any;
  takenboxNumbers:Number[]=[];
  boxNumbers:Number[]=[];
  boxNoModel:number = 0;
  hours:number[]=[0];
  mins:number[]=[0];
  buttonDisable:boolean=false;

  constructor(private http: HttpClient){
    this.refreshValues();
  }

  ngOnInit(): void {
    this.hours=[];
    this.mins=[];
    this.boxNumbers=[];
    for(let i=1;i<=12;i++){
      this.hours.push(i);
    }
    for(let i=1;i<60;i++){
      this.mins.push(i);
    }
    for(let i=1;i<=16;i++){
      this.boxNumbers.push(i);
    }
  }

  checkIfReserved(a:Number):Boolean{
    for(var b of this.takenboxNumbers)
      if(a==b)
        return true;
    return false;
  }
  
  addReminder(event:NgForm){
    let Hour=Number(event.value.hour)
    let Mints=Number(event.value.min)
    let bNo=Number(event.value.BoxNumber);
    let stringHour:string;
    let stringMin:string;

    this.buttonDisable=true
   


    if(event.value.AmPm=='Pm'){
      Hour=Hour+12
      stringHour=Hour.toLocaleString();
    }else{
      if(Hour<=9){
        stringHour='0'+Hour.toLocaleString();
      }else{
        stringHour=Hour.toLocaleString();
      }
      
    }if(Hour==24){
      stringHour='00';
    }if(Mints<9){
      stringMin='0'+Mints.toLocaleString();
    }else{
      stringMin=Mints.toLocaleString();
    }

    const a:ReminderA = {id:NaN, time:stringHour+":"+stringMin, boxNo:bNo}
    this.http.post(modeA.addReminderAddress,a,{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        console.log(res);
      } catch (error) {
        console.log("ERROR");
      }
      this.refreshValues().subscribe(() => {
        this.boxNoModel = bNo;
      })
    })
    this.http.post(modeA.addReminderAddress,a)
  }
  

  updateOnChange(){
    this.buttonDisable=false
  }


  refreshValues(): Observable<any>{
    this.takenboxNumbers=[];
    let observableReq = this.http.get(modeA.getAllRemindersAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
    }).pipe(map((response: any) => response))
    
    observableReq.subscribe(res=>{
      try {
        console.log(res);
        this.results=res;
        for(var a of this.results){
          for(let i=1;i<=16;i++){
            if(Number(a.boxNo)==i){
              this.takenboxNumbers.push(i);
              break;
            }
          }
        }
      } catch (error) {
        console.log(error);
      } 
    })
    return observableReq
  }

}
