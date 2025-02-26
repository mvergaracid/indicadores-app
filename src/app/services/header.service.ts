import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private titleSource = new BehaviorSubject<string>('Indicadores');
  currentTitle$ = this.titleSource.asObservable();

  updateTitle(title: string) {
    this.titleSource.next(title);
  }
}
