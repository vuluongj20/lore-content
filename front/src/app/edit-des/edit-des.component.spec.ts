import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDesComponent } from './edit-des.component';

describe('EditDesComponent', () => {
  let component: EditDesComponent;
  let fixture: ComponentFixture<EditDesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
