import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, style, animate, transition} from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDataService } from '../data.service';
import { SlideService } from '../slide.service';

@Component({
  selector: 'course-wrap',
  templateUrl: './course-wrap.component.html',
  styleUrls: [
    './course-wrap.component.css',
    '../global.css'
  ],
  animations: [
    trigger("slide", [
      transition(':enter',[
        style({
          "transform": "translateY(5%)",
          "opacity": 0
        }),
        animate('300ms 0ms ease')
      ]),
      transition(':leave',[
        animate('300ms 0ms ease',
        style({
          "transform": "translateY(5%)",
          "opacity": 0
        }))
      ])
    ])
  ]
})
export class CourseWrapComponent implements OnInit {

  constructor(
    private previewDataService: PreviewDataService,
    private slideService: SlideService,
    private dom: DomSanitizer
  ) { }
  @HostListener('window: resize', ['$event']) onResize($event) {
    if ($event.target.innerWidth < 768) {
      clearTimeout(this.resizeTimeout);
      document.querySelectorAll('.row-two>.course-preview').forEach((course) => {
        (<HTMLElement>course).style.transition = 'none';
      });
      this.sliderClickable = false;
      this.resizeTimeout = setTimeout(() => {
        for (let type of this.courseTypes) {
          for (let row of this.rows[type]) {
            if (row.length == 2) {
              var i = this.rows[type].indexOf(row);
              this.slideService.move(this.rows[type][i], this.rowStats[type][i], 'none');
            }
          }
        }
        this.sliderClickable = true;
      }, 500);
    }
  }
  courses: any = {};
  courseTypes: any = [];
  desOn: any = {};
  rows: any = {};
  rowStats: any = {};
  sliderClickable: boolean = true;
  resizeTimeout: any;
  scrollPos: number;
  currentTransform: string;
  desToggleIn(type, ir, ic) {
    this.scrollPos = window.scrollY;
    setTimeout(function () {
      (<HTMLElement>document.querySelector('body')).style.overflow = 'hidden';
      (<HTMLElement>document.querySelector('body')).style.position = 'fixed';
    }, 400);
    this.desOn.type = type;
    this.desOn.ir = ir;
    this.desOn.ic = ic;
  }
  desToggleOut() {
    (<HTMLElement>document.querySelector('body')).style.overflow = 'initial';
    (<HTMLElement>document.querySelector('body')).style.position = 'initial';
    window.scrollTo(0, this.scrollPos);
    this.desOn = {};
  }
  touchStart($event) {
    $event.currentTarget.classList.add('touch');
  }
  touchEnd($event) {
    $event.currentTarget.classList.remove('touch');
  }
  move(type, i, direction: string) {
    this.sliderClickable = false;
    var newPos = this.slideService.move(this.rows[type][i], this.rowStats[type][i], direction);
    this.rows[type][i] = newPos.array;
    this.rowStats[type][i] = newPos.i;
    setTimeout(() => {
      this.sliderClickable = true;
    }, 450);
  }
  ngOnInit() {
    this.courses = this.previewDataService.courses;
    this.courseTypes = Object.keys(this.courses);
    for (let type of this.courseTypes) {
      this.rows[type] = [];
      while (this.courses[type].length > 0) {
        this.rows[type].push(this.courses[type].splice(0, 4));
      }
      if (this.rows[type].length >= 2 && this.rows[type][this.rows[type].length - 2].length != this.rows[type][this.rows[type].length - 1].length) {
        for (let course of this.rows[type][this.rows[type].length - 1]) {
          this.rows[type][this.rows[type].length - 2].push(course);
        }
        this.rows[type].splice(this.rows[type].length - 1);
      }
      for (let type of Object.keys(this.rows)) {
        this.rowStats[type] = [];
        for (let row of this.rows[type]) {
          var i = this.rows[type].indexOf(row);
          if (this.rows[type][i].length == 2) {
            this.rowStats[type][i] = 0;
            this.slideService.move(this.rows[type][i], this.rowStats[type][i], 'none');
          }
          if (this.rows[type][i].length == 3 || this.rows[type][i].length == 4) {
            var newRow = JSON.parse(JSON.stringify(this.rows[type][i]));
            for (let course of newRow) {
              var _i = newRow.indexOf(course);
              course.cleanUrl = this.rows[type][i][_i].cleanUrl;
              this.rows[type][i].push(course);
            }
          }
          if (this.rows[type][i].length > 4) {
            this.rowStats[type][i] = 0;
            var newPos = this.slideService.move(this.rows[type][i], this.rowStats[type][i], 'none');
            this.rows[type][i] = newPos.array;
            this.rowStats[type][i] = newPos.i;
          }
        }
      }
    }
  }
}
