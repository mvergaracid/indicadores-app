import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IndicadorGraficoComponent } from './indicador-grafico.component';

describe('IndicadorGraficoComponent', () => {
  let component: IndicadorGraficoComponent;
  let fixture: ComponentFixture<IndicadorGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadorGraficoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'dolar' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndicadorGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
