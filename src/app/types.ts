import { DeliveryOrder, Motoboy, TransshipmentRequest, ClienteEmpresa, BillingPeriod } from './core/models/delivery.model';

export type ClientCompany = Omit<ClienteEmpresa, 'id' | 'tipoCobranca'> & {
  id: string;
  email?: string;
  responsavel?: string;
  complemento?: string;
  tipoCobranca?: BillingPeriod;
  tipoFaturamento: BillingPeriod | 'avulso';
  observacoes?: string;
};

export type ClientBillingType = BillingPeriod | 'avulso';
export type { DeliveryOrder, Motoboy, TransshipmentRequest, BillingPeriod, PaymentMethod } from './core/models/delivery.model';

