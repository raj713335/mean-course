import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';

  constructor(public postsService: PostsService) { }

  onAddPost(form: NgForm) {
    if (form.invalid){
      return;
    }

    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();

  }



  ngOnInit(): void {
  }

}
