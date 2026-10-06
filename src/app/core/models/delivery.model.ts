export type DeliveryStatus =
  | 'pendente'
  | 'atribuido'
  | 'coletado'
  | 'em_rota'
  | 'entregue'
  | 'ocorrencia';

export type PaymentMethod =
  | 'mensalista_faturado'
  | 'quinzenal_faturado'
  | 'semanal_faturado'
  | 'dinheiro_destino'
  | 'pix_destino'
  | 'cartao_maquininha';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  label?: string;
  address?: string;
  bairro?: string;
  cidade?: string;
}

export interface DeliveryOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  clienteNome: string;
  clienteCnpjCpf?: string;
  clienteTelefone: string;
  clienteEndereco?: string;
  descricaoCarga: string;
  coleta: {
    empresa: string;
    responsavel: string;
    telefone: string;
    endereco: string;
    bairro: string;
    cidade: string;
    coordenadas: LocationCoordinates;
    qrCodeToken: string;
    pinReserva: string;
    coletadoEm?: string;
  };
  entrega: {
    destinatario: string;
    telefone: string;
    endereco: string;
    bairro: string;
    cidade: string;
    referencia?: string;
    coordenadas: LocationCoordinates;
    qrCodeToken: string;
    pinReserva: string;
    entregueEm?: string;
    recebidoPorNome?: string;
  };
  valorTotal: number;
  formaPagamento: PaymentMethod;
  recebidoNaRua: boolean;
  motoboyId?: string;
  motoboyNome?: string;
  status: DeliveryStatus;
  motivoOcorrencia?: string;
}

export type UserRole = 'admin' | 'gerente' | 'atendente' | 'motoboy';

export interface Usuario {
  id: string;
  nome: string;
  login: string;
  senha?: string;
  funcao: UserRole;
  telefone?: string;
  placaMoto?: string;
  modeloMoto?: string;
  status?: 'disponivel' | 'em_rota' | 'em_coleta' | 'socorro_solicitado' | 'pausa';
  coordenadasAtuais?: LocationCoordinates;
  ultimaAtualizacao?: string;
  entregasConcluidasHoje?: number;
  dinheiroEmMaos?: number;
  pedidosNoBauIds: string[];
}

export type Motoboy = Usuario;

export interface TransshipmentRequest {
  id: string;
  pedidoId: string;
  motoboyOrigemId: string;
  motoboyOrigemNome: string;
  motoboyDestinoId: string;
  motoboyDestinoNome: string;
  solicitadoEm: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'cancelado';
  senhaAutorizacao: string;
  motivo?: string;
}

export type BillingPeriod = 'mensalista' | 'quinzenal' | 'semanal' | 'avulso';

export interface ClienteEmpresa {
  id?: string;
  nome: string;
  cnpjCpf: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  referencia?: string;
  tipoCobranca: BillingPeriod;
  ativo?: boolean;
  criadoEm?: string;
}

