import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate(-35%, -50%)'
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
export class ResetComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  // Text on top
  adMes: string = 'Only an admin can reset passwords. Tell them to sign in here first.';
  inputMes: string = "Type in your email address.";
  resetMes: string = "Enter the new password here.";
  // Error code for error page
  resErr: number;
  // Message on success pages
  doneMes: any;
  // Input field errors, true makes the input field go red.
  ademailErr: boolean = false;
  adPassErr: boolean = false;
  inputErr: boolean = false;
  newPassErr: boolean = false;
  newPass2Err: boolean = false;
  // Response from server
  adRes: any;
  inputRes: any;
  resetRes: any;
  // Views, true means that view is shown
  adminPage: boolean = true;
  inputPage: boolean = false;
  resetPage: boolean = false;
  // Loader icon, true means icon is shown
  loading: boolean = false;
  // New password form
  adminGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required]
  });
  inputGroup = this.fb.control('', [Validators.required, Validators.email]);
  resetGroup = this.fb.group({
    newPass: ['', Validators.required],
    newPass2: ['', Validators.required]
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
  // Functions
  adminLog($event) {
    if (this.adminGroup.valid) {
      var admin = this.adminGroup.value;
      var button = $event.currentTarget;
      button.classList.add('loading');
      this.loading = true;
      this.dataService.post('login', admin).subscribe(
        data => {
          this.adRes = data;
          button.classList.remove('loading');
          this.loading = false;
          if (!this.adRes.authorized) {
            this.adMes = 'Oops... wrong email/password.';
            this.ademailErr = true;
            this.adPassErr = true;
          } else {
            if (this.adRes.type === 'admin') {
              this.adminPage = false;
              this.inputPage = true;
            } else {
              this.adMes = 'This user is not an admin.';
              this.ademailErr = true;
              this.adPassErr = true;
            }
          }
        },
        err => {
          this.adminPage = false;
          this.resErr = err.status;
        }
      );
    } else {
      if (this.adminGroup.get('email').errors) {
        if (this.adminGroup.get('email').errors.required) {
          this.adMes = 'Forgetting something?';
          this.ademailErr = true;
        }
        if (this.adminGroup.get('email').errors.email) {
          this.adMes = 'Make sure you typed in an email.';
          this.ademailErr = true;
        }
      } else {
        this.ademailErr = false;
      }
      if (this.adminGroup.get('pass').errors) {
        this.adMes = 'Forgetting something?';
        this.adPassErr = true;
      } else {
        this.adPassErr = false;
      }
    }
  }
  input($event) {
    if (this.inputGroup.valid) {
      var email = this.inputGroup.value;
      this.dataService.post('exists', {email: email}).subscribe(
        data => {
          this.inputRes = data;
          if (this.inputRes.userExists) {
            this.inputPage = false;
            this.resetPage = true;
          } else {
            this.inputMes = "This account doesn't exist";
            this.inputErr = true;
          }
        }
      )
    } else {
      if (this.inputGroup.errors.required) {
        this.inputMes = 'Forgetting something?';
        this.inputErr = true;
      } else {
        this.inputMes = 'Make sure you typed in an email.';
        this.inputErr = true;
      }
    }
  }
  reset($event) {
    if (this.resetGroup.valid) {
      if (this.resetGroup.get('newPass').value === this.resetGroup.get('newPass2').value) {
        var email = this.inputGroup.value;
        var newPass = this.resetGroup.get('newPass').value;
        var button = $event.currentTarget;
        button.classList.add('loading');
        this.loading = true;
        this.dataService.post('reset', {email: email, newPass: newPass}).subscribe(
          () => {
            this.resetPage = false;
            this.doneMes = ['Congrats! Your password is now reset.', 'Sign in now.']
          },
          err => {
            this.resetPage = false;
            this.resErr = err.status;
          }
        );
      } else {
        this.resetMes = "The passwords don't match."
        this.newPassErr = true;
        this.newPass2Err = true;
      }
    } else {
      if (this.resetGroup.get('newPass').errors) {
        this.resetMes = "Forgetting something?";
        this.newPassErr = true;
      } else {
        this.newPassErr = false;
      }
      if (this.resetGroup.get('newPass2').errors) {
        this.resetMes = "Forgetting something?";
        this.newPass2Err = true;
      } else {
        this.newPass2Err = false;
      }
    }
  }

  ngOnInit() {
  }

}
