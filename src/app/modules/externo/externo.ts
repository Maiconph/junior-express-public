import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreDeliveryService } from '../../core/services/firestore-delivery.service';
import { DeliveryOrder } from '../../core/models/delivery.model';

@Component({
  selector: 'app-externo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './externo.html'
})
export class ExternoComponent implements OnInit {
  order: DeliveryOrder = {
    id: 'JE-2026-0104',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clienteNome: 'Óptica & Joalheria Criciúma',
    clienteTelefone: '(48) 3433-8811',
    descricaoCarga: 'Armação de óculos especial',
    coleta: {
      empresa: 'Óptica Matriz',
      responsavel: 'Recepção',
      telefone: '(48) 3433-8811',
      endereco: 'Praça Nereu Ramos, 88',
      bairro: 'Centro',
      cidade: 'Criciúma',
      coordenadas: { lat: -28.6780, lng: -49.3700 },
      qrCodeToken: 'COL_JE20260104_312',
      pinReserva: '7021'
    },
    entrega: {
      destinatario: 'Sérgio Ramos',
      telefone: '(48) 99933-2211',
      endereco: 'Rua Almirante Barroso, 150',
      bairro: 'Comerciário',
      cidade: 'Criciúma',
      coordenadas: { lat: -28.6845, lng: -49.3670 },
      qrCodeToken: 'REC_JE20260104_675',
      pinReserva: '4489'
    },
    valorTotal: 18.0,
    formaPagamento: 'pix_destino',
    recebidoNaRua: false,
    status: 'em_rota',
    motoboyNome: 'Lucas Silveira'
  };

  constructor(private firestoreService: FirestoreDeliveryService) {}

  ngOnInit(): void {
    this.firestoreService.orders$.subscribe(orders => {
      const found = orders.find(o => o.id === this.order.id);
      if (found) this.order = found;
    });
  }
}
