import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './site.html'
})
export class SiteComponent {
  cidade: string = 'Criciúma';
  bairro: string = 'Centro';
  resultadoValor: number | null = 18.0;

  calcularFrete() {
    this.resultadoValor = 18.0;
  }
}

