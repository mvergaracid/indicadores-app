import { Component } from '@angular/core';
import { IndicadorStateService } from '../../services/indicadores-state.service';
import { IndicadorValues } from '../../models/indicador.model';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';


@Component({
  selector: 'app-indicador-lista',
  standalone: true,
  templateUrl: './indicador-lista.component.html',
  styleUrl: './indicador-lista.component.css'
})
export class IndicadorListaComponent {
  indicadorValues: IndicadorValues | undefined;
  constructor(private route: ActivatedRoute, private router: Router, private indicadorState: IndicadorStateService) { }

  ngOnInit() {
    this.indicadorValues = this.indicadorState.get()
    this.indicadorValues.data = this.indicadorValues.data?.map(({ Valor, Fecha }) => {
      return {
        Valor,
        Fecha: dayjs(Fecha).format('DD-MM-YYYY')
      }
    })
    if (!this.indicadorValues.id) this.volver()
  }

  volver() {
    this.router.navigate(['/']);
  }
}
