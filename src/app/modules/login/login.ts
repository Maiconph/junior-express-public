import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreDeliveryService } from '../../core/services/firestore-delivery.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginVal = '';
  senhaVal = '';
  errorMessage = '';
  carregando = false;

  constructor(private firestoreService: FirestoreDeliveryService) {}

  async entrar(): Promise<void> {
    if (!this.loginVal.trim() || !this.senhaVal.trim()) {
      this.errorMessage = 'Informe o usuário e a senha.';
      return;
    }

    this.carregando = true;
    this.errorMessage = '';

    const res = await this.firestoreService.login(this.loginVal, this.senhaVal);
    this.carregando = false;

    if (!res.success) {
      this.errorMessage = res.message;
    }
  }
}
