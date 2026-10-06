import { DeliveryOrder, Motoboy, TransshipmentRequest, ClientCompany } from '../../types';

const ORDERS_KEY = 'junior_express_orders_v1';
const MOTOBOYS_KEY = 'junior_express_motoboys_v1';
const TRANSSHIP_KEY = 'junior_express_transshipments_v1';
const CLIENTS_KEY = 'junior_express_clients_v1';

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.seedIfEmpty();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private seedIfEmpty() {
    if (!localStorage.getItem(MOTOBOYS_KEY)) {
      const initialMotoboys: Motoboy[] = [
        {
          id: 'mb_carlos',
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
          pedidosNoBauIds: ['JE-2026-0102'],
        },
        {
          id: 'mb_lucas',
          nome: 'Lucas Silveira',
          login: 'lucas',
          funcao: 'motoboy',
          telefone: '(48) 99122-3344',
          placaMoto: 'RLA-2A19',
          modeloMoto: 'Yamaha Fazer 250',
          status: 'disponivel',
          coordenadasAtuais: { lat: -28.6835, lng: -49.381, bairro: 'Mina Brasil', cidade: 'Criciúma' },
          ultimaAtualizacao: 'Agora',
          entregasConcluidasHoje: 9,
          dinheiroEmMaos: 120.0,
          pedidosNoBauIds: [],
        },
        {
          id: 'mb_matheus',
          nome: 'Matheus Fontanella',
          login: 'matheus',
          funcao: 'motoboy',
          telefone: '(48) 99655-7890',
          placaMoto: 'MKZ-8890',
          modeloMoto: 'Honda Bros 160',
          status: 'em_rota',
          coordenadasAtuais: { lat: -28.692, lng: -49.361, bairro: 'Próspera', cidade: 'Criciúma' },
          ultimaAtualizacao: 'Agora',
          entregasConcluidasHoje: 15,
          dinheiroEmMaos: 40.0,
          pedidosNoBauIds: ['JE-2026-0103'],
        },
      ];
      localStorage.setItem(MOTOBOYS_KEY, JSON.stringify(initialMotoboys));
    }

    if (!localStorage.getItem(CLIENTS_KEY)) {
      const initialClients: ClientCompany[] = [
        {
          id: 'cli_01',
          nome: 'Laboratório Búrigo - Matriz',
          cnpjCpf: '83.245.912/0001-44',
          telefone: '(48) 3437-3300',
          email: 'logistica@laboratorioburigo.com.br',
          responsavel: 'Fernanda Rocha',
          endereco: 'Rua Cel. Pedro Benedet, 330',
          bairro: 'Centro',
          cidade: 'Criciúma',
          tipoFaturamento: 'mensalista',
          tipoCobranca: 'mensalista',
          ativo: true,
          criadoEm: '2026-01-10T08:00:00Z',
        },
        {
          id: 'cli_02',
          nome: 'Auto Peças Centenário',
          cnpjCpf: '01.992.411/0001-88',
          telefone: '(48) 3433-2211',
          responsavel: 'Marcos Aurélio',
          endereco: 'Av. Centenário, 4120',
          bairro: 'Pinheirinho',
          cidade: 'Criciúma',
          tipoFaturamento: 'quinzenal',
          tipoCobranca: 'quinzenal',
          ativo: true,
          criadoEm: '2026-01-15T09:30:00Z',
        },
      ];
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(initialClients));
    }

    if (!localStorage.getItem(ORDERS_KEY)) {
      const initialOrders: DeliveryOrder[] = [
        {
          id: 'JE-2026-0102',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          clienteNome: 'Laboratório Búrigo - Matriz',
          clienteTelefone: '(48) 3437-3300',
          descricaoCarga: 'Amostras biológicas refrigeradas',
          coleta: {
            empresa: 'Laboratório Búrigo',
            responsavel: 'Fernanda',
            telefone: '(48) 3437-3300',
            endereco: 'Rua Cel. Pedro Benedet, 330',
            bairro: 'Centro',
            cidade: 'Criciúma',
            coordenadas: { lat: -28.6782, lng: -49.3698 },
            qrCodeToken: 'COL_JE20260102_110',
            pinReserva: '1244',
          },
          entrega: {
            destinatario: 'Hospital São José',
            telefone: '(48) 3431-1500',
            endereco: 'Rua Cel. Pedro Benedet, 630',
            bairro: 'Centro',
            cidade: 'Criciúma',
            coordenadas: { lat: -28.6795, lng: -49.3712 },
            qrCodeToken: 'REC_JE20260102_992',
            pinReserva: '8821',
          },
          valorTotal: 18.0,
          formaPagamento: 'mensalista_faturado',
          recebidoNaRua: false,
          motoboyId: 'mb_carlos',
          motoboyNome: 'Carlos Eduardo Souza',
          status: 'em_rota',
        },
      ];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
    }
  }

  // --- Pedidos ---
  getOrders(): DeliveryOrder[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addOrder(order: DeliveryOrder) {
    const list = this.getOrders();
    list.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    this.notify();
  }

  // --- Motoboys ---
  getMotoboys(): Motoboy[] {
    try {
      const data = localStorage.getItem(MOTOBOYS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // --- Transbordo ---
  getTransshipments(): TransshipmentRequest[] {
    try {
      const data = localStorage.getItem(TRANSSHIP_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  requestTransshipment(pedidoId: string, origemId: string, destinoId: string, motivo: string): TransshipmentRequest {
    const mbList = this.getMotoboys();
    const mbOrigem = mbList.find((m) => m.id === origemId);
    const mbDestino = mbList.find((m) => m.id === destinoId);

    const req: TransshipmentRequest = {
      id: `TR-${Date.now()}`,
      pedidoId,
      motoboyOrigemId: origemId,
      motoboyOrigemNome: mbOrigem?.nome || 'Origem',
      motoboyDestinoId: destinoId,
      motoboyDestinoNome: mbDestino?.nome || 'Destino',
      solicitadoEm: new Date().toISOString(),
      status: 'pendente',
      senhaAutorizacao: Math.floor(1000 + Math.random() * 9000).toString(),
      motivo,
    };

    const list = this.getTransshipments();
    list.unshift(req);
    localStorage.setItem(TRANSSHIP_KEY, JSON.stringify(list));
    this.notify();
    return req;
  }

  approveTransshipment(requisicaoId: string, autorizadoPor: string) {
    const list = this.getTransshipments();
    const idx = list.findIndex((r) => r.id === requisicaoId);
    if (idx !== -1) {
      list[idx].status = 'aprovado';
      localStorage.setItem(TRANSSHIP_KEY, JSON.stringify(list));
      this.notify();
    }
  }

  rejectTransshipment(requisicaoId: string, rejeitadoPor: string) {
    const list = this.getTransshipments();
    const idx = list.findIndex((r) => r.id === requisicaoId);
    if (idx !== -1) {
      list[idx].status = 'rejeitado';
      localStorage.setItem(TRANSSHIP_KEY, JSON.stringify(list));
      this.notify();
    }
  }

  // --- Clientes ---
  getClients(): ClientCompany[] {
    try {
      const data = localStorage.getItem(CLIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addClient(cliente: ClientCompany) {
    const list = this.getClients();
    list.unshift(cliente);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
    this.notify();
  }

  updateClient(id: string, dados: Partial<ClientCompany>) {
    const list = this.getClients();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...dados };
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
      this.notify();
    }
  }

  deleteClient(id: string) {
    let list = this.getClients();
    list = list.filter((c) => c.id !== id);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
    this.notify();
  }
}

export const storage = new StorageService();
