import { modeB } from './../../../../environments/environments';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicine } from '../model/medicine';

@Injectable({providedIn: 'root'})
export class MedicineService{
    constructor(private http: HttpClient){}

    public getMedicines():Observable<Medicine[]>{
        return this.http.get<Medicine[]>(modeB.getAllMedsAddress)
    }

    public addMedicine(medicine:Medicine):Observable<Medicine>{
        return this.http.post<Medicine>(modeB.addMedAddress, medicine)
    }

    public updateMedicine(medicine:Medicine):Observable<Medicine>{
        return this.http.put<Medicine>(modeB.updateMedAddress, medicine)
    }
    
    public deleteMedicine(med_id:number):Observable<void>{
        return this.http.delete<void>(modeB.deleteMedAddress+med_id)
    }

    
    
}