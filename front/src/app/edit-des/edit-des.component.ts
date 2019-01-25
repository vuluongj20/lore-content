import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { FormService } from '../form.service';

@Component({
  selector: 'app-edit-des',
  templateUrl: './edit-des.component.html',
  styleUrls: [
    './edit-des.component.css',
    '../global.css'
  ]
})
export class EditDesComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private formService: FormService,
    private fb: FormBuilder
  ) { }

  des: any;
  dummyText: string = '';
  desGroup = this.fb.group({
    des: ['', Validators.required]
  });
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
  expand($event) {
    this.formService.expand($event);
    this.formService.formOpenCounter();
  }
  cancel($event) {
    this.desGroup.get('des').patchValue(this.des);
    this.dummyText = '';
    for (var x=0; x < this.des.length; x++) {
      this.dummyText += this.des[x] + '\r\n';
    }
    this.dummyText = this.dummyText.slice(0, -2);
    this.desGroup.get('des').setValue(this.dummyText);
    $event.stopPropagation();
    this.formService.collapse($event);
    this.formService.formCloseCounter();
  }
  onSubmit($event) {
    $event.stopPropagation();
    if (this.desGroup.valid) {
      this.desGroup.get('des').patchValue(this.desGroup.get('des').value.trim().replace(/\r\n{2,}|\n{2,}|\r{2,}|\n\r{2,}/, '\r\n'));
      this.des = this.desGroup.get('des').value;
      this.des = this.des.toString().split(/\r\n|\n|\r|\n\r/).filter(Boolean);
      this.formService.collapse($event);
      this.formService.formCloseCounter();
    }
  }

  ngOnInit() {
    this.dataService.getData('main/des').subscribe(data => {
      this.des = data;
      for (var x=0; x < this.des.length; x++) {
        this.dummyText += this.des[x] + '\r\n';
      }
      this.dummyText = this.dummyText.slice(0, -4);
      this.desGroup.get('des').setValue(this.dummyText);
    });
  }

}
