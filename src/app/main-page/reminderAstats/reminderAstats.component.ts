import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stats',
  templateUrl: './reminderAstats.component.html',
  styleUrls: ['./reminderAstats.component.css']
})
export class ReminderAStatsComponent {
  result:any;
  constructor(private http: HttpClient){
    this.refreshTable();
  }

  refreshTable(){
    this.http.post('http://localhost:8080/ESP_Manager/data?fromServer',{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        // this.result=res;
        this.result=res.Reminders;
        console.log(this.result);

      } catch (error) {
        console.log("ERROR");
      }   
    })
  }


}
