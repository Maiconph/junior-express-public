import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransshipmentRequest, DeliveryOrder, Motoboy } from '../../../types';
import { storage } from '../../../shared/services/storage';

@Component({
  selector: 'app-transbordo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transbordo.html'
})
export class TransbordoComponent implements OnInit {
  @Input() requisicao: TransshipmentRequest | null = null;
  @Input() pedido: DeliveryOrder | null = null;
  @Input() origem: Motoboy | null = null;
  @Input() destino: Motoboy | null = null;

  @Output() aprovarTransbordo = new EventEmitter<string>();
  @Output() rejeitarTransbordo = new EventEmitter<string>();
  @Output() fechar = new EventEmitter<void>();

  aoAprovar?: (id: string) => void;
  aoRejeitar?: (id: string) => void;
  aoFechar?: () => void;

  ngOnInit() {
    if (this.requisicao && !this.pedido) {
      const orders = storage.getOrders();
      this.pedido = orders.find(o => o.id === this.requisicao!.pedidoId) || null;
    }
    if (this.requisicao && !this.origem) {
      const motoboys = storage.getMotoboys();
      this.origem = motoboys.find(m => m.id === this.requisicao!.motoboyOrigemId) || null;
    }
    if (this.requisicao && !this.destino) {
      const motoboys = storage.getMotoboys();
      this.destino = motoboys.find(m => m.id === this.requisicao!.motoboyDestinoId) || null;
    }
  }

  iniciar(
    req: TransshipmentRequest,
    ord: DeliveryOrder,
    orig: Motoboy | null,
    dest: Motoboy | null,
    aprovarCb?: (id: string) => void,
    rejeitarCb?: (id: string) => void,
    fecharCb?: () => void
  ) {
    this.requisicao = req;
    this.pedido = ord;
    this.origem = orig;
    this.destino = dest;
    this.aoAprovar = aprovarCb;
    this.aoRejeitar = rejeitarCb;
    this.aoFechar = fecharCb;
  }

  aprovar() {
    if (this.requisicao) {
      this.aprovarTransbordo.emit(this.requisicao.id);
      if (this.aoAprovar) {
        this.aoAprovar(this.requisicao.id);
      }
    }
  }

  rejeitar() {
    if (this.requisicao) {
      this.rejeitarTransbordo.emit(this.requisicao.id);
      if (this.aoRejeitar) {
        this.aoRejeitar(this.requisicao.id);
      }
    }
  }

  fecharModal() {
    this.fechar.emit();
    if (this.aoFechar) this.aoFechar();
  }
}

export { TransbordoComponent as Transbordo };

