import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MedicineService } from '../../../service/medicine.service';
import { Medicine } from '../../../model/medicine';
import { AppService } from 'src/app/main-page/app.service';
import { CustomValidators } from 'src/app/Validators/CustomValidators.validator';

@Component({
  selector: 'app-update-med',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.css']
})
export class MedicineUpdateComponent {
  medicines:Medicine[]=[]
  boxNumbers:number[]=[];
  disableUpdateButton:boolean=true;
  updateMedicineForm: FormGroup;
 
  
  constructor(private medicineService: MedicineService, private appService:AppService,){
    this.refreshValues();
    this.updateMedicineForm = new FormGroup({
      updateOptionRadioForm:new FormControl("box"),
      nameSelectForm: new FormControl(null),
      boxSelectForm: new FormControl(null),
      nameInputForm: new FormControl(null,[Validators.required]),
      amountInputForm: new FormControl(null,[Validators.required, CustomValidators.onlyNumbers]),
      boxOptSelectForm: new FormControl(0),
    });
    this.updateOption("box")

    this.updateMedicineForm.get("updateOptionRadioForm")?.valueChanges.subscribe(
      (value)=> this.updateOption(value))
    this.updateMedicineForm.get("boxSelectForm")?.valueChanges.subscribe(
      (value)=> this.updateOnChangeBox(value))
    this.updateMedicineForm.get("nameSelectForm")?.valueChanges.subscribe(
      (value)=> this.updateOnChangeMed(value))

  }


  updateOnChangeBox(med_id:number){
    for(var medicine of this.medicines){
      if(medicine.med_id==med_id){
        this.updateMedicineForm.get("nameSelectForm")?.setValue(medicine.med_id,{emitEvent:false})
        this.updateMedicineForm.get("nameInputForm")?.setValue(medicine.med_name)
        this.updateMedicineForm.get("amountInputForm")?.setValue(medicine.med_amount)
        this.updateMedicineForm.get("boxOptSelectForm")?.setValue(medicine.med_box_no)
      }
    }
    this.disableUpdateButton=false;
  }
  updateOnChangeMed(med_id:number){
    for(var medicine of this.medicines){
      if(medicine.med_id==med_id){
        this.updateMedicineForm.get("boxSelectForm")?.setValue(medicine.med_id,{emitEvent:false})
        this.updateMedicineForm.get("nameInputForm")?.setValue(medicine.med_name)
        this.updateMedicineForm.get("amountInputForm")?.setValue(medicine.med_amount)
        this.updateMedicineForm.get("boxOptSelectForm")?.setValue(medicine.med_box_no)
      }
    }
    this.disableUpdateButton=false;
  }


  findMedicineById(med_id:number):number{
    for(let i=0;i<this.medicines.length;i++)
      if(this.medicines[i].med_id == med_id)
        return i
    return NaN
  }


  refreshValues(){
    this.medicineService.getMedicines().subscribe({
      next: (response: Medicine[])=>{
        console.log(response);
        this.medicines=response;
        this.medicines.sort((n1,n2)=> n1.med_box_no - n2.med_box_no)
        this.boxNumbers=[];
        for(let i=1; i<=16;i++) this.boxNumbers.push(i);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }

  
  getSortedMedicinesByName():Medicine[]{
    let meds:Medicine[] = this.medicines
    return meds.sort((n1,n2)=> n1.med_name > n2.med_name ? 1: -1)
  }
  getSortedMedicinesByBox():Medicine[]{
    let meds:Medicine[] = this.medicines
    return meds.sort((n1,n2)=> n1.med_box_no - n2.med_box_no)
  }


  updateOption(a:string){
    if(a=='name'){
      this.updateMedicineForm.get("nameSelectForm")?.enable()
      this.updateMedicineForm.get("boxSelectForm")?.disable()
    }
    else if(a=='box'){
      this.updateMedicineForm.get("boxSelectForm")?.enable()
      this.updateMedicineForm.get("nameSelectForm")?.disable()
    }
  }


  checkForDisabled(a:number){
    for(var medicine of this.medicines)
      if(medicine.med_box_no == a)
        return true
    return false
  }

  
  updateValues(medicine:Medicine){
    this.updateMedicineForm.get("nameSelectForm")?.setValue(medicine.med_id,{emitEvent:false})
    this.updateMedicineForm.get("boxSelectForm")?.setValue(medicine.med_id,{emitEvent:false})
    this.updateMedicineForm.get("nameInputForm")?.setValue(medicine.med_name)
    this.updateMedicineForm.get("amountInputForm")?.setValue(medicine.med_amount)
    this.updateMedicineForm.get("boxOptSelectForm")?.setValue(medicine.med_box_no)

    this.appService.setMessage(medicine)
  }


  updateMedicine(){
    this.disableUpdateButton=true;

    let newMedicine:Medicine ={
      med_id : this.updateMedicineForm.get("boxSelectForm")?.value,
      med_amount:this.updateMedicineForm.get("amountInputForm")?.value,
      med_name: this.updateMedicineForm.get("nameInputForm")?.value,
      med_box_no: this.updateMedicineForm.get("boxOptSelectForm")?.value
    }

    
    // Write ChecksHere
    


    this.medicineService.updateMedicine(newMedicine).subscribe({
      next : (updatedMedicine:Medicine)=>{
        console.log(updatedMedicine)
        this.medicines[this.findMedicineById(updatedMedicine.med_id)] = updatedMedicine
        this.updateValues(updatedMedicine)
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }}
    )
  }

}
