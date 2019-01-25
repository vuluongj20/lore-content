import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';

import { DataService } from '../data.service';
import { FormService } from '../form.service';

@Component({
  selector: 'app-edit-courses',
  templateUrl: './edit-courses.component.html',
  styleUrls: [
    './edit-courses.component.css',
    '../global.css'
  ]
})
export class EditCoursesComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder,
  private domSanitizer: DomSanitizer) { }

  courses: any = {};
  newCourse: any = {};
  dummyText: string = '';
  courseTypes: any = [];
  courseImages: any = {};
  coursesGroup: any = {};
  newCoursesGroup: any = {};
  files: any = {};
  newFile: any = {};
  sectionOnEdit: boolean = false;
  @HostListener('window: resize', []) onResize() {
    document.querySelectorAll('first').forEach(text => {
      (<HTMLElement>text).innerHTML = (<HTMLElement>text).innerHTML;
    });
  }
  first(text: string) {
    if (window.innerWidth < 768) {
      if (/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/.test(text)) {
        return text.match(/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/);
      } else {
        return text;
      }
    } else {
      if (/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\)).*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/.test(text)) {
        return text.match(/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\)).*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/);
      } else if (/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/.test(text)) {
        return text.match(/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/);
      } else {
        return text;
      }
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
  editSection($event) {
    this.formService.editSection($event);
    this.sectionOnEdit = true;
  }
  doneEditSection($event) {
    for (let type of this.courseTypes) {
      this.coursesGroup[type] = this.fb.group({
        array: this.fb.array([])
      });
      for (let course of this.courses[type]) {
        var i = this.courses[type].indexOf(course);
        (<FormArray>this.coursesGroup[type].get('array')).push(this.fb.group({
          name: [course.name, Validators.required],
          color: [course.color, [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
          link: [course.link],
          cleanUrl: [course.cleanUrl],
          size: [course.size],
          x: [course.x],
          y: [course.y],
          des:[course.des, Validators.required]
        }));
        for (let para of course.des) {
          this.dummyText += para + '\r\n';
        }
        this.dummyText = this.dummyText.slice(0, -4);
        (<FormArray>this.coursesGroup[type].get('array')).at(i).get('des').patchValue(this.dummyText);
      }
    }
    this.formService.doneEditSection($event);
    this.sectionOnEdit = false;
  }
  cancelEditSection($event) {
    for (let type of this.courseTypes) {
      this.courses[type] = (<FormArray>this.coursesGroup[type].get('array')).value;
      for (let course of this.courses[type]) {
        var i = this.courses[type].indexOf(course);
        this.courses[type][i].des = (<FormArray>this.coursesGroup[type].get('array')).at(i).value.des.split('\r\n');
      }
    }
    this.formService.doneEditSection($event);
    this.sectionOnEdit = false;
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
  delete(type, i) {
    this.courses[type].splice(i, 1);
  }
  expand($event) {
    this.formService.expand($event);
    this.formService.formOpenCounter();
  }
  onFileChange($event, type, i) {
    if ($event.target.files && $event.target.files.length) {
      var file = $event.target.files[0];
      var url = URL.createObjectURL(file);
      this.files[type][i].push({current: false, file: file});
      this.courses[type][i].cleanUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
      this.courses[type][i].link = file.name;
    }
  }
  cancel($event, type, i) {
    $event.stopPropagation();
    for (let x of Object.keys(this.courses[type][i])) {
      if (x !== 'cleanUrl' && x !== 'link') {
        (<FormArray>this.coursesGroup[type].get('array')).at(i).get(x).patchValue(this.courses[type][i][x]);
      }
    }
    this.dummyText = '';
    for (var x = 0; x < this.courses[type][i].des.length; x++) {
      this.dummyText += this.courses[type][i].des[x] + '\r\n';
    }
    this.dummyText = this.dummyText.slice(0, -2);
    (<FormArray>this.coursesGroup[type].get('array')).at(i).get('des').patchValue(this.dummyText);
    this.courses[type][i].cleanUrl = (<FormArray>this.coursesGroup[type].get('array')).at(i).get('cleanUrl').value;
    this.courses[type][i].link = (<FormArray>this.coursesGroup[type].get('array')).at(i).get('link').value;
    $event.currentTarget.parentNode.parentNode.querySelector('input[type=file]').value = null;
    if (this.files[type][i].length !== 0) {
      if (this.files[type][i][0].current) {
        this.files[type][i].splice(1, this.files[type][i].length - 1);
      } else {
        this.files[type][i] = [];
      }
    }
    this.formService.collapse($event);
    this.formService.formCloseCounter();
  }
  onSubmit($event, type, i) {
    $event.stopPropagation();
    if (this.coursesGroup[type].get('array').at(i).valid) {
      (<FormArray>this.coursesGroup[type].get('array')).at(i).get('des').patchValue((<FormArray>this.coursesGroup[type].get('array')).at(i).get('des').value.trim().replace(/\r\n{2,}|\n{2,}|\r{2,}|\n\r{2,}/, '\r\n'));
      for (let x of Object.keys((<FormArray>this.coursesGroup[type].get('array')).value[i])) {
        if (x !== 'cleanUrl' && x !== 'link') {
          this.courses[type][i][x] = (<FormArray>this.coursesGroup[type].get('array')).value[i][x];
        }
      }
      this.courses[type][i].des = this.courses[type][i].des.toString().split(/\r\n|\n|\r|\n\r/).filter(Boolean);
      (<FormArray>this.coursesGroup[type].get('array')).at(i).get('cleanUrl').patchValue(this.courses[type][i].cleanUrl);
      (<FormArray>this.coursesGroup[type].get('array')).at(i).get('link').patchValue(this.courses[type][i].link);
      if (this.files[type][i].length !== 0) {
        this.files[type][i].splice(0,this.files[type][i].length - 1);
        this.files[type][i][0].current = true;
      }
      this.formService.collapse($event);
      this.formService.formCloseCounter();
    }
  }
  newExpand($event) {
    this.formService.expand($event);
    this.formService.formOpenCounter();
  }
  newOnFileChange($event, type) {
    if ($event.target.files && $event.target.files.length) {
      var file = $event.target.files[0];
      var url = URL.createObjectURL(file);
      this.newFile[type].push({current: false, file: file});
      this.newCourse[type].cleanUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
      this.newCourse[type].link = file.name;
    }
  }
  newCancel($event, type) {
    $event.stopPropagation();
    this.newCoursesGroup[type] = this.fb.group({
      name: ['', Validators.required],
      color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
      link: [''],
      cleanUrl: [],
      size: ['1000'],
      x: ['500'],
      y: ['500'],
      des:['', Validators.required]
    });
    this.newCourse[type].cleanUrl = null;
    this.newCourse[type].link = null;
    this.newFile[type] = [];
    $event.currentTarget.parentNode.parentNode.querySelector('input[type=file]').value = null;
    this.formService.collapse($event);
    this.formService.formCloseCounter();
  }
  newOnSubmit($event, type) {
    $event.stopPropagation();
    if (this.newCoursesGroup[type].valid) {
      if (this.newCoursesGroup[type].get('name').value.trim() !== '' || this.newCoursesGroup[type].get('des').value.trim() !== '') {
        (<FormArray>this.coursesGroup[type].get('array')).push(this.fb.group({
          name: [this.newCoursesGroup[type].get('name').value, Validators.required],
          color: [this.newCoursesGroup[type].get('color').value, [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
          cleanUrl: [this.newCourse[type].cleanUrl],
          link: [this.newCourse[type].link],
          size: [this.newCoursesGroup[type].get('size').value],
          x: [this.newCoursesGroup[type].get('x').value],
          y: [this.newCoursesGroup[type].get('y').value],
          des:[this.newCoursesGroup[type].get('des').value, Validators.required]
        }));
        this.courses[type].push((<FormArray>this.coursesGroup[type].get('array')).at((<FormArray>this.coursesGroup[type].get('array')).length - 1).value);
        this.courses[type][this.courses[type].length - 1].des = this.courses[type][this.courses[type].length - 1].des.toString().split(/\r\n|\n|\r|\n\r/);
        if (this.newFile[type].length !== 0) {
          this.newFile[type][this.newFile[type].length - 1].current = true;
          this.files[type].push([this.newFile[type][this.newFile[type].length - 1]]);
        }
      }
      this.newCoursesGroup[type] = this.fb.group({
        name: ['', Validators.required],
        color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
        link: [''],
        cleanUrl: [],
        size: ['1000'],
        x: ['500'],
        y: ['500'],
        des:['', Validators.required]
      });
      this.newCourse[type] = {};
      this.newFile[type] = [];
      $event.currentTarget.parentNode.parentNode.querySelector('input[type=file]').value = null;
      this.formService.collapse($event);
      this.formService.formCloseCounter();
    }
  }
  ngOnInit() {
    this.dataService.getData('main/courses').subscribe(
      data => {
        this.courses = data;
        this.courseTypes = Object.keys(this.courses);
        for (let type of this.courseTypes) {
          this.coursesGroup[type] = this.fb.group({
            array: this.fb.array([])
          });
          this.newCoursesGroup[type] = this.fb.group({
              name: ['', Validators.required],
              color: ['', [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
              link: [''],
              cleanUrl: [],
              size: ['1000'],
              x: ['500'],
              y: ['500'],
              des:['', Validators.required]
          });
          this.courseImages[type] = [];
          this.files[type] = [];
          this.newFile[type] = [];
          this.newCourse[type] = [];
          for (let course of this.courses[type]) {
            var i = this.courses[type].indexOf(course);
            for (var x = 0; x < course.des.length; x++) {
              this.dummyText += course.des[x] + '\r\n';
            }
            this.files[type][i] = [];
            this.dummyText = this.dummyText.slice(0, -4);
            (<FormArray>this.coursesGroup[type].get('array')).push(this.fb.group({
              name: [course.name, Validators.required],
              color: [course.color, [Validators.required, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')]],
              link: [course.link],
              cleanUrl: [],
              size: [course.size],
              x: [course.x],
              y: [course.y],
              des:[this.dummyText, Validators.required]
            }));
            this.dataService.getFile(course.link).subscribe(
              data => {
                var i = this.courses[type].indexOf(course);
                var url = URL.createObjectURL(data);
                var sanitizedUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
                course.cleanUrl = sanitizedUrl;
                (<FormArray>this.coursesGroup[type].get('array')).at(i).get('cleanUrl').patchValue(sanitizedUrl);
              }
            )
          }
        }
      }
    );
  }
}
