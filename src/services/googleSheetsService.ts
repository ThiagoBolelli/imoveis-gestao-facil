import { mockData } from "../lib/googleSheetsConfig";

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

// Serviço simulado para operações no Google Sheets
export const GoogleSheetsService = {
  // Propriedades
  getProperties: async (): Promise<Property[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.properties);
      }, 500);
    });
  },
  
  addProperty: async (property: Omit<Property, "id">): Promise<Property> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Date.now().toString();
        const newProperty = { ...property, id: newId };
        mockData.properties.push(newProperty);
        resolve(newProperty);
      }, 500);
    });
  },
  
  // Inquilinos
  getTenants: async (): Promise<Tenant[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.tenants);
      }, 500);
    });
  },
  
  addTenant: async (tenant: Omit<Tenant, "id">): Promise<Tenant> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Date.now().toString();
        const newTenant = { ...tenant, id: newId };
        mockData.tenants.push(newTenant);
        resolve(newTenant);
      }, 500);
    });
  },
  
  // Pagamentos
  getPayments: async (): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.payments);
      }, 500);
    });
  },
  
  addPayment: async (payment: Omit<Payment, "id">): Promise<Payment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Date.now().toString();
        const newPayment = { ...payment, id: newId };
        mockData.payments.push(newPayment);
        resolve(newPayment);
      }, 500);
    });
  },
  
  updatePaymentStatus: async (paymentId: string, status: string, paymentDate: string): Promise<Payment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const paymentIndex = mockData.payments.findIndex(p => p.id === paymentId);
        if (paymentIndex !== -1) {
          mockData.payments[paymentIndex].status = status;
          mockData.payments[paymentIndex].paymentDate = paymentDate;
          resolve(mockData.payments[paymentIndex]);
        } else {
          throw new Error("Pagamento não encontrado");
        }
      }, 500);
    });
  },

  deleteProperty: async (propertyId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const propertyIndex = mockData.properties.findIndex(p => p.id === propertyId);
        if (propertyIndex !== -1) {
          mockData.properties.splice(propertyIndex, 1);
        }
        resolve();
      }, 500);
    });
  },
};
