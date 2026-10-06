import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryOrder, Motoboy, TransshipmentRequest, ClientCompany } from '../../types';
import { storage } from '../../shared/services/storage';
import { soundAlerts } from '../../shared/services/soundAlerts';

import { RadarComponent } from './radar/radar';
import { NovoPedidoComponent } from './novo-pedido/novo-pedido';
import { QuadroPedidosComponent } from './quadro-pedidos/quadro-pedidos';
import { ClientesComponent } from './clientes/clientes';
import { ColaboradoresComponent } from './colaboradores/colaboradores';
import { FaturamentoComponent } from './faturamento/faturamento';
import { GuiaImpressaoComponent } from './guia-impressao/guia-impressao';
import { TransbordoComponent } from './transbordo/transbordo';

export type AbaCentral = 'radar' | 'novo-pedido' | 'quadro' | 'clientes' | 'colaboradores' | 'faturamento';

@Component({
  selector: 'app-central',
  standalone: true,
  imports: [
    CommonModule,
    RadarComponent,
    NovoPedidoComponent,
    QuadroPedidosComponent,
    ClientesComponent,
    ColaboradoresComponent,
    FaturamentoComponent,
    GuiaImpressaoComponent,
    TransbordoComponent
  ],
  templateUrl: './central.html'
})
export class CentralComponent implements OnInit, OnDestroy {
  abaAtiva: AbaCentral = 'radar';
  pedidos: DeliveryOrder[] = [];
  motoboys: Motoboy[] = [];
  transbordos: TransshipmentRequest[] = [];
  clienteSelecionadoParaDespacho: ClientCompany | null = null;

  pedidoImpressao: DeliveryOrder | null = null;
  transbordoAtivo: TransshipmentRequest | null = null;

  private unsubscribeStorage?: () => void;

  ngOnInit() {
    this.iniciar();
  }

  ngOnDestroy() {
    if (this.unsubscribeStorage) {
      this.unsubscribeStorage();
    }
  }

  iniciar() {
    this.carregarDados();
    this.unsubscribeStorage = storage.subscribe(() => {
      this.carregarDados();
    });
  }

  carregarDados() {
    this.pedidos = storage.getOrders();
    this.motoboys = storage.getMotoboys();
    this.transbordos = storage.getTransshipments();
  }

  definirAba(aba: AbaCentral) {
    this.abaAtiva = aba;
  }

  aoCriarPedido(pedido: DeliveryOrder) {
    storage.addOrder(pedido);
    this.pedidoImpressao = pedido;
    this.abaAtiva = 'quadro';
  }

  iniciarPedidoParaCliente(cliente: ClientCompany) {
    this.clienteSelecionadoParaDespacho = cliente;
    this.abaAtiva = 'novo-pedido';
  }

  abrirTransbordo(pedidoId: string) {
    const pedido = this.pedidos.find((o) => o.id === pedidoId);
    if (!pedido) return;
    const mbOrigem = this.motoboys.find((m) => m.id === pedido.motoboyId) || this.motoboys[0];
    const mbDestino = this.motoboys.find((m) => m.id !== mbOrigem?.id) || this.motoboys[1];

    if (!mbOrigem?.id || !mbDestino?.id) {
      return;
    }

    const novaReq = storage.requestTransshipment(pedido.id, mbOrigem.id, mbDestino.id, 'Socorro mecânico na rota.');
    this.transbordoAtivo = novaReq;
  }

  aprovarTransbordo(requisicaoId: string) {
    storage.approveTransshipment(requisicaoId, 'Central Junior Express');
    soundAlerts.playSuccessTone();
    this.transbordoAtivo = null;
  }

  rejeitarTransbordo(requisicaoId: string) {
    storage.rejectTransshipment(requisicaoId, 'Central Junior Express');
    this.transbordoAtivo = null;
  }
}

export { CentralComponent as Central };

