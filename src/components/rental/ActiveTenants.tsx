
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import TenantRow from '@/components/TenantRow';
import { Property } from '@/services/googleSheetsService';

interface ActiveTenantsProps {
  isLoading: boolean;
  filteredTenants: any[];
  properties: Property[];
  payments: any[];
  searchQuery: string;
  rentalPropertiesAvailable: Property[];
  handleMarkAsPaid: (paymentId: string) => Promise<void>;
  handleRemoveTenant: (tenantId: string) => Promise<void>;
}

const ActiveTenants = ({ 
  isLoading, 
  filteredTenants, 
  properties, 
  payments, 
  searchQuery, 
  rentalPropertiesAvailable,
  handleMarkAsPaid, 
  handleRemoveTenant
}: ActiveTenantsProps) => {
  const navigate = useNavigate();
  
  // Function to find the property for a tenant
  const getPropertyForTenant = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };
  
  if (isLoading) {
    return <div className="text-center py-6">Carregando inquilinos...</div>;
  }
  
  if (filteredTenants.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">
          {searchQuery ? "Nenhum inquilino encontrado com essa busca." : "Não há inquilinos cadastrados."}
        </p>
        {rentalPropertiesAvailable.length > 0 && !searchQuery && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/alugueis/adicionar')}
          >
            Adicionar Inquilino
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredTenants.map(tenant => {
        const propertyInfo = getPropertyForTenant(tenant.propertyId);
        // Create tenant object with required fields for TenantRow
        const tenantForRow = {
          id: tenant.id,
          name: tenant.name,
          propertyId: tenant.propertyId,
          dueDate: tenant.dueDate || 10, // Use default if not set
          monthlyRent: propertyInfo ? propertyInfo.rentalPrice : 0
        };
        
        return (
          <TenantRow
            key={tenant.id}
            tenant={tenantForRow}
            property={propertyInfo}
            payments={payments.filter(p => p.tenantId === tenant.id)}
            onMarkAsPaid={handleMarkAsPaid}
            onRemoveTenant={handleRemoveTenant}
          />
        );
      })}
    </div>
  );
};

export default ActiveTenants;
