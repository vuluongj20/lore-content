import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviewDataService {

  constructor() { }
  des: any = [];
  courses: any = {};
  mems: any = [];
  setData(name: string, data) {
    this[name] = JSON.parse(JSON.stringify(data));
    if (name === 'courses') {
      for (let type of Object.keys(this[name])) {
        for (let course of this[name][type]) {
          var i = this[name][type].indexOf(course);
          course.cleanUrl = data[type][i].cleanUrl;
        }
      }
    }
    if (name === 'mems') {
      for (let mem of this[name]) {
        i = this[name].indexOf(mem);
        mem.cleanUrl = data[i].cleanUrl;
      }
    }
  }
}
