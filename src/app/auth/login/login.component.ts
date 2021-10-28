import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms'
import { Subscription } from "rxjs";
import { Authservice } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent  implements OnInit, OnDestroy {

    private authStatusSub: Subscription;

    constructor(public authService: Authservice){}
    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe()

    }


    ngOnInit(): void {
        this.authStatusSub =  this.authService.getAuthStatusListner()
        .subscribe( authStatus => {
            this.isLoading = false;
        })
    }

    isLoading = false;

    onlogin(form: NgForm){
        
        if(form.invalid){
            return;
        }
        this.isLoading = true;

        this.authService.login(form.value.email, form.value.Passwd);
    }

}