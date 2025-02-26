import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { IndicadorStateService } from '../../services/indicadores-state.service';
import { IndicadorValues } from '../../models/indicador.model';

import dayjs from 'dayjs';

Chart.register(...registerables);

@Component({
  selector: 'app-indicador-grafico',
  standalone: true,
  templateUrl: './indicador-grafico.component.html',
  styleUrls: ['./indicador-grafico.component.css']
})
export class IndicadorGraficoComponent implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  indicadorValues: IndicadorValues | undefined;
  fecha: string = '';
  valor: string = '';
  symbol: string = ''
  chart!: Chart;

  constructor(private route: ActivatedRoute, private router: Router, private indicadorState: IndicadorStateService) { }

  ngOnInit() {
    this.indicadorValues = this.indicadorState.get()
    if (!this.indicadorValues.id) this.volver()
    if (this.indicadorValues?.data) {
      this.fecha = dayjs(this.indicadorValues.data[this.indicadorValues.data.length - 1].Fecha).format('DD-MM-YYYY')
      this.valor = this.indicadorValues.data[this.indicadorValues.data.length - 1].Valor
      this.symbol = this.indicadorValues.symbol;
    }
  }

  volver() {
    this.router.navigate(['/']);
  }

  ngAfterViewInit() {
    this.generarGrafico();
  }

  generarGrafico() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const labels = this.indicadorValues?.data?.map(d => d.Fecha);
    const valores = this.indicadorValues?.data?.map(d => parseFloat(d.Valor.replace(/\./g, '').replace(',', '.')));
    const yAxisFormatter = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format;

    if (valores) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `Valor de ${this.indicadorValues?.nombre}`,
            data: valores || [],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: 'blue'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Fecha'
              },
              ticks: {
                display: true,
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90,
                callback: function (value, index, values) {
                  return labels && labels[index]
                    ? dayjs(labels[index]).format('DD-MM-YYYY')
                    : '';
                },
              }
            },
            y: {
              title: {
                display: true,
                text: `Valor (${this.symbol})`
              },
              ticks: {
                callback: function (value) {
                  return yAxisFormatter(Number(value));
                }
              }
            }
          }
        }
      });
    }
  }
}
