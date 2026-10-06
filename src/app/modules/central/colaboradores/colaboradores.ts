import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PapelUsuario = 'motoboy' | 'atendente' | 'gerente' | 'admin';

export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  papel: PapelUsuario;
  ativo: boolean;
  criadoEm: string;
}

const COLABORADORES_KEY = 'junior_express_colaboradores_v1';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './colaboradores.html'
})
export class ColaboradoresComponent implements OnInit {
  lista: Colaborador[] = [];
  modalAberto: boolean = false;
  colaboradorEdicao: Colaborador | null = null;

  // Form
  nome: string = '';
  email: string = '';
  telefone: string = '';
  papel: PapelUsuario = 'motoboy';

  ngOnInit() {
    this.carregar();
  }

  iniciar() {
    this.carregar();
  }

  carregar() {
    try {
      const data = localStorage.getItem(COLABORADORES_KEY);
      if (!data) {
        const iniciais: Colaborador[] = [
          {
            id: 'usr_admin',
            nome: 'Administrador Central',
            email: 'admin@juniorexpress.com.br',
            telefone: '(48) 3045-4829',
            papel: 'admin',
            ativo: true,
            criadoEm: '2026-01-01T00:00:00Z',
          },
          {
            id: 'usr_gerente',
            nome: 'Gerente Operacional',
            email: 'gerencia@juniorexpress.com.br',
            telefone: '(48) 99101-8000',
            papel: 'gerente',
            ativo: true,
            criadoEm: '2026-01-10T00:00:00Z',
          },
          {
            id: 'usr_atendente',
            nome: 'Atendente de Despacho',
            email: 'atendimento@juniorexpress.com.br',
            telefone: '(48) 3045-4829',
            papel: 'atendente',
            ativo: true,
            criadoEm: '2026-02-01T00:00:00Z',
          },
          {
            id: 'usr_mb_carlos',
            nome: 'Carlos Eduardo Souza',
            email: 'carlos.motoboy@juniorexpress.com.br',
            telefone: '(48) 99821-4412',
            papel: 'motoboy',
            ativo: true,
            criadoEm: '2026-02-15T00:00:00Z',
          },
        ];
        localStorage.setItem(COLABORADORES_KEY, JSON.stringify(iniciais));
        this.lista = iniciais;
      } else {
        this.lista = JSON.parse(data);
      }
    } catch {
      this.lista = [];
    }
  }

  salvarLista() {
    localStorage.setItem(COLABORADORES_KEY, JSON.stringify(this.lista));
  }

  abrirModalNovo() {
    this.colaboradorEdicao = null;
    this.nome = '';
    this.email = '';
    this.telefone = '(48) ';
    this.papel = 'motoboy';
    this.modalAberto = true;
  }

  abrirModalEditar(colab: Colaborador) {
    this.colaboradorEdicao = colab;
    this.nome = colab.nome;
    this.email = colab.email;
    this.telefone = colab.telefone;
    this.papel = colab.papel;
    this.modalAberto = true;
  }

  salvarColaborador() {
    if (!this.nome.trim() || !this.email.trim()) return;

    if (this.colaboradorEdicao) {
      const idx = this.lista.findIndex((u) => u.id === this.colaboradorEdicao!.id);
      if (idx !== -1) {
        this.lista[idx] = {
          ...this.lista[idx],
          nome: this.nome.trim(),
          email: this.email.trim(),
          telefone: this.telefone.trim(),
          papel: this.papel,
        };
      }
    } else {
      const novo: Colaborador = {
        id: `usr_${Date.now()}`,
        nome: this.nome.trim(),
        email: this.email.trim(),
        telefone: this.telefone.trim(),
        papel: this.papel,
        ativo: true,
        criadoEm: new Date().toISOString(),
      };
      this.lista.unshift(novo);
    }

    this.salvarLista();
    this.modalAberto = false;
  }

  excluirColaborador(id: string, nome: string) {
    if (confirm(`Remover colaborador ${nome}?`)) {
      this.lista = this.lista.filter((u) => u.id !== id);
      this.salvarLista();
    }
  }
}

export { ColaboradoresComponent as Colaboradores };

