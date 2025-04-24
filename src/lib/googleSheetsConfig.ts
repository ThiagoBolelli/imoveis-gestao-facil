
// Configurações da API do Google Sheets
export const GOOGLE_API_KEY = "AIzaSyBFBUREl4eZ_AqzQSn1BHSUUHNPdWcF58";
export const GOOGLE_CLIENT_ID = "697991864666-uen5tcg968ranvc4eiqlac7or956f0gj.apps.googleusercontent.com";
export const GOOGLE_SHEET_ID = "1RT9Kn-4xp6YC5QCa2snL0aQ7ONtsCWBwgDxy8wMrNZI";

export const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Definição das abas da planilha
export const SHEETS = {
  PROPERTIES: "Properties",
  TENANTS: "Tenants",
  PAYMENTS: "Payments",
};

// Exemplo de uso para simular a integração
export const mockData = {
  properties: [
    {
      id: "1",
      address: "Rua das Flores, 123, São Paulo, SP",
      purpose: "Aluguel",
      owner: "João Silva",
      type: "Apartamento",
      salePrice: 0,
      rentalPrice: 2500,
    },
    {
      id: "2",
      address: "Avenida Paulista, 1000, São Paulo, SP",
      purpose: "Venda",
      owner: "Maria Oliveira",
      type: "Casa",
      salePrice: 850000,
      rentalPrice: 0,
    },
    {
      id: "3",
      address: "Rua Bela Vista, 45, Campinas, SP",
      purpose: "Aluguel",
      owner: "Carlos Ferreira",
      type: "KITNET",
      salePrice: 0,
      rentalPrice: 1200,
    },
    {
      id: "4",
      address: "Estrada do Campo, Km 5, Ribeirão Preto, SP",
      purpose: "Venda",
      owner: "Antonio Pereira",
      type: "Propriedade Rural",
      salePrice: 1200000,
      rentalPrice: 0,
    },
    {
      id: "5",
      address: "Loteamento Boa Vista, Lote 12, Sorocaba, SP",
      purpose: "Venda",
      owner: "Ana Souza",
      type: "Terreno",
      salePrice: 300000,
      rentalPrice: 0,
    }
  ],
  tenants: [
    {
      id: "1",
      name: "Maria Oliveira",
      dueDate: 5,
      propertyId: "1",
      monthlyRent: 2500,
    },
    {
      id: "2",
      name: "Pedro Santos",
      dueDate: 10,
      propertyId: "3",
      monthlyRent: 1200,
    }
  ],
  payments: [
    {
      id: "1",
      tenantId: "1",
      month: "Março 2025",
      amount: 2500,
      status: "Pago",
      paymentDate: "2025-03-03",
    },
    {
      id: "2",
      tenantId: "1",
      month: "Abril 2025",
      amount: 2500,
      status: "Não Pago",
      paymentDate: "",
    },
    {
      id: "3",
      tenantId: "2",
      month: "Março 2025",
      amount: 1200,
      status: "Pago",
      paymentDate: "2025-03-08",
    },
    {
      id: "4",
      tenantId: "2",
      month: "Abril 2025",
      amount: 1200,
      status: "Não Pago",
      paymentDate: "",
    },
  ],
};
