import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { modeB } from 'src/environments/environments';
import { Observable } from 'rxjs/internal/Observable';
import { CustomValidators } from 'src/app/Validators/CustomValidators.validator';

@Component({
  selector: 'app-add-med',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})



export class MedicineAddComponent {
  addMed:string='true';
  boxNumbers:Number[]=[];
  boxNumbersFull:Number[]=[];
  addButtonDisabled:boolean=false;
  addMedicineForm: FormGroup;
  result:any


  constructor(private http: HttpClient, private appService:AppService){
    this.refreshValues();
    this.addMedicineForm = new FormGroup({
      medNameForm: new FormControl(null,[Validators.required]),
      amountForm: new FormControl(null,[Validators.required, CustomValidators.onlyNumbers]),
      boxNumberForm: new FormControl(null,[CustomValidators.dropDownNotNull])
    });
    this.addMedicineForm.get('boxNumberForm')?.setValue("0")    
  }


  refreshValues(subscribe:boolean = true): Observable<any>{
    this.boxNumbers=[];
    this.boxNumbersFull=[];

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
        this.result=res;

        for(let i=1; i<=16;i++)
          this.boxNumbers.push(i);
        for(var a of this.result)
          this.boxNumbersFull.push(Number(a.medb_box_no))

        this.boxNumbersFull.sort((n1,n2)=> Number(n1) - Number(n2))
      } catch (error) {
        console.log("ERROR");
        console.log(error);
      } 
    })
    return observableRequest
  }


  checkForDisabled(a:any){
    for(var b of this.boxNumbersFull)
      if(Number(b)==Number(a))
        return true
    return false
  }


  addMedicine(){
    this.addButtonDisabled=true
    let med_name=this.addMedicineForm.get("medNameForm")?.value
    let med_amount=this.addMedicineForm.get("amountForm")?.value;
    let med_box_no=this.addMedicineForm.get("boxNumberForm")?.value;
    console.log(med_name,med_amount,med_box_no)

    let setVal = (name:string, val:String)=>{
      this.addMedicineForm.get(name)?.setValue(val)
    }

    this.http.post(modeB.addMedAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
      med_name:med_name,
      med_amount:med_amount,
      med_box_no:med_box_no
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      this.refreshValues().subscribe(()=>{
        setVal("medNameForm", res.med_name)
        setVal("amountForm", res.med_amount)
        setVal("boxNumberForm",res.med_box_no)

        this.appService.setMessage({
          med_id:res[0].med_id,
          med_name:res[0].med_name, 
          med_amount:res[0].med_amount, 
          med_box_no:res[0].med_box_no,
          emitEvent:true
        })
        
        this.addButtonDisabled = false
      })
    })
  }

 
}
