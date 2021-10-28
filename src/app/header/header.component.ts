import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Authservice } from "../auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

    private authListernSub: Subscription;
    public UserIsAuthenticated = false;

    constructor(private authService: Authservice){}

    ngOnDestroy(): void {
        this.authListernSub.unsubscribe();
    }


    ngOnInit(): void {
        this.UserIsAuthenticated = this.authService.getIsAuth();
       this.authListernSub = this.authService.getAuthStatusListner()
       .subscribe((isAuthenticated)=>{
        this.UserIsAuthenticated = isAuthenticated;
       })
    }

    onLogout() {
        this.authService.logout();
    }

}