
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent{

  result:any;
 
  constructor(private http: HttpClient){
    this.refreshTable();
  }

  refreshTable(){
    this.http.post('http://localhost:8080/ESP_Manager/data?getAllUsers',{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        // this.result=res;
        this.result=res.Users;
        console.log(this.result);

      } catch (error) {
        console.log("ERROR");
      }   
    })
  }
  addUser(event:NgForm){

    this.http.post('http://localhost:8080/ESP_Manager/data?addUser',{
      "headers":{
        "Content-Type": "application/json"
      },
      email:event.value.email,
      pass :event.value.password,
      fName:event.value.firstname,
      lName:event.value.lastname
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        this.result=res;
        console.log(res);

      } catch (error) {
        console.log("ERROR");
      }   
    })
  }

}
