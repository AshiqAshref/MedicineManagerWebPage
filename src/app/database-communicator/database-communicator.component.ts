import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'database',
  templateUrl: './database-communicator.component.html',
  styleUrls: ['./database-communicator.component.css']
})
@Injectable()
export class DatabaseCommunicatorComponent {
  result: any;
  isPr: boolean=false;
  constructor(private http: HttpClient){}
  
  startReq(){
    this.isPr=true;
    this.http.get('http://localhost:8080/MainServer/data?fetchAllReminderAs',{
      "headers":{
        "Content-Type": "application/json"
      }
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      this.result=res.Reminders;
    })

  }

  
}
