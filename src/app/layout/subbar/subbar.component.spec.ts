import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubbarComponent } from './subbar.component';

describe('SubbarComponent', () => {
  let component: SubbarComponent;
  let fixture: ComponentFixture<SubbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
