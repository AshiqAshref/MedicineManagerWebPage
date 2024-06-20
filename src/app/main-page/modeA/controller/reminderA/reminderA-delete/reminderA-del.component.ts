
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { modeA } from 'src/environments/environments';

@Component({
  selector: 'app-reminder-del',
  templateUrl: './reminderA-del.component.html',
  styleUrls: ['./reminderA-del.component.css']
})

export class ReminderADeleteComponent implements OnInit {
  result:any;
  boxNumbers:Number[]=[0];
  hours:number[]=[0];
  mins:number[]=[0];
  currentHour:number=0;
  currentMin:number=0;
  currentId:String='';
  currentBoxModel:number = 0;

  constructor(private http: HttpClient){
    this.refreshValues();
  }


  ngOnInit(): void {
    this.hours=[];
    this.mins=[];
    for(let i=1;i<24;i++){
      this.hours.push(i);
    }
    for(let i=1;i<60;i++){
      this.mins.push(i);
    }
  }

  
  deleteReminder(event:NgForm){
    let Hour=Number(event.value.hour)
    let Mints=Number(event.value.min)
    let bbNo=Number(event.value.BoxNumber);
    let stringHour:string;
    let stringMin:string;
    let bNo:string;

    if(bbNo<=9){
      bNo='0'+bbNo.toLocaleString()
    }else{
      bNo=bbNo.toLocaleString();
    }

    if(Hour<=9){
      stringHour='0'+Hour.toLocaleString();
    }else{
      stringHour=Hour.toLocaleString();
    }
       
    if(Hour==24){
      stringHour='00';
    }if(Mints<9){
      stringMin='0'+Mints.toLocaleString();
    }else{
      stringMin=Mints.toLocaleString();
    }

    this.http.post(modeA.deleteReminderAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
      id:this.currentId
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        console.log(res);
      } catch (error) {
        console.log("ERROR");
      }
      this.currentBoxModel=0
      this.currentHour=0
      this.currentMin=0   
      this.refreshValues()
    })
  }


  updateOnChange(a:any){
    console.log(a);
    for(let i=0;i<this.result.length;i++){
      if(Number(this.result[i].rema_box_no)==a){
        this.currentHour=Number(this.result[i].rema_time.substring(0,2));
        this.currentMin=Number(this.result[i].rema_time.substring(3,this.result[i].rema_time.length));
        this.currentId=this.result[i].rema_id;
      }
    }
  }
  

  refreshValues(): Observable<any>{
    this.boxNumbers=[];
    let observableRequest = this.http.post(modeA.getAllRemindersAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
    }).pipe(map((response: any) => response))

    observableRequest.subscribe(res=>{
      try {
        this.result=res.Reminders;
     
        for(let j=0;j<this.result.length;j++){
          for(let i=1;i<=16;i++){
            if(Number(this.result[j].rema_box_no)==i){
              this.boxNumbers.push(i);
              break;
            }
          }
        }
        console.log(this.result)

      } catch (error) {
        console.log("ERROR");
      } 
    })
    return observableRequest;
  }
}
