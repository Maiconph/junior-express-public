import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryOrder } from '../../../types';
import { storage } from '../../../shared/services/storage';

@Component({
  selector: 'app-quadro-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quadro-pedidos.html'
})
export class QuadroPedidosComponent implements OnInit {
  @Input() pedidos: DeliveryOrder[] = [];
  @Output() imprimir = new EventEmitter<DeliveryOrder>();
  @Output() pedirTransbordo = new EventEmitter<string>();

  aoImprimir?: (pedido: DeliveryOrder) => void;
  aoPedirTransbordo?: (pedidoId: string) => void;

  ngOnInit() {
    if (!this.pedidos || this.pedidos.length === 0) {
      this.pedidos = storage.getOrders();
    }
  }

  iniciar(pedidos: DeliveryOrder[], imprimirCallback?: (p: DeliveryOrder) => void, transbordoCallback?: (id: string) => void) {
    this.pedidos = pedidos;
    this.aoImprimir = imprimirCallback;
    this.aoPedirTransbordo = transbordoCallback;
  }

  get pendentes(): DeliveryOrder[] {
    return this.pedidos.filter((o) => o.status === 'pendente');
  }

  get atribuidos(): DeliveryOrder[] {
    return this.pedidos.filter((o) => o.status === 'atribuido' || o.status === 'coletado');
  }

  get emRota(): DeliveryOrder[] {
    return this.pedidos.filter((o) => o.status === 'em_rota');
  }

  get entregues(): DeliveryOrder[] {
    return this.pedidos.filter((o) => o.status === 'entregue');
  }

  imprimirGuia(pedido: DeliveryOrder) {
    this.imprimir.emit(pedido);
    if (this.aoImprimir) this.aoImprimir(pedido);
  }

  solicitarTransbordo(pedidoId: string) {
    this.pedirTransbordo.emit(pedidoId);
    if (this.aoPedirTransbordo) this.aoPedirTransbordo(pedidoId);
  }
}

export { QuadroPedidosComponent as QuadroPedidos };

