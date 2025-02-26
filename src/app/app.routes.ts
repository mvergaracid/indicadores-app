import { Routes } from '@angular/router';
import { IndicadoresComponent } from './components/indicadores/indicadores.component';
import { IndicadorGraficoComponent } from './components/indicador-grafico/indicador-grafico.component';
import { IndicadorListaComponent } from './components/indicador-lista/indicador-lista.component';

export const routes: Routes = [
    { path: '', component: IndicadoresComponent },
    { path: 'detalle/:id', component: IndicadorGraficoComponent },
    { path: 'lista/:id', component: IndicadorListaComponent },
];
