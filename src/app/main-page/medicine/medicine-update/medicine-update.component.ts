import { Observable } from 'rxjs/internal/Observable';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { modeB } from 'src/environments/environments';

@Component({
  selector: 'app-update-med',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.css']
})
export class MedicineUpdateComponent {
  result:any;
  medNames:string[]=[];
  boxNumbers:Number[]=[];
  boxNumbersFull:Number[]=[];

  disableBox:boolean=false;
  disableName:boolean=true;
  isDisabled:boolean=true;
  medNameNgModel:string='';
  boxNumberNgModel:Number=0;
  medNameInputBox:string='';
  amountInputBox:string='';
  boxNoOptModel:number=0
  

  constructor(private http: HttpClient){
    this.refreshValues().subscribe();
  }


  checkToDisableBoxOptional(a:Number):boolean{
    for (var b of this.boxNumbersFull)
      if(a==b)
        return true
    return false
  }


  updateOnChangeBox(box_no:any){
    for(var b of this.result){
      if(Number(b.medb_box_no)==box_no){
        this.medNameNgModel=b.medb_name;
        this.medNameInputBox=b.medb_name;
        this.amountInputBox=b.medb_amount;
      }
    }
    this.isDisabled=false;
  }


  updateOnChangeMed(a:any){
    for(var b of this.result){
      if(b.medb_name===a ){
        this.boxNumberNgModel=Number(b.medb_box_no);
        this.medNameInputBox=b.medb_name;
        this.amountInputBox=b.medb_amount;
      }
    }
    this.isDisabled=false;
  }


  updateOption(a:string){
    if(a=='med'){
      this.disableName=false;
      this.disableBox=true;
    }
    else if(a=='box'){
      this.disableBox=false;
      this.disableName=true;
    }
  }


  updateMedicine(event:NgForm){
    this.isDisabled=true;
    let new_amount=event.value.newAmount; 
    let new_med_name=event.value.newName;
    let new_box_no=event.value.changeBoxTo;
    let orginal_id:Number=0;
    let orginal_box_no = Number(this.boxNumberNgModel);
    let orginal_med_name;
    let orginal_amount;

    for(var a of this.result)
      if(Number(a.medb_box_no)== orginal_box_no){
        orginal_id = Number(a.medb_id);
        orginal_med_name = a.medb_name;
        orginal_amount = a.medb_amount;
        break;
      }
    
    if(new_box_no==0)
      new_box_no=orginal_box_no;
    if(new_med_name.length==0)
      new_med_name=orginal_med_name;
    if(new_amount.length==0)
      new_amount=orginal_amount
    

    this.http.post(modeB.updateMedAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
      medb_id:orginal_id,
      name:new_med_name,
      changeBoxTo:new_box_no,
      amount:new_amount
    })
    .pipe(map((response: any) => response))
    .subscribe(res=>{
      try {
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      this.refreshValues().subscribe(res=>{
        for(var a of res.Medicines){
          if(Number(a.medb_id)==orginal_id){
            this.medNameNgModel=a.medb_name;
            this.medNameInputBox=a.medb_name;
            this.boxNumberNgModel=Number(a.medb_box_no);
            this.amountInputBox=a.medb_amount;
          }
        }
      }) 
    })
  }


  updateOnChange(a:any){
    console.log(a);
    for(let i=0;i<this.result.length;i++){
      if(Number(this.result[i].boxNo)==a){
      }
    }
  }


  refreshValues(): Observable<any>{
    this.boxNumbersFull=[];
    this.boxNumbers=[];
    this.medNames=[]; 

    let requestObservable = this.http.post(modeB.getAllMedsAddress,{
      "headers":{
        "Content-Type": "application/json"
      },
    }).pipe(map((response: any) => response))
    requestObservable.subscribe(res=>{
      try {
        console.log(res);
        this.result=res.Medicines;
        for(let i=1; i<=16;i++)
          this.boxNumbers.push(i);
        for(var a of this.result){
          this.boxNumbersFull.push(Number(a.medb_box_no))
          this.medNames.push(a.medb_name)
        }
        this.boxNumbersFull.sort((n1,n2)=> Number(n1) - Number(n2))

      } catch (error) {
        console.log(error);
      } 
    })
    return requestObservable
  }




}
