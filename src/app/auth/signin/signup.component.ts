import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms'
import { Subscription } from "rxjs";
import { Authservice } from "../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {

    private authStatusSub: Subscription;
    isLoading = false;

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

   

    onSignup(form: NgForm){
        
        if (form.invalid) {
            return
        }
        this.isLoading = true;

        this.authService.createUser(form.value.email, form.value.Passwd);
    }

}