import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService {
    constructor(private http: HttpClient){}

    getAPI(url: string){
        return this.http.get(url);
    }

}