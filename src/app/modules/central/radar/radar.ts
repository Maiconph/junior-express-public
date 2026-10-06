import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Motoboy, DeliveryOrder } from '../../../types';
import { storage } from '../../../shared/services/storage';

@Component({
  selector: 'app-radar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar.html'
})
export class RadarComponent implements OnInit {
  @Input() motoboys: Motoboy[] = [];
  @Input() pedidos: DeliveryOrder[] = [];
  motoboySelecionado: Motoboy | null = null;
  termoBusca: string = '';

  @Output() selecionarPedido = new EventEmitter<DeliveryOrder>();
  @Output() pedirTransbordo = new EventEmitter<string>();

  aoSelecionarPedido?: (pedido: DeliveryOrder) => void;
  aoPedirTransbordo?: (pedidoId: string) => void;

  limites = {
    minLat: -28.71,
    maxLat: -28.65,
    minLng: -49.44,
    maxLng: -49.33,
  };

  ngOnInit() {
    if (!this.motoboys || this.motoboys.length === 0) {
      this.motoboys = storage.getMotoboys();
    }
    if (!this.pedidos || this.pedidos.length === 0) {
      this.pedidos = storage.getOrders();
    }
    this.motoboySelecionado = this.motoboys[0] || null;
  }

  iniciar(motoboys: Motoboy[], pedidos: DeliveryOrder[], selecionarCallback?: (o: DeliveryOrder) => void, transbordoCallback?: (id: string) => void) {
    this.motoboys = motoboys;
    this.pedidos = pedidos;
    this.motoboySelecionado = motoboys[0] || null;
    this.aoSelecionarPedido = selecionarCallback;
    this.aoPedirTransbordo = transbordoCallback;
  }

  converterParaCoordenadasMapa(lat?: number, lng?: number) {
    const defaultLat = -28.6782;
    const defaultLng = -49.3698;
    const actualLat = typeof lat === 'number' ? lat : defaultLat;
    const actualLng = typeof lng === 'number' ? lng : defaultLng;
    const x = ((actualLng - this.limites.minLng) / (this.limites.maxLng - this.limites.minLng)) * 100;
    const y = ((this.limites.maxLat - actualLat) / (this.limites.maxLat - this.limites.minLat)) * 100;
    return {
      x: Math.min(Math.max(x, 5), 95),
      y: Math.min(Math.max(y, 5), 95),
    };
  }

  selecionarMotoboy(mb: Motoboy) {
    this.motoboySelecionado = mb;
  }
}

export { RadarComponent as Radar };

