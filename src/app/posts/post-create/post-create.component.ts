import { rendererTypeName } from "@angular/compiler";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";

import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Post } from '../post.modal'
import { PostService } from "../post.service";
import { miniType } from './mini-type.validator';
import { Authservice } from "../../auth/auth.service"

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})


export class PostCreateComponent implements OnInit, OnDestroy {

    private mode = "create";
    private postId: string;
    post: Post;
    public isLoading = false;
    form: FormGroup;
    imagePreview : string;
    private authStatusSub: Subscription;

    constructor( private postservice: PostService, public router: ActivatedRoute , private authService: Authservice ){

    }
    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
    ngOnInit(): void {

        this.authStatusSub = this.authService.getAuthStatusListner()
        .subscribe(authStatus =>{
            this.isLoading = false;
        })

        this.form = new FormGroup({
            'title': new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)]
            }),
            'content': new FormControl(null, {validators: [Validators.required]}),
            'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [miniType]},)
        })
        
        this.router.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = "edit";
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postservice.getPostbyId(this.postId)
                .subscribe(postData => {
                    this.isLoading = false;
                    this.post = {id: postData._id, title: postData.title, content: postData.content, imgPath: postData.imgPath,creator: postData.creator}
                    this.form.setValue({
                        'title': this.post.title,
                        'content': this.post.content,
                        'image': this.post.imgPath
                    })
                });
                
            }else{
                this.mode = "create";
                this.postId = null;
            }
        })

    }

    enterTitle = "";
    enterContent = "";

    // @Output() postCreated = new EventEmitter<Post>();


    onSavePost(){

        if(this.form.invalid) return
        this.isLoading = true;

        if(this.mode == 'create'){
            this.postservice.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
        }else{
            this.postservice.updatePost(this.postId,this.form.value.title, this.form.value.content, this.form.value.image)
        }
        
        // const post: Post = { title: form.value.title, content: form.value.content }
        // this.postCreated.emit(post);

        this.form.reset();
    }

    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string
        };
        reader.readAsDataURL(file);

    }

    

   
}