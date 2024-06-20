import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminderA.component.html',
  styleUrls: ['./reminderA.component.css']
})

export class ReminderAComponent implements OnInit{
 
  cNameActive:string="nav-link active";
  cName:string="nav-link";
  addReminder:string="";
  updateReminder:string="";
  delReminder:string="";
  
  constructor(private http: HttpClient,private router: Router){} 
  result:any;

  ngOnInit(): void {
    this.makeAddMain();
    this.router.navigate(['ReminderA/add']);
  }
  makeAddMain(){
    this.addReminder=this.cNameActive;
    this.updateReminder=this.cName;
    this.delReminder=this.cName;
  }
  makeUpdateMain(){
    this.addReminder=this.cName;
    this.updateReminder=this.cNameActive;
    this.delReminder=this.cName;
  }
  makeDelMain(){
    this.addReminder=this.cName;
    this.updateReminder=this.cName;
    this.delReminder=this.cNameActive;
  }

}
