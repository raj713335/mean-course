import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   { title: 'First post', content: 'This is the first post\'s content'},
  //   { title: 'Second post', content: 'This is the Second post\'s content'},
  //   { title: 'Third post', content: 'This is the third post\'s content'},
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {
    this.postsService = postsService;
   }

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });


  }ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }



}
