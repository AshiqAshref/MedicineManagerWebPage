import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs/internal/Observable"
import { modeB } from "src/environments/environments"
import { Reminder } from "../model/reminder"

@Injectable({providedIn: 'root'})
export class ReminderService{
    constructor(private http: HttpClient){}

    public getReminders():Observable<Reminder[]>{
        return this.http.get<Reminder[]>(modeB.getAllRemindersAddress)
    }

    public addReminder(medicine:Reminder):Observable<Reminder>{
        return this.http.post<Reminder>(modeB.addReminderAddress , medicine)
    }

    public updateReminder(medicine:Reminder):Observable<Reminder>{
        return this.http.put<Reminder>(modeB.updateMedAddress, medicine)
    }
    
    public deleteReminder(med_id:number):Observable<void>{
        return this.http.delete<void>(modeB.deleteMedAddress+med_id)
    }

    
    
}