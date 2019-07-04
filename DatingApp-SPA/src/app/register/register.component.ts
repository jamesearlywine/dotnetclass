import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ErrorInterceptor } from '../services/error.interceptor';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancel = new EventEmitter();
  @Output() complete = new EventEmitter();

  model = {
    username: null,
    password: null
  };

  constructor(
    public authService: AuthService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model)
      .subscribe(
        response => {
          this.alertifyService.success('Registration complete.')
        },
        error => {
          this.alertifyService.error(error);
        },
        () => {
          this.complete.emit();
        }
      )
    ;


  }

  onClickCancel() {
    this.cancel.emit();
  }

}
