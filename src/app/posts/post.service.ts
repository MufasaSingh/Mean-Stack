import { Injectable } from "@angular/core";
import { Post } from "./post.modal";
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "post";

@Injectable({
    providedIn: 'root'
})

export class PostService{

    constructor(private http: HttpClient, private router: Router){}

    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();



    getPost(postPerPage: number, currentPage: number){

        const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;

        this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
        .pipe(map((postData)=>{
            console.log(postData);
            return { posts : postData.posts.map(post =>{
                return  {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imgPath: post.imgPath,
                    creator: post.creator
                }
            }), maxPosts: postData.maxPosts}
        }))
        .subscribe((updatedpostData) =>{
            this.posts = updatedpostData.posts;
            this.postsUpdated.next({posts: [...this.posts], postCount: updatedpostData.maxPosts})
        })
    }

    getPostUpdateListner(){
        return this.postsUpdated.asObservable();
    }

    getPostbyId(id: string){
        // return {...this.posts.find(p => p.id === id)} 
        return this.http.get<{_id: string, title: string, content: string, imgPath: string, creator: string}>(`${BACKEND_URL}/${id}`);
    }

    updatePost(id: string, title: string, content: string, image: File | string){
        let postData : Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append("id", id)
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);

        }else{
            postData = {
                id: id,
                title: title,
                content: content,
                imgPath: image,
                creator: null
            }
        }

        this.http.put(`${BACKEND_URL}/${id}`, postData)
            .subscribe((data)=>{
                // const updatedpost = [...this.posts];
                // const oldPostIndex = updatedpost.findIndex(p => p.id === id);
                // const post :Post = {
                //     id: id,
                //     title: title,
                //     content: content,
                //     imgPath: ""
                // }
                // updatedpost[oldPostIndex] = post;
                // this.posts = updatedpost;
                // this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);

            })
    }
 
    addPost(_title: string, _content: string, _image: File){

        const postData = new FormData();
        postData.append("title", _title)
        postData.append("content", _content)
        postData.append("image", _image, _title)

        // const post:Post = { id: null, title: _title, content: _content };
        this.http.post<{message: string, post: Post}>(BACKEND_URL,postData)
        .subscribe(resposeData =>{

            // const post :Post = {id: resposeData.post.id, 
            //                     title: _title, 
            //                     content: _content, 
            //                     imgPath: resposeData.post.imgPath
            //                 }

            // this.posts.push(post);
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
       
    }

    deletePost(Postid: string){
        return this.http.delete(`${BACKEND_URL}/${Postid}`);
        // .subscribe(()=>{
        //     const updatedPosts = this.posts.filter(post => post.id !== Postid);
        //     this.posts = updatedPosts;
        //     this.postsUpdated.next([...this.posts]);
        // })
    }

}