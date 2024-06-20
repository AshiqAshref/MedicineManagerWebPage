import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { modeB } from 'src/environments/environments';


@Component({
  selector: 'app-del-med',
  templateUrl: './medicine-delete.component.html',
  styleUrls: ['./medicine-delete.component.css']
})
export class MedicineDeleteComponent {
  results:any;
  boxNumbersFull:{"medb_id":number,"medb_box_no":number}[]=[];
  isSubmitDisabled:boolean=true;
  deleteMedicineForm:FormGroup;

  constructor(private http: HttpClient){
    this.deleteMedicineForm = new FormGroup({
      boxSelectForm: new FormControl(0),
      nameSelectForm:new FormControl(0)
    });

    this.deleteMedicineForm.get('boxSelectForm')?.valueChanges.subscribe(
      (value)=> this.updateOnChangeBox(value));
    this.deleteMedicineForm.get('nameSelectForm')?.valueChanges.subscribe(
      (value)=> this.updateOnChangeMed(value));
    
    this.refreshValues();
  }


  deleteMedicine(){
    this.isSubmitDisabled=true
    let medb_id = this.deleteMedicineForm.get("boxSelectForm")?.value;
    this.http.post(modeB.deleteMedAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
      medb_id:medb_id
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        console.log(res)
        this.refreshValues()
      } catch (error) {
        console.log(error);
      }   
    })
  }


  updateOnChangeMed(medb_id:number){
    this.deleteMedicineForm.get("boxSelectForm")?.setValue(medb_id,{emitEvent:false})
    this.isSubmitDisabled=false;
  }
  updateOnChangeBox(medb_id:number){
    this.deleteMedicineForm.get("nameSelectForm")?.setValue(medb_id,{emitEvent:false})
    this.isSubmitDisabled=false;
  }
  

  refreshValues(){
    this.http.post(modeB.getAllMedsAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        this.results=res.Medicines;
        console.log(this.results);

        this.deleteMedicineForm.reset();
        this.updateOnChangeBox(0);
        this.updateOnChangeMed(0);
        this.isSubmitDisabled = true;

        this.boxNumbersFull=[];
        for(var a of this.results)
          this.boxNumbersFull.push({"medb_id": Number(a.medb_id),"medb_box_no":Number(a.medb_box_no)})
        this.boxNumbersFull.sort((n1,n2)=> Number(n1.medb_box_no) - Number(n2.medb_box_no))
      } catch (error) {
        console.log(error);
      } 
    })
  }


}
