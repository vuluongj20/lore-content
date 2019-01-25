import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { DesWrapComponent } from './des-wrap/des-wrap.component';
import { CourseWrapComponent } from './course-wrap/course-wrap.component';
import { TeamWrapComponent } from './team-wrap/team-wrap.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PreviewPageComponent } from './preview-page/preview-page.component';

const routes: Routes = [
  { path: '', component: PreviewPageComponent }
];

@NgModule({
  declarations: [
    DesWrapComponent,
    CourseWrapComponent,
    TeamWrapComponent,
    HeaderComponent,
    FooterComponent,
    PreviewPageComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PreviewModule { }
