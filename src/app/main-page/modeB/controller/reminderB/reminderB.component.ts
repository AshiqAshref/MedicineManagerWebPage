import { HttpClient } from '@angular/common/http';
import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mode-b-reminders',
  templateUrl: './reminderB.component.html',
  styleUrls: ['./reminderB.component.css']
})
export class ReminderBComponent {
  cNameActive:string="nav-link active";
  cName:string="nav-link";
  addReminder:string="";
  updateReminder:string="";
  delReminder:string="";
  
  constructor(private http: HttpClient,private router: Router){} 
  result:any;

  ngOnInit(): void {
    this.makeAddMain();
  }
  makeAddMain(){
    this.router.navigate(['ReminderB/add']);
    this.addReminder=this.cNameActive; 
    this.updateReminder=this.cName;
    this.delReminder=this.cName;
  }
}
