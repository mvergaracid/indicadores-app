import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any = {};

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<void> {
    console.log('====> Intentando cargar config.json');
    return this.http.get('/assets/config.json')
      .toPromise()
      .then((config) => {
        this.config = config;
        console.log('====> Configuración cargada:', this.config);
      })
      .catch((error) => {
        console.error('====> Error al cargar config.json:', error);
      });
  }

  get apiUrl(): string {
    return this.config?.API_URL || environment.API_URL;
  }

  get ApiKey(): string {
    return this.config?.API_KEY || environment.API_KEY;
  }

  get ApiCacheTime(): number {
    return this.config?.API_CACHE || environment.API_CACHE
  }
}
