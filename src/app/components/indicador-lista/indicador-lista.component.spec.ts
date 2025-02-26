import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IndicadorListaComponent } from './indicador-lista.component';

describe('IndicadorListaComponent', () => {
  let component: IndicadorListaComponent;
  let fixture: ComponentFixture<IndicadorListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadorListaComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: { paramMap: of({ get: () => 'dolar' }) },
      }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IndicadorListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
