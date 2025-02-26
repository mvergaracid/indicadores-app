import { Injectable } from '@angular/core';
import { IndicadorValues } from '../models/indicador.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadorStateService {
  private indicadorSeleccionado: IndicadorValues | undefined;

  set(indicador: IndicadorValues) {
    this.indicadorSeleccionado = indicador;
  }

  get(): IndicadorValues {
    return this.indicadorSeleccionado || { id: 0, nombre: '', tipo: '', symbol: '' };
  }

  clearIndicador() {
    this.indicadorSeleccionado = undefined;
  }
}
