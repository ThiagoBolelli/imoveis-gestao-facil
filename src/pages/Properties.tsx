
import { useNavigate } from 'react-router-dom';
import { Building, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyList from '@/components/property/PropertyList';
import { useSupabaseTenants } from '@/hooks/useSupabaseTenants';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { useQueryClient } from '@tanstack/react-query';

const Properties = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  
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
  
  // Check if a property has an active tenant (no end date)
  const hasTenant = (propertyId: string) => {
    return tenants.some(tenant => tenant.propertyId === propertyId && !tenant.endDate);
  };

  const handleAddTenant = (propertyId: string) => {
    navigate(`/alugueis/adicionar?propertyId=${propertyId}`);
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      // Invalidate queries to refresh data from Supabase
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['properties'] }),
        queryClient.invalidateQueries({ queryKey: ['tenants'] })
      ]);
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
      toast.error("Erro ao sincronizar dados. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      toast.success("Imóvel removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover imóvel:", error);
      toast.error("Erro ao remover imóvel. Tente novamente.");
    }
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
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
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
        hasTenant={hasTenant}
        onAddTenant={handleAddTenant}
        onDelete={handleDeleteProperty}
        onSyncData={handleSyncData}
      />
    </div>
  );
};

export default Properties;
