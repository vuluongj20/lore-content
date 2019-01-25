import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlideService {

  constructor() { }

  left = 'translate(-155%, -50%)';
  lefter = 'translate(-170%, -50%)';
  leftHid = 'translate(-260%, -50%)';
  right = 'translate(55%, -50%)';
  righter = 'translate(70%, -50%)';
  rightHid = 'translate(160%, -50%)';
  transOn = 'transform 400ms ease';
  transOn2 = 'opacity 400ms ease, transform 400ms ease';
  mid = 'translate(-50%, -50%)';

  assign2(array, i, direction: string) {
    switch (i) {
      case 0:
        array[1].trans = this.transOn2;
        if (direction == 'right') {
          array[0].slide = this.righter;
        } else {
          array[0].slide = this.lefter;
        }
        setTimeout(() => {
          array[0].trans = this.transOn2;
          array[0].slide = this.mid;
          if (direction == 'right') {
            array[1].slide = this.lefter;
          } else {
            array[1].slide = this.righter;
          }
        }, 50);
        setTimeout(() => {
          array[1].trans = 'none';
        }, 450);
        break;
      case 1:
        array[0].trans = this.transOn2;
        if (direction == 'right') {
          array[1].slide = this.righter;
        } else {
          array[1].slide = this.lefter;
        }
        setTimeout(() => {
          array[1].trans = this.transOn2;
          array[1].slide = this.mid;
          if (direction == 'right') {
            array[0].slide = this.lefter;
          } else {
            array[0].slide = this.righter;
          }
        }, 50);
        setTimeout(() => {
          array[0].trans = 'none';
        }, 450);
        break;
    }
  }
  assign(array, i) {
    array[i].slide = 'translate(-50%, -50%)';
    array[i].opa = 1;
    if (array[i-1] != undefined) {
      array[i-1].opa = 1;
      array[i-1].slide = this.left;
      if (array[i-2] != undefined) {
        array[i-2].slide = this.leftHid;
        array[i-2].opa = 0;
      } else {
        array[array.length - 1].slide = this.leftHid;
        array[array.length - 1].opa = 0;
      }
    } else {
      array[array.length - 1].opa = 1;
      array[array.length - 1].slide = this.left;
      array[array.length - 2].slide = this.leftHid;
      array[array.length - 2].opa = 0;
    }
    if (array[i+1] != undefined) {
      array[i+1].opa = 1;
      array[i+1].slide = this.right;
      if (array[i+2] != undefined) {
        array[i+2].slide = this.rightHid;
        array[i+2].opa = 0;
      } else {
        array[0].slide = this.rightHid;
        array[0].opa = 0;
      }
    } else {
      array[0].opa = 1;
      array[0].slide = this.right;
      array[1].slide = this.rightHid;
      array[1].opa = 0;
    }
  }
  move(array, i, direction: string) {
    var subject: any = {};
    switch (array.length) {
      case 2:
        switch (direction) {
          case 'right':
            if (i == 0) {
              i = 1;
            } else {
              i = 0;
            }
            this.assign2(array, i, 'right');
            break;
          case 'left':
            if (i == 0) {
              i = 1;
            } else {
              i = 0;
            }
            this.assign2(array, i, 'left');
            break;
          case 'none':
            switch (i) {
              case 0:
                array[0].trans = 'transform 400ms ease';
                array[1].slide = 'translate(70%, -50%)';
                array[1].trans = 'none';
                break;
              case 1:
                array[1].trans = 'transform 400ms ease';
                array[0].slide = 'translate(70%, -50%)';
                array[0].trans = 'none';
                break;
            }
            break;
        }
        break;
      default:
        switch (direction) {
          case 'right':
            if (i < array.length - 1) {
              i ++;
            } else {
              i = 0;
            }
            break;
          case 'left':
            if (i > 0) {
              i --;
            } else {
              i = array.length - 1;
            }
            break;
        }
        this.assign(array, i);
        break;
    }
    subject = {array: array, i: i};
    return subject;
  }
}
