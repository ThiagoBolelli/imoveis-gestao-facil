
import { GOOGLE_API_KEY, GOOGLE_SHEET_ID, SHEETS, mockData } from "../lib/googleSheetsConfig";

// Tipos de dados
export interface Property {
  id: string;
  address: string;
  purpose: string;
  owner: string;
  type: string;
  salePrice: number;
  rentalPrice: number;
}

export interface Tenant {
  id: string;
  name: string;
  dueDate: number;
  propertyId: string;
  monthlyRent: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  month: string;
  amount: number;
  status: string;
  paymentDate: string;
}

// Função auxiliar para realizar requisições à API do Google Sheets
const fetchGoogleSheets = async (range: string, method: 'GET' | 'POST' | 'PUT', values?: any[][]): Promise<any> => {
  try {
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values`;
    const url = method === 'GET' 
      ? `${baseUrl}/${range}?key=${GOOGLE_API_KEY}`
      : `${baseUrl}/${range}?valueInputOption=USER_ENTERED&key=${GOOGLE_API_KEY}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (values && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify({
        values,
        majorDimension: "ROWS"
      });
    }

    const response = await fetch(url, options);
    const data = await response.json();

    // Verificar erros na resposta
    if (data.error) {
      console.error('Erro na API do Google Sheets:', data.error);
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Erro ao acessar Google Sheets:", error);
    
    // Simulação: retornar dados mockados em caso de erro
    console.log("Usando dados de simulação devido a erro na API");
    return null;
  }
};

// Serviço para operações no Google Sheets
export const GoogleSheetsService = {
  // Propriedades
  getProperties: async (): Promise<Property[]> => {
    try {
      const range = `${SHEETS.PROPERTIES}!A2:G1000`;
      const response = await fetchGoogleSheets(range, 'GET');

      // Se tivemos uma resposta válida da API
      if (response && response.values) {
        return response.values.map((row: any[], index: number) => ({
          id: row[0] || `p-${index}`,
          address: row[1] || '',
          purpose: row[2] || '',
          owner: row[3] || '',
          type: row[4] || '',
          salePrice: Number(row[5]) || 0,
          rentalPrice: Number(row[6]) || 0,
        }));
      }
      
      // Se não tivemos resposta válida, usamos dados mockados
      console.log("Usando dados mockados para propriedades");
      return mockData.properties;
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error);
      return mockData.properties;
    }
  },
  
  addProperty: async (property: Omit<Property, "id">): Promise<Property> => {
    try {
      // Gerar novo ID
      const newId = Date.now().toString();
      const newProperty = { ...property, id: newId };
      
      // Preparar dados para inserção
      const values = [
        [
          newId,
          property.address,
          property.purpose,
          property.owner,
          property.type,
          property.salePrice,
          property.rentalPrice
        ]
      ];
      
      const range = `${SHEETS.PROPERTIES}!A:G`;
      await fetchGoogleSheets(range, 'POST', values);
      
      return newProperty;
    } catch (error) {
      console.error("Erro ao adicionar propriedade:", error);
      
      // Simular adição em caso de erro
      const newId = Date.now().toString();
      const newProperty = { ...property, id: newId };
      mockData.properties.push(newProperty);
      return newProperty;
    }
  },
  
  // Inquilinos
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const range = `${SHEETS.TENANTS}!A2:E1000`;
      const response = await fetchGoogleSheets(range, 'GET');
      
      if (response && response.values) {
        return response.values.map((row: any[], index: number) => ({
          id: row[0] || `t-${index}`,
          name: row[1] || '',
          dueDate: Number(row[2]) || 1,
          propertyId: row[3] || '',
          monthlyRent: Number(row[4]) || 0,
        }));
      }
      
      return mockData.tenants;
    } catch (error) {
      console.error("Erro ao buscar inquilinos:", error);
      return mockData.tenants;
    }
  },
  
  addTenant: async (tenant: Omit<Tenant, "id">): Promise<Tenant> => {
    try {
      const newId = Date.now().toString();
      const newTenant = { ...tenant, id: newId };
      
      const values = [
        [
          newId,
          tenant.name,
          tenant.dueDate,
          tenant.propertyId,
          tenant.monthlyRent
        ]
      ];
      
      const range = `${SHEETS.TENANTS}!A:E`;
      await fetchGoogleSheets(range, 'POST', values);
      
      return newTenant;
    } catch (error) {
      console.error("Erro ao adicionar inquilino:", error);
      
      // Simular adição em caso de erro
      const newId = Date.now().toString();
      const newTenant = { ...tenant, id: newId };
      mockData.tenants.push(newTenant);
      return newTenant;
    }
  },
  
  // Pagamentos
  getPayments: async (): Promise<Payment[]> => {
    try {
      const range = `${SHEETS.PAYMENTS}!A2:F1000`;
      const response = await fetchGoogleSheets(range, 'GET');
      
      if (response && response.values) {
        return response.values.map((row: any[], index: number) => ({
          id: row[0] || `pay-${index}`,
          tenantId: row[1] || '',
          month: row[2] || '',
          amount: Number(row[3]) || 0,
          status: row[4] || 'Não Pago',
          paymentDate: row[5] || '',
        }));
      }
      
      return mockData.payments;
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      return mockData.payments;
    }
  },
  
  addPayment: async (payment: Omit<Payment, "id">): Promise<Payment> => {
    try {
      const newId = Date.now().toString();
      const newPayment = { ...payment, id: newId };
      
      const values = [
        [
          newId,
          payment.tenantId,
          payment.month,
          payment.amount,
          payment.status,
          payment.paymentDate
        ]
      ];
      
      const range = `${SHEETS.PAYMENTS}!A:F`;
      await fetchGoogleSheets(range, 'POST', values);
      
      return newPayment;
    } catch (error) {
      console.error("Erro ao adicionar pagamento:", error);
      
      // Simular adição em caso de erro
      const newId = Date.now().toString();
      const newPayment = { ...payment, id: newId };
      mockData.payments.push(newPayment);
      return newPayment;
    }
  },
  
  updatePaymentStatus: async (paymentId: string, status: string, paymentDate: string): Promise<Payment> => {
    try {
      // Primeiro encontrar o pagamento na planilha
      const payments = await GoogleSheetsService.getPayments();
      const paymentIndex = payments.findIndex(p => p.id === paymentId);
      
      if (paymentIndex === -1) {
        throw new Error("Pagamento não encontrado");
      }
      
      const payment = payments[paymentIndex];
      const rowNumber = paymentIndex + 2; // +2 porque a primeira linha é cabeçalho e o índice começa em 0
      
      // Atualizar status e data de pagamento
      const range = `${SHEETS.PAYMENTS}!E${rowNumber}:F${rowNumber}`;
      await fetchGoogleSheets(range, 'PUT', [[status, paymentDate]]);
      
      const updatedPayment = { ...payment, status, paymentDate };
      return updatedPayment;
    } catch (error) {
      console.error("Erro ao atualizar status do pagamento:", error);
      
      // Simular atualização em caso de erro
      const paymentIndex = mockData.payments.findIndex(p => p.id === paymentId);
      if (paymentIndex !== -1) {
        mockData.payments[paymentIndex].status = status;
        mockData.payments[paymentIndex].paymentDate = paymentDate;
        return mockData.payments[paymentIndex];
      } else {
        throw new Error("Pagamento não encontrado");
      }
    }
  },

  deleteProperty: async (propertyId: string): Promise<void> => {
    try {
      // Primeiro precisamos encontrar a propriedade para saber qual linha excluir
      const properties = await GoogleSheetsService.getProperties();
      const propertyIndex = properties.findIndex(p => p.id === propertyId);
      
      if (propertyIndex === -1) {
        throw new Error("Propriedade não encontrada");
      }
      
      // Como a API do Google Sheets não suporta exclusão de linhas diretamente,
      // vamos atualizar a linha para valores vazios ou marcar como excluída
      // Em um cenário real, você poderia implementar uma estratégia de "soft delete"
      
      const rowNumber = propertyIndex + 2; // +2 porque a primeira linha é cabeçalho
      const range = `${SHEETS.PROPERTIES}!A${rowNumber}:G${rowNumber}`;
      
      // Marcar como excluída (estratégia simples)
      await fetchGoogleSheets(range, 'PUT', [["DELETED", "", "", "", "", "", ""]]);
      
      console.log(`Propriedade ${propertyId} marcada como excluída na linha ${rowNumber}`);
      
      // Também atualizamos os dados mockados para consistência
      const mockIndex = mockData.properties.findIndex(p => p.id === propertyId);
      if (mockIndex !== -1) {
        mockData.properties.splice(mockIndex, 1);
      }
    } catch (error) {
      console.error("Erro ao excluir propriedade:", error);
      
      // Fallback para exclusão local
      const propertyIndex = mockData.properties.findIndex(p => p.id === propertyId);
      if (propertyIndex !== -1) {
        mockData.properties.splice(propertyIndex, 1);
      }
    }
  },
};

