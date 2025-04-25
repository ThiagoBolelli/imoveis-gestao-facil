import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TenantRow from '@/components/TenantRow';
import { GoogleSheetsService, Tenant, Payment, Property } from '@/services/googleSheetsService';
import { toast } from '@/components/ui/sonner';

const Rentals = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tenantsData, propertiesData, paymentsData] = await Promise.all([
        GoogleSheetsService.getTenants(),
        GoogleSheetsService.getProperties(),
        GoogleSheetsService.getPayments(),
      ]);
      
      setTenants(tenantsData);
      setFilteredTenants(tenantsData);
      setProperties(propertiesData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error("Erro ao buscar dados. Verifique sua conexão com o Google Sheets.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
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
      setFilteredTenants(tenants);
    }
  }, [searchQuery, tenants, properties]);
  
  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await GoogleSheetsService.updatePaymentStatus(paymentId, 'Pago', today);
      
      // Atualizar o estado local
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.id === paymentId ? { ...payment, status: 'Pago', paymentDate: today } : payment
        )
      );
      
      toast.success("Pagamento registrado com sucesso!");
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error("Erro ao registrar pagamento. Tente novamente.");
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      await fetchData();
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      toast.error("Erro ao sincronizar dados. Verifique sua conexão com o Google Sheets.");
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Função para encontrar a propriedade de um inquilino
  const getPropertyForTenant = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };
  
  // Lista de imóveis disponíveis para aluguel (para o botão de adicionar inquilino)
  const rentalPropertiesAvailable = properties.filter(p => 
    p.purpose === 'Aluguel' && 
    !tenants.some(t => t.propertyId === p.id)
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
      
      {/* Barra de busca */}
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
      
      {/* Lista de imóveis disponíveis para aluguel */}
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
                    R$ {property.rentalPrice.toFixed(2).replace('.', ',')}
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
      
      {/* Lista de inquilinos */}
      <div>
        <h2 className="text-xl font-medium mb-4">Inquilinos Ativos</h2>
        
        {isLoading ? (
          <div className="text-center py-6">Carregando inquilinos...</div>
        ) : filteredTenants.length > 0 ? (
          <div className="space-y-4">
            {filteredTenants.map(tenant => (
              <TenantRow
                key={tenant.id}
                tenant={tenant}
                property={getPropertyForTenant(tenant.propertyId)}
                payments={payments.filter(p => p.tenantId === tenant.id)}
                onMarkAsPaid={handleMarkAsPaid}
              />
            ))}
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
    </div>
  );
};

export default Rentals;
