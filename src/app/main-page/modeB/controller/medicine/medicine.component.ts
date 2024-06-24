import { Component } from '@angular/core';
import { Medicine } from '../../model/medicine';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MedicineService } from '../../service/medicine.service';
import { AppService } from 'src/app/main-page/app.service';
import { CustomValidators } from 'src/app/Validators/CustomValidators.validator';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent {
  public medicines:Medicine[]=[]
  public boxNumbers:number[]=[]; 
  public updateMedicineForm: FormGroup;
  public modeAddOrUpdate:Boolean = true;
  public boxNoLabel:String = "Choose a Box" 
  public deleteButtonDisabled:boolean = true
  private defaultValues

 
  constructor(private medicineService: MedicineService, private appService:AppService,){
    this.refreshValues();
    this.updateMedicineForm = new FormGroup({
      medicineSelectForm: new FormControl(0, {nonNullable:true}),
      nameInputForm: new FormControl(null,[Validators.required]),
      amountInputForm: new FormControl(null,[Validators.required, CustomValidators.onlyNumbers]),
      boxSelectForm: new FormControl(0, [CustomValidators.dropDownNotNull]),
    });
    this.defaultValues = this.updateMedicineForm.value;

    this.updateMedicineForm.get("medicineSelectForm")?.valueChanges.subscribe(
      (value)=> this.updateOnChangeBox(value))

  }

 

  private updateOnChangeBox(med_id:number){
    if(med_id == 0){
      this.modeAddOrUpdate=true
      this.deleteButtonDisabled = true
      this.boxNoLabel = "Choose a Box"
      this.updateMedicineForm.reset(this.defaultValues,{emitEvent:false})
      this.updateMedicineForm.get("boxSelectForm")?.setValidators([CustomValidators.dropDownNotNull])
      this.updateMedicineForm.get("boxSelectForm")?.updateValueAndValidity()
    }else{
      let medicine = this.getMedicineById(med_id)
      this.updateMedicineForm.get("medicineSelectForm")?.setValue(medicine.med_id,{emitEvent:false})
      this.updateMedicineForm.get("nameInputForm")?.setValue(medicine.med_name)
      this.updateMedicineForm.get("amountInputForm")?.setValue(medicine.med_amount)
      this.updateMedicineForm.get("boxSelectForm")?.setValue(medicine.med_box_no)
      this.modeAddOrUpdate=false
      this.deleteButtonDisabled = false
      this.boxNoLabel = "Choose new box (Optional)"
      this.updateMedicineForm.get("boxSelectForm")?.removeValidators([CustomValidators.dropDownNotNull])
      this.updateMedicineForm.markAsPristine()
      this.updateMedicineForm.get("boxSelectForm")?.updateValueAndValidity()
    }
  }



  public refreshValues(){
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


  public onAdd():boolean{
    let addMedicine:Medicine = {
      med_id : NaN,
      med_amount:this.updateMedicineForm.get("amountInputForm")?.value,
      med_name: this.updateMedicineForm.get("nameInputForm")?.value,
      med_box_no: this.updateMedicineForm.get("boxSelectForm")?.value
    }
    console.log(addMedicine)
    for(var medicine of this.medicines){
      if(medicine.med_name == addMedicine.med_name.trim()){
        alert("This medicine already exist in box no "+ medicine.med_box_no)
        return false
      }
    }

    this.medicineService.addMedicine(addMedicine).subscribe({
      next: (newMedicine:Medicine)=>{
        console.log(newMedicine)
        this.medicines.push(newMedicine)
        this.updateValues(newMedicine)
      },
      complete() {
          return true
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        return false
      }
    })
    return false
  }


  public onUpdate(){
    let updateMedicine:Medicine ={
      med_id : this.updateMedicineForm.get("medicineSelectForm")?.value,
      med_amount:this.updateMedicineForm.get("amountInputForm")?.value,
      med_name: this.updateMedicineForm.get("nameInputForm")?.value,
      med_box_no: this.updateMedicineForm.get("boxSelectForm")?.value
    }
    let orginalMedicine:Medicine =this.getMedicineById(updateMedicine.med_id)

    if(orginalMedicine.med_name==updateMedicine.med_name &&
      orginalMedicine.med_amount==updateMedicine.med_amount &&
      orginalMedicine.med_box_no==updateMedicine.med_box_no
    ){
      alert("Atleast 1 value should be different to update")
        return 
    }

    for(var medicine of this.medicines){
      if(medicine.med_name == updateMedicine.med_name.trim() && 
        medicine.med_box_no != orginalMedicine.med_box_no
      ){
        console.log(medicine.med_box_no, updateMedicine.med_box_no)
        alert("This medicine already exist in box no "+ medicine.med_box_no)
        return 
      }
    }


    this.medicineService.updateMedicine(updateMedicine).subscribe({
      next : (updatedMedicine:Medicine)=>{
        console.log(updatedMedicine)
        this.medicines[this.findMedicineById(updatedMedicine.med_id)] = updatedMedicine
        this.updateValues(updatedMedicine)
      },error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }


  public onDelete():boolean{
    let med_id :number =  this.updateMedicineForm.get("medicineSelectForm")?.value

    this.medicineService.deleteMedicine(med_id).subscribe({
      complete: (response: void) => {
        this.updateMedicineForm.reset()
        this.refreshValues();
        return true
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        return false
      }
    })
    return false
  }

  private updateValues(medicine:Medicine){
    this.appService.setMessage(medicine)
    this.updateMedicineForm.get("medicineSelectForm")?.setValue(medicine.med_id)
    this.updateMedicineForm.get("nameInputForm")?.setValue(medicine.med_name)
    this.updateMedicineForm.get("amountInputForm")?.setValue(medicine.med_amount)
    this.updateMedicineForm.get("boxSelectForm")?.setValue(medicine.med_box_no)
  }

  private getMedicineById(med_id:number):Medicine{
    for(var medicine of this.medicines)
      if(medicine.med_id == med_id)
        return medicine
    return  {med_id:NaN,med_name:"",med_amount:NaN,med_box_no:NaN} as Medicine
  }


  private findMedicineById(med_id:number):number{
    for(let i=0;i<this.medicines.length;i++)
      if(this.medicines[i].med_id == med_id)
        return i
    return NaN
  }

  public getSortedMedicinesByName():Medicine[]{
    let meds:Medicine[] = this.medicines
    return meds.sort((n1,n2)=> n1.med_name > n2.med_name ? 1: -1)
  }


  public getSortedMedicinesByBox():Medicine[]{
    let meds:Medicine[] = this.medicines
    return meds.sort((n1,n2)=> n1.med_box_no - n2.med_box_no)
  }


  public checkForDisabled(a:number){
    for(var medicine of this.medicines)
      if(medicine.med_box_no == a)
        return true
    return false
  }

}
