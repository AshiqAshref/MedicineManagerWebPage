import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { modeB } from "src/environments/environments";


@Injectable({providedIn: 'root'})
export class SetupService{
    constructor(private http: HttpClient){}

    public getEspIP():Observable<{espIp:string}>{
        return this.http.get<{espIp:string}>(modeB.getESPAddress)
    }
    public setEspIP(ipAddress:string):Observable<{espIp:string}>{
        return this.http.post<{espIp:string}>(modeB.setESPAddress, ipAddress)
    }
    public esp_test(value:String):Observable<String>{
        return this.http.post<String>(modeB.ESP_test, value)
    }
    public esp_attempt_conn():Observable<{espIp:string}>{
        return this.http.get<{espIp:string}>(modeB.attempESPConn)
    }
}