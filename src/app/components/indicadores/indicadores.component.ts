import { Component, OnInit } from '@angular/core';
import { IndicadoresService } from '../../services/indicadores.service';
import { Router } from '@angular/router';
import { combineLatest, combineLatestAll } from 'rxjs';
import { Indicador, IndicadorValues } from '../../models/indicador.model';
import { IndicadorStateService } from '../../services/indicadores-state.service';
import { HeaderService } from '../../services/header.service';
import dayjs from 'dayjs'


@Component({
  selector: 'app-indicadores',
  standalone: true,
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit {
  indicadoresValues: IndicadorValues[] = [
    { id: 1, nombre: 'Dolar', tipo: 'Pesos', symbol: '$' },
    { id: 2, nombre: 'Euro', tipo: 'Pesos', symbol: '$' },
    { id: 3, nombre: 'UF', tipo: 'Pesos', symbol: '$' },
    { id: 4, nombre: 'IPC', tipo: 'Porcentaje', symbol: '%' },
    { id: 5, nombre: 'UTM', tipo: 'Pesos', symbol: '$' },
  ];

  dolares: Indicador[] = [];
  euros: Indicador[] = [];
  uf: Indicador[] = [];
  utm: Indicador[] = [];


  constructor(private indicadoresService: IndicadoresService, private indicadorStateService: IndicadorStateService, private headerService: HeaderService, private router: Router) { }

  ngOnInit(): void {
    this.headerService.updateTitle('Indicadores');
    combineLatest([
      this.indicadoresService.getDayIndicador('dolar', 30),
      this.indicadoresService.getDayIndicador('euro', 30),
      this.indicadoresService.getYearIndicador('uf'),
      this.indicadoresService.getYearIndicador('ipc'),
      this.indicadoresService.getYearIndicador('utm')])
      .subscribe(([dolar, euro, uf, ipc, utm]) => {
        this.indicadoresValues[0].data = dolar;
        this.indicadoresValues[1].data = euro;
        this.indicadoresValues[2].data = uf;
        this.indicadoresValues[3].data = ipc;
        this.indicadoresValues[4].data = utm;
      });
  }

  verLista(indicadorValue: IndicadorValues) {
    const currentYear = dayjs().year();
    this.headerService.updateTitle(indicadorValue.nombre);
    let dataToShow: IndicadorValues;
    dataToShow = { ...this.indicadoresValues[indicadorValue.id - 1] }

    if (indicadorValue.id <= 3) {
      dataToShow.data = this.indicadoresValues[indicadorValue.id - 1].data?.slice(-30)
    } else {
      dataToShow.data = this.indicadoresValues[indicadorValue.id - 1].data?.filter(({ Fecha }) =>
        Number(Fecha.split('-')[0]) === currentYear
      )
    }
    this.indicadorStateService.set(dataToShow)
    this.router.navigate(['/lista', indicadorValue.id]);
  }

  verDetalle(indicadorValue: IndicadorValues) {
    this.headerService.updateTitle(indicadorValue.nombre);
    let dataToShow: IndicadorValues;
    dataToShow = indicadorValue
    if (indicadorValue.id <= 3) {
      dataToShow.data = this.indicadoresValues[indicadorValue.id - 1].data?.slice(-10)
    } else {
      dataToShow.data = this.indicadoresValues[indicadorValue.id - 1].data?.slice(-12)
    }

    this.indicadorStateService.set(dataToShow)
    this.router.navigate(['/detalle', indicadorValue.id]);
  }
}
