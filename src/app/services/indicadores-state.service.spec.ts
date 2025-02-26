import { TestBed } from '@angular/core/testing';

import { IndicadorStateService } from './indicadores-state.service';

describe('IndicadorStateService', () => {
  let service: IndicadorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicadorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
