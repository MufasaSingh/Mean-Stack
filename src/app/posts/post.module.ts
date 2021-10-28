import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular.material.module";


import { PostCreateComponent } from './post-create/post-create.component';
import { PostlistComponent } from './post-list/post-list.component';


@NgModule({
    declarations:[
        PostCreateComponent,
        PostlistComponent
    ],
    imports:[
        ReactiveFormsModule ,
        AngularMaterialModule,
        CommonModule,
        RouterModule
    ]
})


export class PostsModule{}