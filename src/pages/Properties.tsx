
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyList from '@/components/property/PropertyList';

const Properties = () => {
  const navigate = useNavigate();
  const { 
    properties, 
    isLoading, 
    isSyncing, 
    fetchData, 
    handleSyncData, 
    handleDeleteProperty,
    propertyHasTenant 
  } = useProperties();

  const {
    filteredProperties,
    searchQuery,
    setSearchQuery,
    purposeFilter,
    setPurposeFilter,
    typeFilter,
    setTypeFilter,
    resetFilters
  } = usePropertyFilters(properties);

  useEffect(() => {
    fetchData();
  }, []);

  const propertyTypes = [...new Set(properties.map(property => property.type))];
  
  const handleAddTenant = (propertyId: string) => {
    navigate(`/alugueis/adicionar?propertyId=${propertyId}`);
  };

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

      <PropertyFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        purposeFilter={purposeFilter}
        onPurposeChange={setPurposeFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        onReset={resetFilters}
        propertyTypes={propertyTypes}
      />

      <PropertyList
        properties={filteredProperties}
        isLoading={isLoading}
        hasTenant={propertyHasTenant}
        onAddTenant={handleAddTenant}
        onDelete={handleDeleteProperty}
      />
    </div>
  );
};

export default Properties;
