import { Component, OnInit, HostListener } from '@angular/core';
import { transition, style, trigger, animate } from '@angular/animations';

@Component({
  selector: 'preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: [
    './preview-page.component.css',
    '../global.css'
  ],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('600ms ease', style({opacity: 0}))
      ])
    ])
  ]
})
export class PreviewPageComponent implements OnInit {

  constructor() { }
  @HostListener('window: orientationchange', []) onOri() {
    if (/CriOS/i.test(navigator.userAgent)) {
      (<HTMLElement>document.querySelector('.preview-wrap')).style.height = window.innerWidth + 'px';
    }
  }
  ngOnInit() {
    if (/CriOS/i.test(navigator.userAgent)) {
      (<HTMLElement>document.querySelector('.preview-wrap')).style.height = window.innerWidth + 'px';
    }
  }
}
