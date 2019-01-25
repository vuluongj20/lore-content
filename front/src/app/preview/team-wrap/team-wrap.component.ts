import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDataService } from '../data.service';

@Component({
  selector: 'team-wrap',
  templateUrl: './team-wrap.component.html',
  styleUrls: [
    './team-wrap.component.css',
    '../global.css'
  ]
})
export class TeamWrapComponent implements OnInit {
  constructor(
    private previewDataService: PreviewDataService,
    private dom: DomSanitizer
  ) { }

  mems: any;
  touchStart($event) {
    $event.currentTarget.classList.add('touch');
  }
  touchEnd($event) {
    $event.currentTarget.classList.remove('touch');
  }
  ngOnInit() {
    this.mems = this.previewDataService.mems;
    // for (let mem of this.mems) {
    //   this.dataService.getFile('files/' + mem.link).subscribe(data => {
    //     var url = URL.createObjectURL(data);
    //     var sanitizedUrl = this.dom.bypassSecurityTrustUrl(url);
    //     mem.imageURL = sanitizedUrl;
    //   });
    // }
  }

}
