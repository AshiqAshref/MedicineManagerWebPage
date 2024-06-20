import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent {
  constructor(private http: HttpClient){}
  result:any;
  currentIp:String="";
  statusCode:String="";
  cname:string="spinner-grow spinner-grow-sm "
  loading:boolean=false;
  connectionButton:string="Check Connection";
  statusClass:String="card-body";

  ngOnInit():void {
    this.getIp();
  }


  checkConnection(){
    this.statusClass="card-body";
    this.statusCode="";
    this.loading=true;
    this.connectionButton="Connecting.."
    console.log("Checking Connection");
    this.http.post('http://localhost:8080/ESP_Manager/update?updateDevice',{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try{
        
        console.log(res);
        let resp:String =res.status;
        console.log(resp);
        if(resp.match("ok")){
          this.statusClass="card-body text-success";
        }else if(resp.match("error")){
          this.statusClass="card-body text-danger";
          this.statusCode=res.error;
        }else if(resp.match("error_code")){
          this.statusClass="card-body text-danger";
          this.statusCode=res.error_code;
        }
        console.log("statCode: "+this.statusCode)
        

        this.loading=false;
        this.connectionButton="Check Connection"
      }catch (error) {
        this.loading=false;
        this.connectionButton="Check Connection"
        console.log("ERROR");
        console.log(error);
      } 
    })
  }


  getIp(){
    this.http.post('http://localhost:8080/ESP_Manager/update?getIp',{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try{
        console.log(res);
        this.result=res.ipAddress;
        console.log(this.result);
        this.currentIp=this.result;
      }catch (error) {
        console.log("ERROR");
        console.log(error);
      } 
    })
  }

  setESPiP(event:NgForm){
    this.http.post('http://localhost:8080/ESP_Manager/update?setIp',{
      "headers":{
        "Content-Type": "application/json"
      },
      ipAddr:event.value.ip
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        this.result=res;
        console.log(res);
        this.getIp();

      } catch (error) {
        console.log("ERROR");
      }   
    })

  }
}
