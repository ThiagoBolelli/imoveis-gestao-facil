
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useSupabaseTenants } from '@/hooks/useSupabaseTenants';
import { useSupabasePayments } from '@/hooks/useSupabasePayments';
import { useQueryClient } from '@tanstack/react-query';

// Import the new components
import RentalHeader from '@/components/rental/RentalHeader';
import RentalSearch from '@/components/rental/RentalSearch';
import AvailableProperties from '@/components/rental/AvailableProperties';
import ActiveTenants from '@/components/rental/ActiveTenants';
import FinishedContracts from '@/components/rental/FinishedContracts';

const Rentals = () => {
  const { properties } = useSupabaseProperties();
  const { tenants, isLoading: tenantsLoading, removeTenant } = useSupabaseTenants();
  const { payments, isLoading: paymentsLoading, updatePaymentStatus } = useSupabasePayments();
  const [filteredTenants, setFilteredTenants] = useState(tenants);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();
  
  const isLoading = tenantsLoading || paymentsLoading;
  
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const results = tenants.filter(tenant => {
        const property = properties.find(p => p.id === tenant.propertyId);
        return (
          tenant.name.toLowerCase().includes(query) ||
          (property && property.address.toLowerCase().includes(query))
        );
      });
      setFilteredTenants(results);
    } else {
      // Filter only active tenants (without end date)
      const activeTenants = tenants.filter(tenant => !tenant.endDate);
      setFilteredTenants(activeTenants);
    }
  }, [searchQuery, tenants, properties]);
  
  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await updatePaymentStatus({
        paymentId,
        status: 'Pago',
        paymentDate: today
      });
      
      toast.success("Pagamento registrado com sucesso!");
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error("Erro ao registrar pagamento. Tente novamente.");
    }
  };

  const handleRemoveTenant = async (tenantId: string) => {
    try {
      await removeTenant(tenantId);
      toast.success("Contrato finalizado com sucesso!");
      // Refresh data to update UI
      await handleSyncData();
    } catch (error) {
      console.error('Erro ao remover inquilino:', error);
      toast.error("Erro ao finalizar contrato. Tente novamente.");
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      // Recarregar dados do Supabase
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['properties'] }),
        queryClient.invalidateQueries({ queryKey: ['tenants'] }),
        queryClient.invalidateQueries({ queryKey: ['payments'] })
      ]);
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      toast.error("Erro ao sincronizar dados.");
    } finally {
      setIsSyncing(false);
    }
  };
  
  // List of properties available for rent (for the add tenant button)
  const rentalPropertiesAvailable = properties.filter(p => 
    p.purpose === 'Aluguel' && 
    !tenants.some(t => t.propertyId === p.id && !t.endDate) // Check if there's no active tenant
  );
  
  return (
    <div className="container mx-auto p-4">
      <RentalHeader 
        isSyncing={isSyncing}
        handleSyncData={handleSyncData}
        rentalPropertiesAvailable={rentalPropertiesAvailable.length}
      />
      
      {/* Search bar */}
      <RentalSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {/* List of properties available for rent */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Imóveis Disponíveis para Aluguel</h2>
        <AvailableProperties 
          isLoading={isLoading}
          rentalPropertiesAvailable={rentalPropertiesAvailable}
        />
      </div>
      
      {/* List of tenants */}
      <div>
        <h2 className="text-xl font-medium mb-4">Inquilinos Ativos</h2>
        <ActiveTenants 
          isLoading={isLoading}
          filteredTenants={filteredTenants}
          properties={properties}
          payments={payments}
          searchQuery={searchQuery}
          rentalPropertiesAvailable={rentalPropertiesAvailable}
          handleMarkAsPaid={handleMarkAsPaid}
          handleRemoveTenant={handleRemoveTenant}
        />
      </div>
      
      {/* Section for tenants with ended contracts */}
      <div className="mt-10">
        <h2 className="text-xl font-medium mb-4">Contratos Finalizados</h2>
        <FinishedContracts 
          isLoading={isLoading}
          tenants={tenants}
          properties={properties}
        />
      </div>
    </div>
  );
};

export default Rentals;
