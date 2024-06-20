

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { modeB } from 'src/environments/environments';
import { Observable } from 'rxjs/internal/Observable';
import { CustomValidators } from 'src/app/Validators/CustomValidators.validator';
import { AppService } from 'src/app/main-page/app.service';
import { medicine } from '../../../model/medicine';

@Component({
  selector: 'app-add-med',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})



export class MedicineAddComponent {
  addMed:string='true';
  boxNumbers:Number[]=[];
  addButtonDisabled:boolean=false;
  addMedicineForm: FormGroup;
  results:medicine[]=[]


  constructor(private http: HttpClient, private appService:AppService){
    this.refreshValues();
    this.addMedicineForm = new FormGroup({
      medNameForm: new FormControl(null,[Validators.required]),
      amountForm: new FormControl(null,[Validators.required, CustomValidators.onlyNumbers]),
      boxNumberForm: new FormControl(0,[CustomValidators.dropDownNotNull])
    });
    this.addMedicineForm.get("boxNumberForm")?.valueChanges.subscribe(
      (value)=> this.onBoxChange(value))
    
  }


  onBoxChange(med_box_no:number){
    var found:boolean = false 
    for(let result of this.results)
      if(result.med_box_no == med_box_no){
        this.addMedicineForm.get("medNameForm")?.setValue(result.med_name)
        this.addMedicineForm.get("amountForm")?.setValue(result.med_amount)
        found = true
        break
      }
    if(!found){
      this.addMedicineForm.get("medNameForm")?.reset()
      this.addMedicineForm.get("amountForm")?.reset()
    }
  }

  
  refreshValues(subscribe:boolean = true): Observable<any>{
    this.boxNumbers=[];

    let observableRequest = this.http.get(modeB.getAllMedsAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    if(subscribe)
    observableRequest.subscribe(res=>{
      try {
        console.log(res);
        this.results=res;

        for(let i=1; i<=16;i++)
          this.boxNumbers.push(i);

      } catch (error) {
        console.log("ERROR");
        console.log(error);
      } 
    })
    return observableRequest
  }


  checkForDisabled(a:any){
    for(var b of this.results)
      if(Number(b.med_box_no)==Number(a))
        return "disabled"
    return "notdisabled"
  }


  addMedicine(){
    this.addButtonDisabled=true
    let med_id = NaN
    let med_name=this.addMedicineForm.get("medNameForm")?.value
    let med_amount=this.addMedicineForm.get("amountForm")?.value;
    let med_box_no=this.addMedicineForm.get("boxNumberForm")?.value;
    for(var result of this.results)
      if(result.med_box_no == med_box_no)
        med_id = result.med_id
    
    console.log(med_name,med_amount,med_box_no)

    this.http.post(modeB.addMedAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
      med_id:med_id,
      med_name:med_name,
      med_amount:med_amount,
      med_box_no:med_box_no
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        this.results.push(res)
        let setVal = (name:string, val:String)=>{
          this.addMedicineForm.get(name)?.setValue(val)
        }
        setVal("medNameForm", res.med_name)
        setVal("amountForm", res.med_amount)
        setVal("boxNumberForm",res.med_box_no)

        this.appService.setMessage({
          med_id:res.med_id,
          med_name:res.med_name, 
          med_amount:res.med_amount, 
          med_box_no:res.med_box_no,
          emitEvent:true
        })
        
        this.addButtonDisabled = false
      } catch (error) {
        console.log("EEEerrorRRR");
        console.log(error);
      }
    })
  }

 
}
