import { MedicineService } from './../../../service/medicine.service';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/Validators/CustomValidators.validator';
import { AppService } from 'src/app/main-page/app.service';
import { Medicine } from '../../../model/medicine';


@Component({
  selector: 'app-add-med',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})


export class MedicineAddComponent {
  addMed:string='true';
  boxNumbers:Number[]=[];
  addButtonDisabled:boolean=false;
  deleteButtonDisabled:boolean=false;
  addMedicineForm: FormGroup;
  medicines:Medicine[]=[]


  constructor(private http: HttpClient, private appService:AppService, private medicineService: MedicineService){
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
    for(let result of this.medicines)
      if(result.med_box_no == med_box_no){
        this.addMedicineForm.get("medNameForm")?.setValue(result.med_name)
        this.addMedicineForm.get("amountForm")?.setValue(result.med_amount)
        this.deleteButtonDisabled = false
        found = true
        break
      }
    if(!found){
      this.addMedicineForm.get("medNameForm")?.reset()
      this.addMedicineForm.get("amountForm")?.reset()
      this.deleteButtonDisabled = true
    }
  }


  onDelete():void{
    let med_id:number = NaN
    let med_box_no :number =  this.addMedicineForm.get("boxNumberForm")?.value
    for(var result of this.medicines)
      if(med_box_no == result.med_box_no)
        med_id = result.med_id

    this.medicineService.deleteMedicine(med_id).subscribe({
      complete: (response: void) => {
        this.addMedicineForm.reset()
        this.refreshValues();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    })
  }


  refreshValues(){
    this.deleteButtonDisabled = true
    this.medicineService.getMedicines().subscribe({
      next: (response: Medicine[])=>{
        console.log(response);
        this.medicines=response;
        this.boxNumbers=[];
        for(let i=1; i<=16;i++) this.boxNumbers.push(i);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
  })
  }


  checkForDisabled(a:any){
    for(var b of this.medicines)
      if(Number(b.med_box_no)==Number(a))
        return "disabled"
    return "notdisabled"
  }


  onSubmit(){
    let medicine:Medicine = {
      med_id     : NaN,
      med_name   : this.addMedicineForm.get("medNameForm")?.value, 
      med_amount : this.addMedicineForm.get("amountForm")?.value, 
      med_box_no : this.addMedicineForm.get("boxNumberForm")?.value
    }

    medicine.med_id = this.getMedIdByBoxNo(medicine.med_box_no)

    if(isNaN(medicine.med_id)){
      this.medicineService.addMedicine(medicine).subscribe({
        next: (newMedicine:Medicine)=>{
          console.log(newMedicine)
          this.medicines.push(newMedicine)
          this.updateValues(newMedicine)
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        }
      })
    }else{
      this.medicineService.updateMedicine(medicine).subscribe({
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


  findMedicineByBoxNo(med_box_no:number):number{
    for(let i=0;i<this.medicines.length;i++)
      if(this.medicines[i].med_box_no == med_box_no)
        return i
    return NaN
  }

  getMedIdByBoxNo(med_box_no:number):number{
    for(var result of this.medicines)
      if(result.med_box_no == med_box_no)
        return result.med_id
    return NaN
  }

  findMedicineById(med_id:number):number{
    for(let i=0;i<this.medicines.length;i++)
      if(this.medicines[i].med_id == med_id)
        return i
    return NaN
  }


  updateValues(medicine:Medicine){
    this.addMedicineForm.get("medNameForm")?.setValue(medicine.med_name)
    this.addMedicineForm.get("amountForm")?.setValue(medicine.med_amount)
    this.addMedicineForm.get("boxNumberForm")?.setValue(medicine.med_box_no)

    this.appService.setMessage(medicine)
  }
 
}
