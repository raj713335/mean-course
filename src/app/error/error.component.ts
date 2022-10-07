import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './error.component.html',
})

export class ErrorComponent {
  message = "An unknown error occured!";
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}
}
