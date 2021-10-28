
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";


import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "user";


@Injectable({ providedIn: "root" })
export class Authservice{

    private token: string;
    private authServiceListern = new Subject<boolean>();
    private isAuthencated: boolean = false;
    private tokenTimer: any;
    private userId :string ;

    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthencated;
    }

    getAuthStatusListner(){
        return this.authServiceListern.asObservable();
    }

    getUserId(){
        return this.userId;
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expireIn = authInformation.expirationDate.getTime() - now.getTime();

        if (expireIn>0) {
            this.setAuthTimer(expireIn/1000);
            this.token = authInformation.token;
            this.isAuthencated = true;
            this.userId = authInformation.userId;
            this.authServiceListern.next(true);
        }

    }

    createUser(email: string, password: string){
        const authdata: AuthData = {email: email, password: password};

        this.http.post(BACKEND_URL + "/signup", authdata)
        .subscribe((response)=>{
            this.router.navigate(['/']);
            
        },error => {
           this.authServiceListern.next(false);
        }) 
    }

    login(email: string, password: string){
        const authdata: AuthData = {email: email, password: password};

        this.http.post<{token:string, expireIn: number, userId: string}>(BACKEND_URL + "/login", authdata)
        .subscribe((response)=>{
          
            const token = response.token;
            this.token = token;
            if(token){

                const expiresInDuration = response.expireIn
                this.setAuthTimer(expiresInDuration);
                this.authServiceListern.next(true);
                this.userId = response.userId;
                this.isAuthencated = true;
                const now = new Date();
                const expire = new Date(now.getTime() + (expiresInDuration * 1000))
                this.saveAuthData(token, expire,this.userId);
                this.router.navigate(["/"]);
            }
        },error => {
            this.authServiceListern.next(false);
        })
    }

    logout() {
        this.token = null;
        this.isAuthencated = false;
        clearTimeout(this.tokenTimer);
        this.userId = null;
        this.authServiceListern.next(false);
        this.router.navigate(["/"]);
        this.deleteAuthData();
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string ){
        localStorage.setItem('token', token)
        localStorage.setItem('expiration', expirationDate.toISOString())
        localStorage.setItem('userId', userId)
    }

    private deleteAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }

    }

    private setAuthTimer(duration: number){

        this.tokenTimer =  setTimeout(()=>{
            this.logout();
         }, duration * 1000)

    }

}