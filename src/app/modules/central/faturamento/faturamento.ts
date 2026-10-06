import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryOrder, Motoboy } from '../../../types';
import { storage } from '../../../shared/services/storage';

export interface ResumoFaturamentoCliente {
  clienteNome: string;
  totalCorridas: number;
  totalFaturado: number;
  entregues: number;
}

@Component({
  selector: 'app-faturamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faturamento.html'
})
export class FaturamentoComponent implements OnInit {
  @Input() pedidos: DeliveryOrder[] = [];
  @Input() motoboys: Motoboy[] = [];

  ngOnInit() {
    if (!this.pedidos || this.pedidos.length === 0) {
      this.pedidos = storage.getOrders();
    }
    if (!this.motoboys || this.motoboys.length === 0) {
      this.motoboys = storage.getMotoboys();
    }
  }

  iniciar(pedidos: DeliveryOrder[], motoboys: Motoboy[]) {
    this.pedidos = pedidos;
    this.motoboys = motoboys;
  }

  get totalFaturado(): number {
    return this.pedidos
      .filter((o) => o.formaPagamento === 'mensalista_faturado' || o.formaPagamento === 'quinzenal_faturado' || o.formaPagamento === 'semanal_faturado')
      .reduce((soma, o) => soma + o.valorTotal, 0);
  }

  get totalDinheiroRua(): number {
    return this.pedidos
      .filter((o) => (o.formaPagamento === 'dinheiro_destino' || o.formaPagamento === 'pix_destino') && o.status === 'entregue')
      .reduce((soma, o) => soma + o.valorTotal, 0);
  }

  get resumosPorCliente(): ResumoFaturamentoCliente[] {
    const mapa = new Map<string, ResumoFaturamentoCliente>();
    for (const pedido of this.pedidos) {
      if (!mapa.has(pedido.clienteNome)) {
        mapa.set(pedido.clienteNome, {
          clienteNome: pedido.clienteNome,
          totalCorridas: 0,
          totalFaturado: 0,
          entregues: 0,
        });
      }
      const item = mapa.get(pedido.clienteNome)!;
      item.totalCorridas += 1;
      item.totalFaturado += pedido.valorTotal;
      if (pedido.status === 'entregue') {
        item.entregues += 1;
      }
    }
    return Array.from(mapa.values()).sort((a, b) => b.totalFaturado - a.totalFaturado);
  }

  gerarTextoFatura(resumo: ResumoFaturamentoCliente): string {
    return `*FATURA DE CORRIDAS - JUNIOR EXPRESS*\nCliente: ${resumo.clienteNome}\nTotal de Entregas: ${resumo.totalCorridas}\nValor Total: R$ ${resumo.totalFaturado.toFixed(2)}\nChave PIX: financeiro@juniorexpress.com.br`;
  }
}

export { FaturamentoComponent as Faturamento };

