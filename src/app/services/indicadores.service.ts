import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import dayjs from 'dayjs'
import { map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service'

import { Indicador, IndicatorType } from '../models/indicador.model';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  apiKey: string = this.config.ApiKey;
  apiUrlBase: string = this.config.apiUrl;
  private cacheTTL = this.config.ApiCacheTime * 60 * 1000;

  constructor(private http: HttpClient, public config: ConfigService) { }

  getDayIndicador(indicador: IndicatorType, daysFrom: number): Observable<Indicador[]> {
    const cacheKey = `${indicador}-${daysFrom}`;
    const cached = this.getCache(cacheKey);

    if (cached) {
      return of(cached);
    }

    const fromDate = dayjs(dayjs().subtract(daysFrom, 'days'));
    const day = fromDate.date().toString().padStart(2, '0');
    const month = (fromDate.month() + 1).toString().padStart(2, '0');
    const year = fromDate.year();
    const url = `${this.apiUrlBase}/${indicador}/posteriores/${year}/${month}/dias/${day}?apikey=${this.apiKey}&formato=json`
    return this.http.get<Record<string, Indicador[]>>(url).pipe(
      map((response: Record<string, Indicador[]>) => Object.values(response)[0]),
      tap(data => this.setCache(cacheKey, data))
    );
  }

  getYearIndicador(indicador: IndicatorType): Observable<Indicador[]> {
    const cacheKey = `${indicador}`;
    const cached = this.getCache(cacheKey);

    if (cached) {
      return of(cached);
    }
    const currentDate = dayjs();
    const fromDate = dayjs(dayjs().subtract(360, 'days'));
    const year = fromDate.year();
    const month = (fromDate.month() + 1).toString().padStart(2, '0');
    const url = `${this.apiUrlBase}/${indicador}/periodo/${year}/${month}/${currentDate.year()}/${currentDate.month()}?apikey=${this.apiKey}&formato=json`
    return this.http.get<Record<string, Indicador[]>>(url).pipe(
      map((response: Record<string, Indicador[]>) => Object.values(response)[0]),
      tap(data => this.setCache(cacheKey, data))
    );
  }

  private getCache(key: string): Indicador[] | null {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;
    const { data, timestamp } = JSON.parse(cachedItem);
    return (Date.now() - timestamp) < this.cacheTTL ? data : null;
  }

  private setCache(key: string, data: Indicador[]): void {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  }
}
