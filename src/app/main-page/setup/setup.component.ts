import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidators } from 'src/app/Validators/CustomValidators.validator';
import { SetupService } from '../modeB/service/setup.service';



@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent {
 
  result:any;
  currentIp:String="";
  loading:boolean=false;
  connectionButton:string="Check Connection";
  colorClass:string = "error_text";
  status_text:string = "";

  public manageIpForm: FormGroup;
  public testESPForm: FormGroup;

  constructor(private setupService:SetupService){
    this.manageIpForm = new FormGroup({
      ipInputForm: new FormControl(null,[Validators.required, CustomValidators.ipValidator]),
    });
    this.testESPForm = new FormGroup({
      textInputForm: new FormControl(null),
    });
    // this.checkConnection();
    this.displayLoadingResult({espIp:"192.168.1.1"});

  }
  displayLoadingResult(status:{espIp:string}){
    if(status.espIp!= "null"){
      this.colorClass = "success_text";
      this.status_text = "Success"
      this.currentIp = status.espIp;
      console.log(status.espIp)
    }else{
      this.colorClass = "error_text";
      this.status_text = "Fail"
      this.currentIp = ""
    }
    this.showLoadingStatus(false)


  }
  
  showLoadingStatus(status:boolean){
    if(status){
      this.loading=true;
      this.connectionButton="Connecting.."
    }else{
      this.loading=false;
      this.connectionButton="Check Connection"
    }
  }

  checkConnection(){
    this.showLoadingStatus(true)
    this.setupService.getEspIP().subscribe({
      next: (response:{espIp:string})=>{
        console.log(response);
        this.displayLoadingResult(response);
      },
      error:(error: HttpErrorResponse)=>{
        console.log("ERROR");
        console.log(error);
        this.displayLoadingResult({espIp:"null"});
      }
    })
  }

  attemptConnection(){
    this.showLoadingStatus(true)
    this.setupService.esp_attempt_conn().subscribe({
      next: (response:{espIp:string})=>{
        console.log(response);
        this.displayLoadingResult(response);
      },
      error:(error: HttpErrorResponse)=>{
        console.log("ERROR");
        console.log(error);
        this.displayLoadingResult({espIp:"null"});
      }
    })
  }


  setESPiP(){
    console.log()
    this.showLoadingStatus(true)

    this.setupService.setEspIP(this.manageIpForm.get("ipInputForm")?.value).subscribe({
      next: (response:{espIp:string})=>{
        console.log(response);
        this.displayLoadingResult(response);
      },
      error:(error: HttpErrorResponse)=>{
        console.log("ERROR");
        console.log(error);
        this.displayLoadingResult({espIp:"null"});
      }
    })
  }

  esp_test(){
    console.log("value: ", this.testESPForm.get("textInputForm")?.value)
    this.setupService.esp_test(this.testESPForm.get("textInputForm")?.value).subscribe({
      next: (response:String)=>{
        console.log(response);
      },
      error:(error: HttpErrorResponse)=>{
        console.log("ERROR");
        console.log(error);
      }
    })
  }


  
}
