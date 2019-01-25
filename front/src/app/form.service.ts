import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }
  private sourceCounter = new BehaviorSubject(0);
  currentCounter = this.sourceCounter.asObservable();
  formOpenCounter() {
    var newValue = this.sourceCounter.getValue() + 1;
    this.sourceCounter.next(newValue);
  }
  formCloseCounter() {
    var newValue = this.sourceCounter.getValue() - 1;
    this.sourceCounter.next(newValue);
  }
  editSection($event) {
    var a = $event.currentTarget.parentNode.parentNode.parentNode;
    var node = a.parentNode.parentNode.firstChild;
    for (; node; node = node.nextSibling) {
      if (node !== a.parentNode && node.nodeType == 1) {
        node.classList.add('disabled');
      }
    }
    $event.currentTarget.style.display = 'none';
    a.querySelector('.done-edit-section').style.display = 'initial';
    a.querySelector('.cancel-edit-section').style.display = 'initial';
    a.classList.add('onEdit');
    this.scrollIt(
      a,
      300,
      'easeInOutQuad',
      function(){}
    );
  }
  doneEditSection($event) {
    var a = $event.currentTarget.parentNode.parentNode.parentNode;
    var node = a.parentNode.parentNode.firstChild;
    for (; node; node = node.nextSibling) {
      if (node !== a.parentNode && node.nodeType == 1) {
        node.classList.remove('disabled');
      }
    }
    a.querySelector('.done-edit-section').style.display = 'none';
    a.querySelector('.cancel-edit-section').style.display = 'none';
    a.querySelector('.edit-section').style.display = 'initial';
    a.classList.remove('onEdit');
    this.scrollIt(
      a,
      300,
      'easeInOutQuad',
      function(){}
    );
  }
  expand($event) {
    var a = $event.currentTarget.parentNode;
    var node = a.firstChild;
    a.classList.add('on');
    for (; node; node = node.nextSibling) {
      if (node !== a.parentNode && node.nodeType == 1) {
        node.style.display = 'none';
      }
    }
    a.querySelector('.off').style.display = "block";
    this.scrollIt(
      a,
      300,
      'easeInOutQuad',
      function(){}
    );
  }
  collapse($event) {
    var a = $event.currentTarget.parentNode.parentNode;
    var node = a.parentNode.firstChild;
    for (; node; node = node.nextSibling) {
      if (node.nodeType == 1) {
        node.style.display = 'block';
      }
    }
    a.style.display = 'none';
    a.parentNode.classList.remove('on');
    this.scrollIt(
      a.parentNode,
      300,
      'easeInOutQuad',
      function(){}
    );
  }
  scrollIt(destination, duration = 200, easing = 'linear', callback) {
    const easings = {
      linear(t) {
        return t;
      },
      easeInQuad(t) {
        return t * t;
      },
      easeOutQuad(t) {
        return t * (2 - t);
      },
      easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic(t) {
        return t * t * t;
      },
      easeOutCubic(t) {
        return (--t) * t * t + 1;
      },
      easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart(t) {
        return t * t * t * t;
      },
      easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
      },
      easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      },
      easeInQuint(t) {
        return t * t * t * t * t;
      },
      easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
      },
      easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      }
    };

    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset) - 10;

    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }
    function scroll() {

      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      var scrollTo = Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start);
      window.scroll(0, scrollTo);

      if (window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }

      requestAnimationFrame(scroll);
    }
    if (destinationOffsetToScroll < documentHeight - windowHeight - 100) {
      scroll();
    }

  }
}
