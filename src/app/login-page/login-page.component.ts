import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';




@Component({
  selector: 'app-loginPage',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})


@Injectable()
export class LoginPageComponent  {
  result:any;
   constructor(private http: HttpClient){}

  

  postMail(event:NgForm){
    this.http.post('http://localhost:8080/ESP_Manager/data?cred',{
      "headers":{
        "Content-Type": "application/json"
      },
      email:event.value.email,
      pass:event.value.Password
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
