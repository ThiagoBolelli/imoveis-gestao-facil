
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TenantRow from '@/components/TenantRow';
import { toast } from '@/components/ui/sonner';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useSupabaseTenants } from '@/hooks/useSupabaseTenants';
import { useSupabasePayments } from '@/hooks/useSupabasePayments';
import { useQueryClient } from '@tanstack/react-query';

const Rentals = () => {
  const navigate = useNavigate();
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
  
  // Function to find the property for a tenant
  const getPropertyForTenant = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };
  
  // List of properties available for rent (for the add tenant button)
  const rentalPropertiesAvailable = properties.filter(p => 
    p.purpose === 'Aluguel' && 
    !tenants.some(t => t.propertyId === p.id && !t.endDate) // Check if there's no active tenant
  );
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Aluguéis</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleSyncData}
            disabled={isSyncing}
            className="bg-background hover:bg-accent"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Dados'}
          </Button>
          
          <Button 
            onClick={() => navigate("/alugueis/adicionar")}
            className="bg-primary hover:bg-primary/90"
            disabled={rentalPropertiesAvailable.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Inquilino
          </Button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por inquilino, imóvel..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setSearchQuery('')}
          >
            <Filter className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
      
      {/* List of properties available for rent */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Imóveis Disponíveis para Aluguel</h2>
        
        {isLoading ? (
          <div className="text-center py-6">Carregando imóveis...</div>
        ) : rentalPropertiesAvailable.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rentalPropertiesAvailable.map(property => (
              <div 
                key={property.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="mb-2">
                  <p className="font-medium">{property.address}</p>
                  <p className="text-sm text-gray-600">{property.type}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-primary font-bold">
                    R$ {Number(property.rentalPrice).toFixed(2).replace('.', ',')}
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/alugueis/adicionar?propertyId=${property.id}`)}
                  >
                    Adicionar Inquilino
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">
              Não há imóveis disponíveis para aluguel. Adicione um imóvel para aluguel primeiro.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/imoveis/adicionar')}
            >
              Adicionar Imóvel para Aluguel
            </Button>
          </div>
        )}
      </div>
      
      {/* List of tenants */}
      <div>
        <h2 className="text-xl font-medium mb-4">Inquilinos Ativos</h2>
        
        {isLoading ? (
          <div className="text-center py-6">Carregando inquilinos...</div>
        ) : filteredTenants.length > 0 ? (
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
        ) : (
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
        )}
      </div>
      
      {/* Section for tenants with ended contracts */}
      <div className="mt-10">
        <h2 className="text-xl font-medium mb-4">Contratos Finalizados</h2>
        
        {isLoading ? (
          <div className="text-center py-6">Carregando dados...</div>
        ) : tenants.filter(t => t.endDate).length > 0 ? (
          <div className="bg-white p-4 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imóvel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Término</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenants
                    .filter(tenant => tenant.endDate)
                    .map(tenant => {
                      const property = properties.find(p => p.id === tenant.propertyId);
                      return (
                        <tr key={tenant.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tenant.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property?.address || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(tenant.startDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tenant.endDate && new Date(tenant.endDate).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">
              Não há contratos finalizados para exibir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;
