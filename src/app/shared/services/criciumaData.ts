export interface CriciumaZone {
  cidade: string;
  valorBase: number;
  bairros: string[];
}

export const CRICIUMA_ZONES: CriciumaZone[] = [
  {
    cidade: 'Criciúma',
    valorBase: 18.0,
    bairros: [
      'Centro',
      'Comerciário',
      'Michel',
      'Cruzeiro do Sul',
      'Pio Corrêa',
      'São Luiz',
      'Próspera',
      'Ceará',
      'Brasília',
      'Pinheirinho',
      'Mina Brasil',
      'Mina do Mato',
      'Operária Nova',
      'Nossa Senhora do Carmo',
      'Santa Bárbara',
      'Milanese',
      'Universitário',
      'São Simão',
      'Quarta Linha',
      'Vila Rica'
    ]
  },
  {
    cidade: 'Içara',
    valorBase: 25.0,
    bairros: ['Centro', 'Presidente Vargas', 'Raichaski', 'Jaqueline', 'Aurora']
  },
  {
    cidade: 'Forquilhinha',
    valorBase: 28.0,
    bairros: ['Centro', 'Santa Cruz', 'Ouro Negro', 'Clarissas', 'Santa Isabel']
  },
  {
    cidade: 'Cocal do Sul',
    valorBase: 30.0,
    bairros: ['Centro', 'Jardim Itália', 'União', 'Monte Carlos']
  }
];
