import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registering = false;
  queryParams: any;

  constructor(
    public http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(queryParams => {
        this.queryParams = queryParams;
        this.registering = this.queryParams['registering'] === 'true'
          ? true
          : false
        ;
      })
    ;
  }

  register() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {registering: true},
      }
    );
  }

  onCancel() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {},
      }
    );
  }
  onComplete() {
    this.registering = false;
  }

}
