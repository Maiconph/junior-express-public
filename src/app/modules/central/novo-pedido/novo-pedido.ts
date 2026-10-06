import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryOrder, PaymentMethod, ClientCompany, ClientBillingType } from '../../../types';
import { CRICIUMA_ZONES } from '../../../shared/services/criciumaData';
import { storage } from '../../../shared/services/storage';

@Component({
  selector: 'app-novo-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-pedido.html'
})
export class NovoPedidoComponent implements OnInit, OnChanges {
  @Input() clientePreSelecionado: ClientCompany | null = null;
  @Output() pedidoCriado = new EventEmitter<DeliveryOrder>();

  clientes: ClientCompany[] = [];
  clienteSelecionado: ClientCompany | null = null;
  clientesFiltrados: ClientCompany[] = [];

  // Dados do Contratante
  clienteNome: string = '';
  clienteCnpjCpf: string = '';
  clienteTelefone: string = '(48) 9';
  clienteEndereco: string = '';
  descricaoCarga: string = '';

  // Dropdown e Modais
  abrirSugestoes: boolean = false;
  modalCadastroRapidoAberto: boolean = false;

  // Cadastro Rápido de Cliente
  novoNome: string = '';
  novoCnpjCpf: string = '';
  novoTelefone: string = '(48) ';
  novoEndereco: string = '';
  novoBairro: string = 'Centro';
  novoCidade: string = 'Criciúma';
  novoTipoFaturamento: ClientBillingType = 'mensalista';

  // Coleta (Origem)
  origemTipo: 'cliente' | 'base' | 'outro' = 'cliente';
  coletaEmpresa: string = '';
  coletaEndereco: string = '';
  coletaBairro: string = 'Centro';
  coletaCidade: string = 'Criciúma';
  coletaTelefone: string = '';

  // Entrega (Destino)
  destinatario: string = '';
  entregaEndereco: string = '';
  entregaBairro: string = 'Próspera';
  entregaCidade: string = 'Criciúma';
  entregaReferencia: string = '';
  entregaTelefone: string = '(48) 9';

  // Faturamento e Preço
  valorCustomizado: number = 22.0;
  formaPagamento: PaymentMethod = 'mensalista_faturado';
  tabelaRegioes = CRICIUMA_ZONES;

  aoCriarPedido?: (pedido: DeliveryOrder) => void;

  ngOnInit() {
    this.carregarClientes();
    if (this.clientePreSelecionado) {
      this.selecionarCliente(this.clientePreSelecionado);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clientePreSelecionado'] && this.clientePreSelecionado) {
      this.selecionarCliente(this.clientePreSelecionado);
    }
  }

  iniciar(callbackCriacao?: (pedido: DeliveryOrder) => void) {
    this.aoCriarPedido = callbackCriacao;
    this.carregarClientes();
  }

  carregarClientes() {
    this.clientes = storage.getClients();
  }

  aoDigitarClienteInput(event: Event) {
    const val = (event.target as HTMLInputElement)?.value || '';
    this.aoDigitarCliente(val);
  }

  alterarBairroEntregaSelect(event: Event) {
    const val = (event.target as HTMLSelectElement)?.value || '';
    this.alterarBairroEntrega(val);
  }

