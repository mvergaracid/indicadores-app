import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  title = 'Indicadores';

  constructor(public router: Router, private headerService: HeaderService,) { }

  ngOnInit() {
    this.headerService.currentTitle$.subscribe(title => {
      this.title = title;
    });
  }

  volver() {
    this.router.navigate(['/']);
  }
}
