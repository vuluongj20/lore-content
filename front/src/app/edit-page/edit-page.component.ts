import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { EditDesComponent } from '../edit-des/edit-des.component';
import { EditCoursesComponent } from '../edit-courses/edit-courses.component';
import { EditTeamComponent } from '../edit-team/edit-team.component';

import { DataService } from '../data.service';
import { PreviewDataService } from '../preview/data.service';
import { FormService } from '../form.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: [
    './edit-page.component.css',
    '../global.css'
  ],
  animations: [
    trigger('fadeSlow', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(10%)'
        }),
        animate('600ms ease')
      ]),
      transition('false => true', [
        style({
          opacity: 0.3
        }),
        animate('200ms ease')
      ])
    ]),
    trigger('slide-1', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(50%)'
        }),
        animate('600ms ease')
      ])
    ]),
    trigger('slide-2', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(70%)'
        }),
        animate('400ms 200ms ease')
      ])
    ])
  ]
})
export class EditPageComponent implements OnInit {
  @ViewChild(EditDesComponent) des: EditDesComponent;
  @ViewChild(EditCoursesComponent) courses: EditCoursesComponent;
  @ViewChild(EditTeamComponent) team: EditTeamComponent;

  constructor(
    private dataService: DataService,
    private previewDataService: PreviewDataService,
    private formService: FormService
  ) { }
  // Demo user
  demo: boolean = false;
  // Responses from server
  mainRes: any;
  filesRes: any;
  // Page toggles
  editPage: boolean = true;
  previewPage: boolean = false;
  loading: boolean = false;
  done: boolean = false;
  resErr: number;
  // Form counter
  formCounter: number = 1;

  ngOnInit() {
    this.formService.currentCounter.subscribe(counter => this.formCounter = counter);
    function getCookie(name: string) {
      var cookie = '; ' + document.cookie;
      var array = cookie.split('; ' + name + '=');
      if (array.length === 2) {
        return array[1].split(';')[0];
      } else {
        return null;
      }
    }
    var userType = getCookie('userType');
    if (userType === 'demo') {
      this.demo = true;
    }
  }
  onTouchStart($event) {
    $event.stopPropagation();
    $event.currentTarget.classList.add('touch');
  }
  onTouchEnd($event) {
    $event.stopPropagation();
    $event.currentTarget.classList.remove('touch');
  }
  preview() {
    this.previewDataService.setData('des', this.des.des);
    this.previewDataService.setData('courses', this.courses.courses);
    this.previewDataService.setData('mems', this.team.mems);
    window.scrollTo(0,0);
    this.editPage = false;
    this.previewPage = true;
  }
  back() {
    document.querySelectorAll('.load-background').forEach(div => {
      (<HTMLElement>div).classList.remove('load-background');
    });
    window.scrollTo(0, 0);
    this.editPage = true;
    this.previewPage = false;
  }
  save($event) {
    var des = this.des.des;
    var courses = JSON.parse(JSON.stringify(this.courses.courses));
    var courseFiles = this.courses.files;
    var team = JSON.parse(JSON.stringify(this.team.mems));
    var teamFiles = this.team.files;
    var files = [];
    var filesToUpload = new FormData();
    for (var i = 0; i < Object.keys(courseFiles).length; i++) {
      for (let course of courseFiles[Object.keys(courseFiles)[i]]) {
        if (course != '') {
          files.push(course[0].file);
        }
      }
    }
    for (let mem of teamFiles) {
      if (mem != '') {
        files.push(mem[0].file);
      }
    }
    for (let type of Object.keys(courses)) {
      for (let course of courses[type]) {
        delete course.cleanUrl;
        for (let file of files) {
          if (course.link === file.name) {
            var oriArr = file.name.split('.');
            var newName = Date.now() + Math.random().toString(36).substr(2, 15) + '.' + oriArr[oriArr.length - 1];
            course.link = newName;
            filesToUpload.append('files[]', file, newName);
          }
        }
      }
    }
    for (let mem of team) {
      delete mem.cleanUrl;
      for (let file of files) {
        if (mem.link === file.name) {
          var oriArr = file.name.split('.');
          var newName = Date.now() + Math.random().toString(36).substr(2, 15) + '.' + oriArr[oriArr.length - 1];
          mem.link = newName;
          filesToUpload.append('files[]', file, newName);
        }
      }
    }
    $event.currentTarget.parentNode.parentNode.classList.add('load-background');
    this.loading = true;
    document.body.style.overflow = 'hidden';
    this.dataService.postData('main', {
      des: des,
      courses: courses,
      team: team
    }).subscribe(
      () => {
        this.dataService.postData('files', filesToUpload).subscribe(
          () => {
            this.loading = false;
            document.body.style.overflow = 'initial';
            this.previewPage = false;
            this.done = true;
          },
          err => {
            this.previewPage = false;
            this.loading = false;
            this.resErr = err.status;
          }
        );
      },
      err => {
        this.previewPage = false;
        this.loading = false;
        this.resErr = err.status;
      }
    );
  }
}
