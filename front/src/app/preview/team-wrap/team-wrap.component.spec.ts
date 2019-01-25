import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamWrapComponent } from './team-wrap.component';

describe('TeamWrapComponent', () => {
  let component: TeamWrapComponent;
  let fixture: ComponentFixture<TeamWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
