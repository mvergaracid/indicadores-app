import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndicadoresService } from './indicadores.service';


describe('IndicadoresService', () => {
  let service: IndicadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IndicadoresService],
    });
    service = TestBed.inject(IndicadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
