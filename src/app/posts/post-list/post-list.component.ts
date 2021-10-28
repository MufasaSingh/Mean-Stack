import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.modal'
import { PostService } from "../post.service";
import { Subscription } from 'rxjs'
import { PageEvent } from "@angular/material/paginator";
import { Authservice } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostlistComponent implements OnInit, OnDestroy {

    // postList = [
    //     {title: "First Post", content: "This is the first post content"},
    //     {title: "Second Post", content: "This is the second post content"},
    //     {title: "third Post", content: "This is the third post content"},
    // ]
    // @Input() postList:Post[] = [];
    postList:Post[] = [];
    private postSub: Subscription;
    isLoading = false;
    totalPost = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,9];
    userId: string;

    private authListernSub: Subscription;
    public UserIsAuthenticated = false;
    

    constructor( private postservice: PostService, private authService: Authservice ){

    }
    ngOnDestroy(): void {
        this.postSub.unsubscribe();  
        this.authListernSub.unsubscribe();
    }

    ngOnInit(): void {
        this.postservice.getPost(this.postPerPage, this.currentPage)
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.postSub = this.postservice.getPostUpdateListner()
        .subscribe((postData: {posts: Post[], postCount: number })=>{
            this.isLoading = false;
            this.totalPost = postData.postCount;
            this.postList = postData.posts;
        });
        this.UserIsAuthenticated = this.authService.getIsAuth();
        
        this.authListernSub = this.authService.getAuthStatusListner()
        .subscribe((isAuthenticated)=>{
         this.UserIsAuthenticated = isAuthenticated;
         this.userId = this.authService.getUserId();
        })
    }

    DeletePost(Postid: string){
        this.isLoading = true;
        this.postservice.deletePost(Postid).subscribe(()=>{
            this.postservice.getPost(this.postPerPage, this.currentPage)
        }, ()=>{
            this.isLoading = false;
        });
    }

    pageChange(event: PageEvent){
        this.isLoading = true;
        this.currentPage = event.pageIndex + 1;
        this.postPerPage = event.pageSize;
        this.postservice.getPost(this.postPerPage, this.currentPage);
        // console.log(event);
        
    }

}