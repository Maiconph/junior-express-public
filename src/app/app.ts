import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralComponent } from './modules/central/central';
import { PwaComponent } from './modules/pwa/pwa';
import { ExternoComponent } from './modules/externo/externo';
import { SiteComponent } from './modules/site/site';
import { LoginComponent } from './modules/login/login';
import { FirestoreDeliveryService } from './core/services/firestore-delivery.service';
import { Usuario } from './core/models/delivery.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CentralComponent,
    PwaComponent,
    ExternoComponent,
    SiteComponent,
    LoginComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  moduloAtual: 'central' | 'pwa' | 'externo' | 'site' = 'central';
  currentUser: Usuario | null = null;

  constructor(public firestoreService: FirestoreDeliveryService) {}

  ngOnInit(): void {
    this.firestoreService.currentUser$.subscribe((u) => {
      this.currentUser = u;
      if (u) {
        if (u.funcao === 'motoboy') {
          this.moduloAtual = 'pwa';
        } else {
          this.moduloAtual = 'central';
        }
      }
    });
  }

  logout(): void {
    this.firestoreService.logout();
  }
}
