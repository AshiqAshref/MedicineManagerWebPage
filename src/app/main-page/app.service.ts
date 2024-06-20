import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class AppService{
    private message = new BehaviorSubject<{ 
        med_id:number,
         med_name:String,
          med_amount:number,
           med_box_no:number,
            emitEvent:boolean}
            >({med_id:0, med_name:'pory',med_amount:0, med_box_no:0, emitEvent:false});
    getMessage = this.message.asObservable();

    constructor(){}

    setMessage(message:{med_id:number, med_name:String, med_amount:number, med_box_no:number, emitEvent:boolean}){
        this.message.next(message)
    }
}