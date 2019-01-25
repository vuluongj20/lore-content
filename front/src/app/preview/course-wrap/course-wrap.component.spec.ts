import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseWrapComponent } from './course-wrap.component';

describe('CourseWrapComponent', () => {
  let component: CourseWrapComponent;
  let fixture: ComponentFixture<CourseWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
