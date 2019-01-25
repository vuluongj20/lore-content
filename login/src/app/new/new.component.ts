import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
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
export class NewComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) { }

  // Text at the top
  adMes: string = 'Only an admin can add a new account. Tell them to sign in here first.';
  newMes: string = 'Now put in the new account details.';
  comMes: string = '';
  // Error code for error page
  resErr: number;
  // Message on success pages
  doneMes: any;
  // Input field errors, true makes the input field go red.
  ademailErr: boolean = false;
  adPassErr: boolean = false;
  newemailErr: boolean = false;
  newPassErr: boolean = false;
  newPass2Err: boolean = false;
  // Server responses
  adRes: any;
  newRes: any;
  // Views, true means that view is shown
  adminPage: boolean = true;
  newPage: boolean = false;
  // Loader icon, true means icon is shown
  loading: boolean = false;
  // Forms
  adminGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required]
  });
  newGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', Validators.required],
    pass2: ['', Validators.required]
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
              this.newPage = true;
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
  new($event) {
    if (this.newGroup.valid) {
      if (this.newGroup.get('pass').value === this.newGroup.get('pass2').value) {
        var button = $event.currentTarget;
        button.classList.add('loading');
        this.loading = true;
        this.newPassErr = false;
        this.newPass2Err = false;
        var newMem = this.newGroup.value;
        this.dataService.post('new', newMem).subscribe(
          data => {
            this.newRes = data;
            button.classList.remove('loading');
            this.loading = false;
            if (this.newRes.userExists) {
              this.newMes = 'Account already exists.';
            } else {
              this.newPage = false;
              this.doneMes = ["You're all set. Welcome to the Team!", 'Sign in now'];
            }
          },
          err => {
            this.newPage = false;
            this.resErr = err.status;
          }
        );
      } else {
        this.newPassErr = true;
        this.newPass2Err = true;
        this.newMes = "The two passwords don't match.";
      }
    } else {
      if (this.newGroup.get('email').errors) {
        if (this.newGroup.get('email').errors.required) {
          this.newMes = 'Forgetting something?';
          this.newemailErr = true;
        }
        if (this.newGroup.get('email').errors.email) {
          this.newMes = 'Make sure you typed in an email.';
          this.newemailErr = true;
        }
      } else {
        this.newemailErr = false;
      }
      if (this.newGroup.get('pass').errors) {
        this.newMes = 'Forgetting something?';
        this.newPassErr = true;
      } else {
        this.newPassErr = false;
      }
      if (this.newGroup.get('pass2').errors) {
        this.newMes = 'Forgetting something?';
        this.newPass2Err = true;
      } else {
        this.newPass2Err = false;
      }
    }
  }

  ngOnInit() {
  }

}