  aoDigitarCliente(busca: string) {
    this.clienteNome = busca;
    if (this.clienteSelecionado && this.clienteSelecionado.nome !== busca) {
      this.clienteSelecionado = null;
    }
    const q = busca.toLowerCase().trim();
    if (!q) {
      this.clientesFiltrados = [];
      this.abrirSugestoes = false;
      return;
    }
    this.clientesFiltrados = this.clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.cnpjCpf.toLowerCase().includes(q) ||
        c.endereco.toLowerCase().includes(q)
    );
    this.abrirSugestoes = this.clientesFiltrados.length > 0;
  }

  selecionarCliente(cliente: ClientCompany) {
    this.clienteSelecionado = cliente;
    this.clienteNome = cliente.nome;
    this.clienteCnpjCpf = cliente.cnpjCpf;
    this.clienteTelefone = cliente.telefone;
    this.clienteEndereco = `${cliente.endereco}, ${cliente.bairro}, ${cliente.cidade}`;

    // Preenche coleta automaticamente
    this.coletaEmpresa = cliente.nome;
    this.coletaEndereco = cliente.endereco;
    this.coletaBairro = cliente.bairro;
    this.coletaCidade = cliente.cidade;
    this.coletaTelefone = cliente.telefone;
    this.origemTipo = 'cliente';

    // Define faturamento da empresa
    if (cliente.tipoFaturamento === 'mensalista') {
      this.formaPagamento = 'mensalista_faturado';
    } else if (cliente.tipoFaturamento === 'quinzenal') {
      this.formaPagamento = 'quinzenal_faturado';
    } else if (cliente.tipoFaturamento === 'semanal') {
      this.formaPagamento = 'semanal_faturado';
    } else {
      this.formaPagamento = 'dinheiro_destino';
    }

    this.abrirSugestoes = false;
  }

  limparClienteSelecionado() {
    this.clienteSelecionado = null;
    this.clienteNome = '';
    this.clienteCnpjCpf = '';
    this.clienteTelefone = '(48) 9';
    this.clienteEndereco = '';
    this.coletaEmpresa = '';
    this.coletaEndereco = '';
  }

  alterarTipoOrigem(tipo: 'cliente' | 'base' | 'outro') {
    this.origemTipo = tipo;
    if (tipo === 'cliente' && this.clienteSelecionado) {
      this.coletaEmpresa = this.clienteSelecionado.nome;
      this.coletaEndereco = this.clienteSelecionado.endereco;
      this.coletaBairro = this.clienteSelecionado.bairro;
      this.coletaCidade = this.clienteSelecionado.cidade;
      this.coletaTelefone = this.clienteSelecionado.telefone;
    } else if (tipo === 'base') {
      this.coletaEmpresa = 'Base Junior Express';
      this.coletaEndereco = 'Rua Jorge Fridberg, 288';
      this.coletaBairro = 'Mina Brasil';
      this.coletaCidade = 'Criciúma';
      this.coletaTelefone = '(48) 3045-4829';
    } else {
      this.coletaEmpresa = '';
      this.coletaEndereco = '';
    }
  }

  alterarBairroEntrega(bairro: string) {
    this.entregaBairro = bairro;
    for (const zona of this.tabelaRegioes) {
      if (zona.bairros.includes(bairro)) {
        this.valorCustomizado = zona.valorBase;
        this.entregaCidade = zona.cidade;
        break;
      }
    }
  }

  salvarCadastroRapido(): boolean {
    if (!this.novoNome.trim() || !this.novoCnpjCpf.trim() || !this.novoEndereco.trim()) {
      return false;
    }
    const novoCliente: ClientCompany = {
      id: `cli_${Date.now()}`,
      nome: this.novoNome.trim(),
      cnpjCpf: this.novoCnpjCpf.trim(),
      telefone: this.novoTelefone.trim(),
      endereco: this.novoEndereco.trim(),
      bairro: this.novoBairro.trim(),
      cidade: this.novoCidade.trim(),
      tipoCobranca: this.novoTipoFaturamento,
      tipoFaturamento: this.novoTipoFaturamento,
      criadoEm: new Date().toISOString(),
    };
    storage.addClient(novoCliente);
    this.carregarClientes();
    this.selecionarCliente(novoCliente);
    this.modalCadastroRapidoAberto = false;
    this.novoNome = '';
    this.novoCnpjCpf = '';
    this.novoEndereco = '';
    return true;
  }

  emitirOrdemServico(): DeliveryOrder | null {
    if (!this.clienteNome || !this.descricaoCarga || !this.entregaEndereco) {
      return null;
    }
    const numeroAleatorio = Math.floor(100 + Math.random() * 900);
    const idPedido = `JE-2026-0${numeroAleatorio}`;
    const dataHora = new Date().toISOString();

    const novoPedido: DeliveryOrder = {
      id: idPedido,
      createdAt: dataHora,
      updatedAt: dataHora,
      clienteNome: this.clienteNome,
      clienteCnpjCpf: this.clienteCnpjCpf || this.clienteSelecionado?.cnpjCpf,
      clienteTelefone: this.clienteTelefone,
      clienteEndereco: this.clienteEndereco || this.clienteSelecionado?.endereco,
      descricaoCarga: this.descricaoCarga,
      coleta: {
        empresa: this.coletaEmpresa || this.clienteNome,
        responsavel: 'Expedição / Balcão',
        telefone: this.coletaTelefone || this.clienteTelefone,
        endereco: this.coletaEndereco || 'Rua Jorge Fridberg, 288 (Base Junior Express)',
        bairro: this.coletaBairro,
        cidade: this.coletaCidade,
        coordenadas: { lat: -28.6854, lng: -49.3812 },
        qrCodeToken: `COL_${idPedido}_${Math.floor(100 + Math.random() * 900)}`,
        pinReserva: Math.floor(1000 + Math.random() * 9000).toString(),
      },
      entrega: {
        destinatario: this.destinatario,
        telefone: this.entregaTelefone,
        endereco: this.entregaEndereco,
        bairro: this.entregaBairro,
        cidade: this.entregaCidade,
        referencia: this.entregaReferencia,
        coordenadas: { lat: -28.6651, lng: -49.3524 },
        qrCodeToken: `REC_${idPedido}_${Math.floor(100 + Math.random() * 900)}`,
        pinReserva: Math.floor(1000 + Math.random() * 9000).toString(),
      },
      valorTotal: this.valorCustomizado,
      formaPagamento: this.formaPagamento,
      recebidoNaRua: false,
      status: 'pendente',
    };

    this.pedidoCriado.emit(novoPedido);
    if (this.aoCriarPedido) {
      this.aoCriarPedido(novoPedido);
    }

    this.descricaoCarga = '';
    this.destinatario = '';
    this.entregaEndereco = '';
    this.entregaReferencia = '';
    return novoPedido;
  }
}

export { NovoPedidoComponent as NovoPedido };

