import { Component, OnInit } from '@angular/core';
import { Authservice } from './auth/auth.service';
import { Post } from './posts/post.modal'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'mean-course';


  constructor(private authService: Authservice){}

  ngOnInit(): void {
    
    this.authService.autoAuthUser();
  }

  posts: Post[] = [];

  onPostAdded(post){
    this.posts.push(post);
  }

}
