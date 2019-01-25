import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: [
    './error.component.css',
    '../global.css'
  ]
})
export class ErrorComponent implements OnInit {
  @Input() status: number;
  constructor() { }
  onTouchStart($event) {
    $event.currentTarget.classList.add('touch');
  }
  onTouchEnd($event) {
    $event.currentTarget.classList.remove('touch');
  }

  ngOnInit() {
  }

}
