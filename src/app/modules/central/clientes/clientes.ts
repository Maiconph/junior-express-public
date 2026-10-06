import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientCompany, ClientBillingType } from '../../../types';
import { storage } from '../../../shared/services/storage';
import { CRICIUMA_ZONES } from '../../../shared/services/criciumaData';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html'
})
export class ClientesComponent implements OnInit {

  clientes: ClientCompany[] = [];
  termoBusca: string = '';
  filtroFaturamento: string = 'todos';

  // Modal
  modalAberto: boolean = false;
  clienteEdicao: ClientCompany | null = null;

  // Formulário
  nome: string = '';
  cnpjCpf: string = '';
  telefone: string = '';
  email: string = '';
  responsavel: string = '';
  endereco: string = '';
  bairro: string = 'Centro';
  cidade: string = 'Criciúma';
  complemento: string = '';
  referencia: string = '';
  tipoFaturamento: ClientBillingType = 'mensalista';
  observacoes: string = '';

  tabelaRegioes = CRICIUMA_ZONES;

  @Output() novoPedido = new EventEmitter<ClientCompany>();
  aoIniciarPedido?: (cliente: ClientCompany) => void;

  ngOnInit() {
    this.carregarClientes();
  }

  iniciar(callbackIniciarPedido?: (cliente: ClientCompany) => void) {
    this.aoIniciarPedido = callbackIniciarPedido;
    this.carregarClientes();
  }

  carregarClientes() {
    this.clientes = storage.getClients();
  }

  get estatisticas() {
    return {
      total: this.clientes.length,
      mensalistas: this.clientes.filter((c) => c.tipoFaturamento === 'mensalista').length,
      quinzenais: this.clientes.filter((c) => c.tipoFaturamento === 'quinzenal').length,
      semanais: this.clientes.filter((c) => c.tipoFaturamento === 'semanal').length,
      avulsos: this.clientes.filter((c) => c.tipoFaturamento === 'avulso').length,
    };
  }

  get clientesFiltrados(): ClientCompany[] {
    const q = this.termoBusca.toLowerCase().trim();
    return this.clientes.filter((cliente) => {
      const correspondeBusca =
        !q ||
        cliente.nome.toLowerCase().includes(q) ||
        cliente.cnpjCpf.toLowerCase().includes(q) ||
        cliente.endereco.toLowerCase().includes(q) ||
        cliente.bairro.toLowerCase().includes(q) ||
        cliente.telefone.toLowerCase().includes(q);

      const correspondeFaturamento =
        this.filtroFaturamento === 'todos' || cliente.tipoFaturamento === this.filtroFaturamento;

      return correspondeBusca && correspondeFaturamento;
    });
  }

  abrirModalNovo() {
    this.clienteEdicao = null;
    this.nome = '';
    this.cnpjCpf = '';
    this.telefone = '(48) ';
    this.email = '';
    this.responsavel = '';
    this.endereco = '';
    this.bairro = 'Centro';
    this.cidade = 'Criciúma';
    this.complemento = '';
    this.referencia = '';
    this.tipoFaturamento = 'mensalista';
    this.observacoes = '';
    this.modalAberto = true;
  }

  abrirModalEditar(cliente: ClientCompany) {
    this.clienteEdicao = cliente;
    this.nome = cliente.nome;
    this.cnpjCpf = cliente.cnpjCpf;
    this.telefone = cliente.telefone;
    this.email = cliente.email || '';
    this.responsavel = cliente.responsavel || '';
    this.endereco = cliente.endereco;
    this.bairro = cliente.bairro;
    this.cidade = cliente.cidade;
    this.complemento = cliente.complemento || '';
    this.referencia = cliente.referencia || '';
    this.tipoFaturamento = cliente.tipoFaturamento;
    this.observacoes = cliente.observacoes || '';
    this.modalAberto = true;
  }

  salvarCliente(): boolean {
    if (!this.nome.trim() || !this.cnpjCpf.trim() || !this.endereco.trim()) {
      return false;
    }

    if (this.clienteEdicao?.id) {
      storage.updateClient(this.clienteEdicao.id, {
        nome: this.nome.trim(),
        cnpjCpf: this.cnpjCpf.trim(),
        telefone: this.telefone.trim(),
        email: this.email.trim() || undefined,
        responsavel: this.responsavel.trim() || undefined,
        endereco: this.endereco.trim(),
        bairro: this.bairro.trim(),
        cidade: this.cidade.trim(),
        complemento: this.complemento.trim() || undefined,
        referencia: this.referencia.trim() || undefined,
        tipoCobranca: this.tipoFaturamento,
        tipoFaturamento: this.tipoFaturamento,
        observacoes: this.observacoes.trim() || undefined,
      });
    } else {
      const novo: ClientCompany = {
        id: `cli_${Date.now()}`,
        nome: this.nome.trim(),
        cnpjCpf: this.cnpjCpf.trim(),
        telefone: this.telefone.trim(),
        email: this.email.trim() || undefined,
        responsavel: this.responsavel.trim() || undefined,
        endereco: this.endereco.trim(),
        bairro: this.bairro.trim(),
        cidade: this.cidade.trim(),
        complemento: this.complemento.trim() || undefined,
        referencia: this.referencia.trim() || undefined,
        tipoCobranca: this.tipoFaturamento,
        tipoFaturamento: this.tipoFaturamento,
        observacoes: this.observacoes.trim() || undefined,
        criadoEm: new Date().toISOString(),
      };
      storage.addClient(novo);
    }

    this.carregarClientes();
    this.modalAberto = false;
    return true;
  }

  excluirCliente(id: string, nome: string) {
    if (confirm(`Excluir o cadastro de ${nome}?`)) {
      storage.deleteClient(id);
      this.carregarClientes();
    }
  }

  iniciarPedido(cliente: ClientCompany) {
    this.novoPedido.emit(cliente);
    if (this.aoIniciarPedido) {
      this.aoIniciarPedido(cliente);
    }
  }
}

export { ClientesComponent as Clientes };

