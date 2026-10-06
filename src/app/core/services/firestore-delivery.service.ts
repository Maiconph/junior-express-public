import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeliveryOrder, Motoboy, TransshipmentRequest, Usuario, UserRole, ClienteEmpresa } from '../models/delivery.model';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDeliveryService {
  private db!: Firestore;
  private app!: FirebaseApp;

  private ordersSubject = new BehaviorSubject<DeliveryOrder[]>([]);
  public orders$: Observable<DeliveryOrder[]> = this.ordersSubject.asObservable();

  private motoboysSubject = new BehaviorSubject<Motoboy[]>([]);
  public motoboys$: Observable<Motoboy[]> = this.motoboysSubject.asObservable();

  private transshipmentsSubject = new BehaviorSubject<TransshipmentRequest[]>([]);
  public transshipments$: Observable<TransshipmentRequest[]> = this.transshipmentsSubject.asObservable();

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  private clientesSubject = new BehaviorSubject<ClienteEmpresa[]>([]);
  public clientes$: Observable<ClienteEmpresa[]> = this.clientesSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$: Observable<Usuario | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreUserSession();
    this.initFirebase();
  }

  private restoreUserSession() {
    try {
      const saved = localStorage.getItem('junior_express_auth_user');
      if (saved) {
        this.currentUserSubject.next(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão:', e);
    }
  }

  private initFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyAigTzKiP-0dG8ZGJeTjrGHNney_REaoCM",
      authDomain: "junior-express-criciuma.firebaseapp.com",
      projectId: "junior-express-criciuma",
      storageBucket: "junior-express-criciuma.firebasestorage.app",
      messagingSenderId: "196732757614",
      appId: "1:196732757614:web:d626bba53fa11b1cc3a87f"
    };

    try {
      this.app = initializeApp(firebaseConfig);
      this.db = getFirestore(this.app);
      this.listenToCollections();
    } catch (err) {
      console.warn('Erro ao inicializar Firebase:', err);
    }
  }

  private listenToCollections() {
    // 1. Ouvir Pedidos em Tempo Real
    const ordersCol = collection(this.db, 'pedidos');
    onSnapshot(ordersCol, (snapshot) => {
      const orders: DeliveryOrder[] = [];
      snapshot.forEach((d) => orders.push(d.data() as DeliveryOrder));
      this.ordersSubject.next(orders);
    });

    // 2. Ouvir Usuários e Colaboradores em Tempo Real
    const usuariosCol = collection(this.db, 'usuarios');
    onSnapshot(usuariosCol, (snapshot) => {
      const users: Usuario[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Usuario;
        users.push({ ...data, id: d.id });
      });
      this.usuariosSubject.next(users);
      // Os motoboys são extraídos diretamente dos usuários com função 'motoboy'
      const motoboys = users.filter((u) => u.funcao === 'motoboy');
      this.motoboysSubject.next(motoboys);
    });

    // 3. Ouvir Transbordos em Tempo Real
    const transshipCol = collection(this.db, 'transbordos');
    onSnapshot(transshipCol, (snapshot) => {
      const requests: TransshipmentRequest[] = [];
      snapshot.forEach((d) => requests.push(d.data() as TransshipmentRequest));
      this.transshipmentsSubject.next(requests);
    });

    // 4. Ouvir Clientes e Empresas Parceiras em Tempo Real
    const clientesCol = collection(this.db, 'clientes');
    onSnapshot(clientesCol, (snapshot) => {
      const clients: ClienteEmpresa[] = [];
      snapshot.forEach((d) => {
        clients.push({ ...(d.data() as ClienteEmpresa), id: d.id });
      });
      this.clientesSubject.next(clients);
    });
  }

  // --- Operações de Pedidos ---
  async createOrder(order: DeliveryOrder): Promise<void> {
    const docRef = doc(this.db, 'pedidos', order.id);
    await setDoc(docRef, order);
  }

  async updateOrderStatus(orderId: string, status: DeliveryOrder['status'], extra?: Partial<DeliveryOrder>): Promise<void> {
    const docRef = doc(this.db, 'pedidos', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
      ...extra
    });
  }

  async assignToMotoboy(orderId: string, motoboy: Motoboy): Promise<void> {
    const orderRef = doc(this.db, 'pedidos', orderId);
    await updateDoc(orderRef, {
      motoboyId: motoboy.id,
      motoboyNome: motoboy.nome,
      status: 'atribuido',
      updatedAt: new Date().toISOString()
    });

    // Atualiza baú do motoboy no documento do usuário
    if (motoboy.id) {
      const mbRef = doc(this.db, 'usuarios', motoboy.id);
      const updatedBau = [...(motoboy.pedidosNoBauIds || []), orderId];
      await updateDoc(mbRef, {
        pedidosNoBauIds: updatedBau,
        status: 'em_rota'
      });
    }
  }

  // --- Transbordo e Socorro Mecânico ---
  async requestTransshipment(orderId: string, origem: Motoboy, destino: Motoboy): Promise<TransshipmentRequest> {
    const senha = Math.floor(1000 + Math.random() * 9000).toString();
    const req: TransshipmentRequest = {
      id: `TR-${Date.now()}`,
      pedidoId: orderId,
      motoboyOrigemId: origem.id || 'mb_origem',
      motoboyOrigemNome: origem.nome,
      motoboyDestinoId: destino.id || 'mb_destino',
      motoboyDestinoNome: destino.nome,
      solicitadoEm: new Date().toISOString(),
      status: 'pendente',
      senhaAutorizacao: senha,
      motivo: 'Pane mecânica / socorro na rua'
    };

    const docRef = doc(this.db, 'transbordos', req.id);
    await setDoc(docRef, req);

    // Marca pedido em ocorrência
    const orderRef = doc(this.db, 'pedidos', orderId);
    await updateDoc(orderRef, {
      status: 'ocorrencia',
      motivoOcorrencia: `Transbordo para ${destino.nome} aguardando central.`
    });

    return req;
  }

  async approveTransshipment(requestId: string): Promise<void> {
    const req = this.transshipmentsSubject.value.find(r => r.id === requestId);
    if (!req) return;

    // Atualiza status do transbordo
    const reqRef = doc(this.db, 'transbordos', requestId);
    await updateDoc(reqRef, { status: 'aprovado' });

    // Transfere o pedido no Firestore
    const orderRef = doc(this.db, 'pedidos', req.pedidoId);
    await updateDoc(orderRef, {
      motoboyId: req.motoboyDestinoId,
      motoboyNome: req.motoboyDestinoNome,
      status: 'em_rota',
      motivoOcorrencia: null
    });
  }

  // --- Autenticação e Gestão de Colaboradores ---
  async login(loginVal: string, senhaVal: string): Promise<{ success: boolean; message: string; user?: Usuario }> {
    try {
      const q = query(
        collection(this.db, 'usuarios'),
        where('login', '==', loginVal.trim().toLowerCase()),
        where('senha', '==', senhaVal.trim())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docUser = querySnapshot.docs[0];
        const userData = { ...(docUser.data() as Usuario), id: docUser.id };
        this.currentUserSubject.next(userData);
        localStorage.setItem('junior_express_auth_user', JSON.stringify(userData));
        return { success: true, message: 'Login realizado com sucesso', user: userData };
      } else {
        return { success: false, message: 'Usuário ou senha incorretos' };
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      return { success: false, message: 'Erro ao autenticar: ' + err.message };
    }
  }

  logout(): void {
    localStorage.removeItem('junior_express_auth_user');
    this.currentUserSubject.next(null);
  }

  async cadastrarColaborador(usuario: Usuario): Promise<void> {
    const colRef = collection(this.db, 'usuarios');
    const newDoc = doc(colRef);
    const dataToSave: any = {
      nome: usuario.nome,
      login: usuario.login.trim().toLowerCase(),
      senha: usuario.senha,
      funcao: usuario.funcao,
      telefone: usuario.telefone || ''
    };

    if (usuario.funcao === 'motoboy') {
      dataToSave.placaMoto = usuario.placaMoto || '';
      dataToSave.modeloMoto = usuario.modeloMoto || '';
      dataToSave.status = 'disponivel';
      dataToSave.entregasConcluidasHoje = 0;
      dataToSave.dinheiroEmMaos = 0;
      dataToSave.pedidosNoBauIds = [];
      dataToSave.coordenadasAtuais = {
        lat: -28.6782,
        lng: -49.3698,
        bairro: 'Centro',
        cidade: 'Criciúma',
        label: 'Centro'
      };
      dataToSave.ultimaAtualizacao = 'Agora';
    }

    await setDoc(newDoc, dataToSave);
  }

  async excluirColaborador(id: string): Promise<void> {
    const docRef = doc(this.db, 'usuarios', id);
    await deleteDoc(docRef);
  }

  // --- Gestão de Clientes e Empresas Parceiras ---
  async cadastrarCliente(cliente: ClienteEmpresa): Promise<void> {
    const colRef = collection(this.db, 'clientes');
    const newDoc = doc(colRef);
    await setDoc(newDoc, {
      nome: cliente.nome,
      cnpjCpf: cliente.cnpjCpf || '',
      telefone: cliente.telefone || '',
      endereco: cliente.endereco || '',
      bairro: cliente.bairro || 'Centro',
      cidade: cliente.cidade || 'Criciúma',
      referencia: cliente.referencia || '',
      tipoCobranca: cliente.tipoCobranca || 'mensalista',
      ativo: true,
      criadoEm: new Date().toISOString()
    });
  }

  async atualizarCliente(id: string, updates: Partial<ClienteEmpresa>): Promise<void> {
    const docRef = doc(this.db, 'clientes', id);
    await updateDoc(docRef, updates);
  }

  async excluirCliente(id: string): Promise<void> {
    const docRef = doc(this.db, 'clientes', id);
    await deleteDoc(docRef);
  }
}
