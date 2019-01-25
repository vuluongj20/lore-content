import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewComponent } from './new/new.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  { path: 'new', component: NewComponent },
  { path: 'reset', component: ResetComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
