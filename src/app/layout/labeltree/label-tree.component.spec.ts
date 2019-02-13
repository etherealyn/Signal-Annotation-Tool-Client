import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelTreeComponent } from './label-tree.component';

describe('LabelTreeComponent', () => {
  let component: LabelTreeComponent;
  let fixture: ComponentFixture<LabelTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
