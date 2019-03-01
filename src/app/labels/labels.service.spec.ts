import { TestBed } from '@angular/core/testing';

import { LabelsService } from './labels.service';

describe('LabelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LabelsService = TestBed.get(LabelsService);
    expect(service).toBeTruthy();
  });
});
