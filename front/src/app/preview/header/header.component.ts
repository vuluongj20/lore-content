import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css',
    '../global.css'
  ]
})
export class HeaderComponent implements OnInit {
  @HostListener('window: scroll', []) onScroll() {
    this.scrollY = window.scrollY;
    if (this.scrollY < window.innerHeight/10) {
      (<HTMLElement>document.querySelector('.preview.header-wrap')).style.filter = 'none';
    } else if (this.scrollY < window.innerHeight*1.5) {
      var fract = (this.scrollY-window.innerHeight/10)/window.innerHeight;
      (<HTMLElement>document.querySelector('.preview.header-wrap')).style.filter = 'blur(' + Math.floor(fract*100) + 'px) opacity(' + Math.floor(100-100*fract) + '%)';
    }
  }
  @HostListener('window: orientationchange', []) onOri() {
    if (/CriOS/i.test(navigator.userAgent)) {
      this.vh = window.innerWidth;
      console.log(this.vh);
      (<HTMLElement>document.querySelector('.dummy')).style.height = (this.vh*1.1 - 75) + 'px';
      (<HTMLElement>document.querySelector('.preview.header-wrap')).style.height = (this.vh - 75) + 'px';
    }
  }
  constructor() {
  }
  scrollY: number;
  vh: number
  catch: string = 'education.';
  ngOnInit() {
    if (/CriOS/i.test(navigator.userAgent)) {
      this.vh = window.innerHeight;
      (<HTMLElement>document.querySelector('.dummy')).style.height = (this.vh*1.1 - 75) + 'px';
      (<HTMLElement>document.querySelector('.preview.header-wrap')).style.height = (this.vh - 75) + 'px';
    }
  }

}
