
import { useState } from 'react';
import { Property, Tenant, GoogleSheetsService } from '@/services/googleSheetsService';
import { toast } from "sonner";

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
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
      setTenants(tenantsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error("Erro ao buscar dados. Verifique sua conexão com o Google Sheets.");
    } finally {
      setIsLoading(false);
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

  const handleDeleteProperty = async (propertyId: string) => {
    if (propertyHasTenant(propertyId)) {
      toast.error("Não é possível excluir um imóvel com inquilino. Remova o inquilino primeiro.");
      return;
    }
    
    try {
      await GoogleSheetsService.deleteProperty(propertyId);
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success("Imóvel excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast.error("Erro ao excluir imóvel. Tente novamente.");
    }
  };

  const propertyHasTenant = (propertyId: string) => {
    return tenants.some(tenant => tenant.propertyId === propertyId);
  };

  return {
    properties,
    tenants,
    isLoading,
    isSyncing,
    fetchData,
    handleSyncData,
    handleDeleteProperty,
    propertyHasTenant
  };
};
