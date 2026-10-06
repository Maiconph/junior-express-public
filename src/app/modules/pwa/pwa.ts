import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreDeliveryService } from '../../core/services/firestore-delivery.service';
import { DeliveryOrder, Motoboy } from '../../core/models/delivery.model';

@Component({
  selector: 'app-pwa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pwa.html'
})
export class PwaComponent implements OnInit {
  currentTab: 'bau' | 'scanner' | 'rota' = 'bau';
  motoboy: Motoboy = {
    id: 'mb_01',
    nome: 'Carlos Eduardo Souza',
    login: 'carlos',
    funcao: 'motoboy',
    telefone: '(48) 99821-4412',
    placaMoto: 'MKE-3F40',
    modeloMoto: 'Honda CG 160 Fan',
    status: 'em_rota',
    coordenadasAtuais: { lat: -28.6782, lng: -49.3698, bairro: 'Centro', cidade: 'Criciúma' },
    ultimaAtualizacao: 'Agora',
    entregasConcluidasHoje: 12,
    dinheiroEmMaos: 75.0,
    pedidosNoBauIds: ['JE-2026-0102']
  };

  orders: DeliveryOrder[] = [];
  qrCodeInput = '';

  constructor(private firestoreService: FirestoreDeliveryService) {}

  ngOnInit(): void {
    this.firestoreService.currentUser$.subscribe(user => {
      if (user && user.funcao === 'motoboy') {
        this.motoboy = user;
      }
    });

    this.firestoreService.orders$.subscribe(orders => {
      this.orders = orders.filter(o => this.motoboy.pedidosNoBauIds?.includes(o.id));
    });
  }

  processarLeitura(): void {
    if (!this.qrCodeInput.trim()) return;

    if (this.qrCodeInput.startsWith('JE_ASSIGN:')) {
      const orderId = this.qrCodeInput.replace('JE_ASSIGN:', '').trim();
      this.firestoreService.assignToMotoboy(orderId, this.motoboy);
      alert(`Pacote #${orderId} atribuído ao seu baú com sucesso!`);
      this.currentTab = 'bau';
    } else {
      alert(`Código lido: ${this.qrCodeInput}`);
    }
    this.qrCodeInput = '';
  }

  pedirSocorro(): void {
    alert('Alerta de socorro mecânico enviado à Central Junior Express!');
  }
}
