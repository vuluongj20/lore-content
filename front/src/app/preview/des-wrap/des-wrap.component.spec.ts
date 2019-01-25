import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandingTextComponent } from './expanding-text.component';

describe('ExpandingTextComponent', () => {
  let component: ExpandingTextComponent;
  let fixture: ComponentFixture<ExpandingTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandingTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
