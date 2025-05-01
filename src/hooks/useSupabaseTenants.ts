
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Tenant } from '@/services/googleSheetsService';

// Create a type that matches our database schema for inserts
type TenantInsert = {
  name: string;
  propertyid: string;
  startdate: string;
  email?: string | null;
  phone?: string | null;
  enddate?: string | null;
};

// Create a type for our frontend Tenant format (for mutation)
type TenantInput = {
  name: string;
  propertyId: string;
  email?: string;
  phone?: string;
  dueDate?: number;
};

export const useSupabaseTenants = () => {
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*');

      if (error) {
        toast.error('Erro ao carregar inquilinos');
        throw error;
      }

      // Mapear os dados do Supabase para o formato esperado pelo restante da aplicação
      return data.map(item => ({
        id: item.id,
        name: item.name,
        propertyId: item.propertyid,
        email: item.email || '',
        phone: item.phone || '',
        startDate: item.startdate,
        endDate: item.enddate,
        dueDate: 10, // Default due date as it's not stored in the database
        monthlyRent: 0 // Default monthly rent as it's not stored in the database
      })) || [];
    },
  });

  const addTenantMutation = useMutation({
    mutationFn: async (tenant: TenantInput) => {
      const tenantData: TenantInsert = {
        name: tenant.name,
        propertyid: tenant.propertyId,
        startdate: new Date().toISOString().split('T')[0],
        email: tenant.email || null,
        phone: tenant.phone || null
      };

      // Fixing the insert call to use an array
      const { data, error } = await supabase
        .from('tenants')
        .insert([tenantData])
        .select('*');

      if (error) {
        toast.error('Erro ao adicionar inquilino');
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Inquilino adicionado com sucesso!');
    },
  });

  return {
    tenants,
    isLoading,
    addTenant: addTenantMutation.mutate,
  };
};
