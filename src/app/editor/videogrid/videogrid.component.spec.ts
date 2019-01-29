import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogridComponent } from './videogrid.component';

describe('VideogridComponent', () => {
  let component: VideogridComponent;
  let fixture: ComponentFixture<VideogridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideogridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideogridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
