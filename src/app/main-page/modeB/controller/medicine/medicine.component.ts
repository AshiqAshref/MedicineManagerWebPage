import { HttpClient } from '@angular/common/http';
import { Component ,OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent {
  cNameActive:string="nav-link success active";
  cName:string="nav-link";
  addReminder:string="";
  updateReminder:string="";
  delReminder:string="";
  
  constructor(private http: HttpClient,private router: Router){} 
  result:any;

  ngOnInit(): void {
    // this.makeDeleteMain();
    // this.makeAddMain();
    this.makeUpdateMain();
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
  makeDeleteMain(){
    this.addReminder=this.cName;
    this.updateReminder=this.cName;
    this.delReminder=this.cNameActive;
  }
}
