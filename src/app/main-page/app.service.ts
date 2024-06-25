import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Medicine } from "./modeB/model/medicine";

@Injectable({
    providedIn:'root'
})
export class AppService{
    private message = new BehaviorSubject<Medicine>({
        med_id:0, 
        med_name:"",
        med_amount:0, 
        med_box_no:0,
    });

    getMessage = this.message.asObservable();
    constructor(){}

    setMessage(message:Medicine){
        this.message.next(message)
    }

}