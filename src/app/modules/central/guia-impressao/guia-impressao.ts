import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryOrder } from '../../../types';

@Component({
  selector: 'app-guia-impressao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guia-impressao.html'
})
export class GuiaImpressaoComponent {
  @Input() pedido: DeliveryOrder | null = null;
  @Output() fechar = new EventEmitter<void>();

  aoFechar?: () => void;

  iniciar(pedido: DeliveryOrder, fecharCallback?: () => void) {
    this.pedido = pedido;
    this.aoFechar = fecharCallback;
  }

  imprimir() {
    window.print();
  }

  fecharModal() {
    this.fechar.emit();
    if (this.aoFechar) this.aoFechar();
  }
}

export { GuiaImpressaoComponent as GuiaImpressao };

