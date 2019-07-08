import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  user: User = JSON.parse(localStorage.getItem("user"));
  genderList: any = [
    {
      value: 'male',
      display: 'Males'
    },
    {
      value: 'female',
      display: 'Females'
    },
    {
      value: 'both',
      display: 'Both'
    },
  ];

  sortByOptions: any = [
    {
      value: 'created',
      display: 'Created'
    },
    {
      value: null,
      display: 'Last Active'
    }
  ];

  defaultUserParams: any = {};
  userParams: any = {};

  pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe( (data: { users: PaginatedResult<User[]> }) => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });

    this.defaultUserParams.gender = this.user.gender === 'female'
      ? 'male'
      : 'female'
    ;
    this.defaultUserParams.minAge = this.userService.defaults.filters.minAge;
    this.defaultUserParams.maxAge = this.userService.defaults.filters.maxAge;
    this.defaultUserParams.orderBy = this.userService.defaults.sort.orderBy;

    this.resetUserParams();
  }

  onPageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.userParams
    )
      .subscribe(
        (response: PaginatedResult<User[]>) => {
          this.users = response.result;
          this.pagination = response.pagination;
        },
        error => {
          this.alertifyService.error(error);
        }
      )
    ;
  }

  resetUserParams() {
    this.userParams = {
      ...this.defaultUserParams
    };
  }

  onClickApplyFilters() {
    this.pagination.currentPage = 1;
    this.loadUsers();
  }

  onClickResetFilters() {
    this.pagination.currentPage = 1;
    this.resetUserParams();
    this.loadUsers();
  }

}
