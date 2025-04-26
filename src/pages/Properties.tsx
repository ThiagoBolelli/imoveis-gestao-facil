
import { useNavigate } from 'react-router-dom';
import { Building, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyList from '@/components/property/PropertyList';
import { useSupabaseTenants } from '@/hooks/useSupabaseTenants';

const Properties = () => {
  const navigate = useNavigate();
  const { 
    properties, 
    isLoading, 
    deleteProperty 
  } = useSupabaseProperties();

  const { tenants } = useSupabaseTenants();

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

  const propertyTypes = [...new Set(properties.map(property => property.type))];
  
  // Verificar se um imóvel tem inquilino
  const hasTenant = (propertyId: string) => {
    return tenants.some(tenant => tenant.propertyId === propertyId);
  };

  const handleAddTenant = (propertyId: string) => {
    navigate(`/alugueis/adicionar?propertyId=${propertyId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Imóveis</h1>
        
        <div className="flex gap-2">
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
        hasTenant={hasTenant}
        onAddTenant={handleAddTenant}
        onDelete={deleteProperty}
      />
    </div>
  );
};

export default Properties;
