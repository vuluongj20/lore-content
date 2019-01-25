import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.css',
    '../global.css'
  ]
})
export class FooterComponent implements OnInit {

  constructor() { }
  year: number;

  ngOnInit() {
    this.year = new Date().getFullYear();
  }

}
