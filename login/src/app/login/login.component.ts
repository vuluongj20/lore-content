import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('300ms ease')
      ]),
      transition(':leave', [
        animate('100ms ease', style({
          opacity: 0,
          transform: 'translate(-65%, -50%)'
        }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  // Message on top
  mes: string = 'Sign in to edit Lore content';
  // Input field errors, true makes the input field go red.
  emailErr: boolean = false;
  emailErr2: boolean = false;
  passErr: boolean = false;
  // Response from the server
  res: any;
  // Error code for error page
  resErr: number;
  // Views, true means that view is shown
  loginPage: boolean = true;
  // Loader icon, true means icon is shown
  loading: boolean = false;
  // Login form
  userGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required]
  });
  // Touch events to replace :hover events on touch devices
  onTouchStart($event) {
    $event.stopPropagation();
    $event.currentTarget.classList.add('touch');
  }
  onTouchEnd($event) {
    $event.stopPropagation();
    $event.currentTarget.classList.remove('touch');
  }
  login($event) {
    if (this.userGroup.valid) {
      var user = this.userGroup.value;
      var button = $event.currentTarget;
      button.classList.add('loading');
      this.loading = true;
      this.dataService.post('login', user).subscribe(
        data => {
          this.res = data;
          if (!this.res.authorized) {
            button.classList.remove('loading');
            this.loading = false;
            this.mes = 'Oops... wrong email/password.';
            this.emailErr = true;
            this.passErr = true;
          } else {
            document.location.assign('/content/');
          }
        },
        err => {
          this.loginPage = false;
          this.resErr = err.status;
        }
      );
    } else {
      if (this.userGroup.get('email').errors) {
        if (this.userGroup.get('email').errors.required) {
          this.mes = 'Forgetting something?';
          this.emailErr = true;
        }
        if (this.userGroup.get('email').errors.email) {
          this.mes = 'Make sure you typed in an email.';
          this.emailErr2 = true;
        }
      } else {
        this.emailErr = false;
      }
      if (this.userGroup.get('pass').errors) {
        this.mes = 'Forgetting something?';
        this.passErr = true;
      } else {
        this.passErr = false;
      }
    }
  }

  ngOnInit() {
  }

}
