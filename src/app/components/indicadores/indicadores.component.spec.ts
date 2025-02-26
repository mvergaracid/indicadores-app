import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndicadoresComponent } from './indicadores.component';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { IndicadoresService } from '../../services/indicadores.service';
import { IndicadorStateService } from '../../services/indicadores-state.service';
import { HeaderService } from '../../services/header.service';
import dayjs from 'dayjs';

describe('IndicadoresComponent', () => {
  let component: IndicadoresComponent;
  let fixture: ComponentFixture<IndicadoresComponent>;
  let indicadoresService: jasmine.SpyObj<IndicadoresService>;
  let indicadorStateService: jasmine.SpyObj<IndicadorStateService>;
  let headerService: jasmine.SpyObj<HeaderService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    indicadoresService = jasmine.createSpyObj('IndicadoresService', ['getDayIndicador', 'getYearIndicador']);
    indicadorStateService = jasmine.createSpyObj('IndicadorStateService', ['set']);
    headerService = jasmine.createSpyObj('HeaderService', ['updateTitle']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IndicadoresComponent, HttpClientTestingModule],
      providers: [
        IndicadoresService,
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => 'dolar' }) },
        },
        { provide: IndicadoresService, useValue: indicadoresService },
        { provide: IndicadorStateService, useValue: indicadorStateService },
        { provide: HeaderService, useValue: headerService },
        { provide: Router, useValue: router }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(IndicadoresComponent);
    component = fixture.componentInstance;

  });

  afterEach(() => {
    indicadoresService.getDayIndicador.calls.reset();
    indicadoresService.getYearIndicador.calls.reset();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar los indicadores correctamente', () => {
    const mockData = [
      [{ Valor: '950', Fecha: '2025-02-20' }], // dolar
      [{ Valor: '940', Fecha: '2025-02-19' }], // euro
      [{ Valor: '38.5', Fecha: '2025-02-18' }], // uf
      [{ Valor: '0.4', Fecha: '2025-02-17' }], // ipc
      [{ Valor: '63.2', Fecha: '2025-02-16' }]  // utm
    ];

    indicadoresService.getDayIndicador.and.returnValues(of(mockData[0]), of(mockData[1]));
    indicadoresService.getYearIndicador.and.returnValues(of(mockData[2]), of(mockData[3]), of(mockData[4]));

    fixture.detectChanges();

    expect(indicadoresService.getDayIndicador).toHaveBeenCalledTimes(2);
    expect(indicadoresService.getYearIndicador).toHaveBeenCalledTimes(3);

    expect(headerService.updateTitle).toHaveBeenCalledWith('Indicadores');

    expect(indicadoresService.getDayIndicador).toHaveBeenCalledWith('dolar', 30);
    expect(indicadoresService.getDayIndicador).toHaveBeenCalledWith('euro', 30);

    expect(indicadoresService.getYearIndicador).toHaveBeenCalledWith('uf');
    expect(indicadoresService.getYearIndicador).toHaveBeenCalledWith('ipc');
    expect(indicadoresService.getYearIndicador).toHaveBeenCalledWith('utm');

    expect(component.indicadoresValues[0].data).toEqual(mockData[0]);
    expect(component.indicadoresValues[1].data).toEqual(mockData[1]);
    expect(component.indicadoresValues[2].data).toEqual(mockData[2]);
    expect(component.indicadoresValues[3].data).toEqual(mockData[3]);
    expect(component.indicadoresValues[4].data).toEqual(mockData[4]);
  });

  it('debe actualizar el título y mostrar los últimos 30 días si indicador.id <= 3', () => {
    const indicadorValue = { id: 2, nombre: 'Euro', symbol: '$', tipo: '' };
    const mockData = Array(40)
      .fill(null)
      .map((_, i) => ({ Fecha: `2025-02-${i + 1}`, Valor: (950 + i).toString() }));

    component.indicadoresValues = [
      {
        id: 1, data: mockData,
        nombre: 'Dolar',
        tipo: 'Dolar',
        symbol: '$'
      },
      {
        id: 2, data: mockData,
        nombre: 'Euro',
        tipo: 'Pesos',
        symbol: '$'
      },
      {
        id: 3, data: mockData,
        nombre: 'UF',
        tipo: 'Pesos',
        symbol: '$'
      },
    ];

    component.verLista(indicadorValue);

    expect(headerService.updateTitle).toHaveBeenCalledWith('Euro');
    expect(indicadorStateService.set).toHaveBeenCalledWith({
      id: 2,
      nombre: 'Euro',
      tipo: 'Pesos',
      symbol: '$',
      data: mockData.slice(-30),
    });
    expect(router.navigate).toHaveBeenCalledWith(['/lista', 2]);
  });

  it('debe mostrar solo los datos del año en curso si indicador.id > 3', () => {
    const currentYear = dayjs().year();
    const indicadorValue = {
      id: 4, nombre: 'IPC', tipo: 'Porcentaje',
      symbol: '%'
    };

    const mockData = [
      { Fecha: `${currentYear}-02-01`, Valor: '38.5' },
      { Fecha: `${currentYear - 1}-02-01`, Valor: '38.2' },
      { Fecha: `${currentYear}-03-01`, Valor: '38.9' },
    ];

    component.indicadoresValues = [
      {
        id: 1,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 2,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 3,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 4,
        nombre: 'IPC',
        tipo: 'Porcentaje',
        symbol: '%',
        data: mockData
      },
    ];

    component.verLista(indicadorValue);

    expect(headerService.updateTitle).toHaveBeenCalledWith('IPC');

    expect(indicadorStateService.set).toHaveBeenCalledWith({
      id: 4,
      nombre: 'IPC',
      tipo: 'Porcentaje',
      symbol: '%',
      data: mockData.filter(({ Fecha }) => Number(Fecha.split('-')[0]) === currentYear),
    });

    expect(router.navigate).toHaveBeenCalledWith(['/lista', 4]);
  });

  it('debe mostrar los últimos 10 días si indicador.id <= 3', () => {
    const indicadorValue = {
      id: 2, nombre: 'Euro', tipo: 'Pesos',
      symbol: '$'
    };
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      Fecha: `2025-02-${i + 1}`,
      Valor: (900 + i).toString()
    }));

    component.indicadoresValues = [
      {
        id: 1,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 2,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
    ];

    component.verDetalle(indicadorValue);

    expect(headerService.updateTitle).toHaveBeenCalledWith('Euro');
    expect(indicadorStateService.set).toHaveBeenCalledWith({
      id: 2,
      nombre: 'Euro', tipo: 'Pesos',
      symbol: '$',
      data: mockData.slice(-10)
    });
    expect(router.navigate).toHaveBeenCalledWith(['/detalle', 2]);
  });

  it('debe mostrar los últimos 12 meses si indicador.id > 3', () => {
    const indicadorValue = {
      id: 4, nombre: 'IPC', tipo: 'Porcentaje',
      symbol: '%',
    };
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      Fecha: `2024-${String(i % 12 + 1).padStart(2, '0')}-01`,
      Valor: (30 + i).toString()
    }));

    component.indicadoresValues = [
      {
        id: 1,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 2,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 3,
        nombre: '',
        tipo: '',
        symbol: '',
        data: mockData
      },
      {
        id: 4,
        nombre: 'IPC',
        tipo: 'Porcentaje',
        symbol: '%',
        data: mockData
      },
    ];

    component.verDetalle(indicadorValue);

    expect(headerService.updateTitle).toHaveBeenCalledWith('IPC');
    expect(indicadorStateService.set).toHaveBeenCalledWith({
      id: 4,
      nombre: 'IPC',
      tipo: 'Porcentaje',
      symbol: '%',
      data: mockData.slice(-12)
    });
    expect(router.navigate).toHaveBeenCalledWith(['/detalle', 4]);
  });



});
