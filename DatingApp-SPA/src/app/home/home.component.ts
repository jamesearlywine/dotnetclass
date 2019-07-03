import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registering = false;

  constructor(
    public http: HttpClient
  ) { }

  ngOnInit() {
  }

  register() {
    this.registering = true;
  }

  onCancel() {
    console.log('HomeComponent.onCancel()');
    this.registering = false;
  }
  onComplete() {
    console.log('HomeComponent.onComplete()');
    this.registering = false;
  }

}
