import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition} from '@angular/animations';
import { PreviewDataService } from '../data.service';
import { ScrollService } from '../scroll.service';

@Component({
  selector: 'des-wrap',
  templateUrl: './des-wrap.component.html',
  styleUrls: [
    './des-wrap.component.css',
    '../global.css'
  ],
  animations: [
    trigger('fade', [
      transition(':enter',[
        style({
          "opacity": 0
        }),
        animate('200ms ease-in-out')
      ]),
      transition(':leave',[
        animate('100ms ease-in-out',
        style({"opacity": 0}))
      ])
    ])
  ]
})
export class DesWrapComponent implements OnInit {
  constructor (
    private previewDataService: PreviewDataService,
    private scrollService: ScrollService
  ) {}
  des: any;
  isShown: boolean = false;
  showToggle($event) {
    this.isShown = !this.isShown;
    if (!this.isShown) {
      this.scrollService.scrollIt(
        $event.currentTarget.parentNode.parentNode.parentNode,
        300,
        'easeInOutQuad',
        function () {}
      )
    }
  };
  touchStart($event) {
    $event.currentTarget.classList.add('touch');
  }
  touchEnd($event) {
    $event.currentTarget.classList.remove('touch');
  }
  ngOnInit() {
      this.des = this.previewDataService.des;
  }
}
