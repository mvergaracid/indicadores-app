import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndicadoresComponent } from './components/indicadores/indicadores.component';
import { IndicadorGraficoComponent } from './components/indicador-grafico/indicador-grafico.component';
import { HeaderComponent } from './components/header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IndicadoresComponent, IndicadorGraficoComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'indicadores-app';
}
