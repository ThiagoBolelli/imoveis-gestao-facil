
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PropertyCard from '@/components/PropertyCard';
import { GoogleSheetsService, Property, Tenant } from '@/services/googleSheetsService';
import { toast } from "sonner";

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propertiesData, tenantsData] = await Promise.all([
        GoogleSheetsService.getProperties(),
        GoogleSheetsService.getTenants()
      ]);
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
      setTenants(tenantsData);
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
    let results = properties;
    
    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        property => 
          property.address.toLowerCase().includes(query) || 
          property.owner.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query)
      );
    }
    
    // Filtrar por finalidade
    if (purposeFilter && purposeFilter !== 'all') {
      results = results.filter(property => property.purpose === purposeFilter);
    }
    
    // Filtrar por tipo
    if (typeFilter && typeFilter !== 'all') {
      results = results.filter(property => property.type === typeFilter);
    }
    
    setFilteredProperties(results);
  }, [searchQuery, purposeFilter, typeFilter, properties]);
  
  // Verifica se um imóvel tem inquilino
  const propertyHasTenant = (propertyId: string) => {
    return tenants.some(tenant => tenant.propertyId === propertyId);
  };
  
  const handleAddTenant = (propertyId: string) => {
    navigate(`/alugueis/adicionar?propertyId=${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    // Verificar novamente se não tem inquilino (segurança adicional)
    if (propertyHasTenant(propertyId)) {
      toast.error("Não é possível excluir um imóvel com inquilino. Remova o inquilino primeiro.");
      return;
    }
    
    try {
      await GoogleSheetsService.deleteProperty(propertyId);
      const updatedProperties = properties.filter(p => p.id !== propertyId);
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      toast.success("Imóvel excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast.error("Erro ao excluir imóvel. Tente novamente.");
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
  
  // Obter tipos únicos de imóveis para o filtro
  const propertyTypes = [...new Set(properties.map(property => property.type))];
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Imóveis</h1>
        
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
            onClick={() => navigate("/imoveis/adicionar")}
            className="bg-primary hover:bg-primary/90"
          >
            <Building className="mr-2 h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </div>
      </div>
      
      {/* Barra de busca e filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por endereço, proprietário..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40">
              <Select
                value={purposeFilter}
                onValueChange={setPurposeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Finalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-40">
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setPurposeFilter('all');
                setTypeFilter('all');
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Lista de imóveis */}
      {isLoading ? (
        <div className="text-center py-12">Carregando imóveis...</div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              hasTenant={propertyHasTenant(property.id)}
              onAddTenant={property.purpose === 'Aluguel' && !propertyHasTenant(property.id) ? handleAddTenant : undefined}
              onDelete={handleDeleteProperty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">Nenhum imóvel encontrado</h3>
          <p className="text-gray-500 mt-2">
            {searchQuery || purposeFilter !== 'all' || typeFilter !== 'all'
              ? "Tente ajustar os filtros de busca"
              : "Adicione seu primeiro imóvel clicando no botão acima"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;
