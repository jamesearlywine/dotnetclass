import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';


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
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model)
      .subscribe(
        response => {
          console.log('RegisterComponent.register, response: ', response);
        },
        error => {
          console.log('RegisterComponent.register, error: ', error);
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
