import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancel = new EventEmitter();
  @Output() complete = new EventEmitter();

  registerForm: FormGroup;
  bsDatepickerConfig: Partial<BsDatepickerConfig>;
  datepickerOpen = false;
  user: User;

  public today = new Date();
  public eighteenYearsAgo: Date;

  constructor(
    public authService: AuthService,
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initEighteenYearsAgo();
    this.createForm();
    this.initDatepicker();
  }

  initEighteenYearsAgo() {
    this.eighteenYearsAgo = new Date();
    this.eighteenYearsAgo.setFullYear( this.today.getFullYear() - 18);
  }

  createForm() {
    this.registerForm = this.formBuilder.group(
      {
        gender: ['male'],
        username: ['', [Validators.required]],
        knownAs: ['', [Validators.required]],
        dateOfBirth: [this.eighteenYearsAgo, [Validators.required]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
      },
      {
        validator: [this.passwordMatchValidator]
      }
    );
  }

  initDatepicker() {
    this.bsDatepickerConfig ={
      containerClass: "theme-red"
    };
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {passwordMismatch: true};
  }

  showDatepicker(dp) {
    console.log('RegisterComponent.showDatepicker(), dp: ', dp);
    setTimeout(() => {
      if (!dp.isOpen) {
        dp.show();
      }
    }, 200);
  }

  register() {
    /*
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
    */
   console.log('RegisterComponent.register(), this.registerForm.value: ', this.registerForm.value);
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user)
        .subscribe(
          response => {
            this.alertifyService.success('Registration successful.');
          },
          error => {
            this.alertifyService.error(error);
          },
          () => {
            this.authService.login(this.user)
              .subscribe(
                response => {
                  this.router.navigate(['/members']);
                }
              )
            ;
          }
        )
      ;
    }
  }

  onClickCancel() {
    this.cancel.emit();
  }

}
