
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Tenant } from '@/services/googleSheetsService';

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

      return data || [];
    },
  });

  const addTenantMutation = useMutation({
    mutationFn: async (tenant: Omit<Tenant, 'id'>) => {
      const { data, error } = await supabase
        .from('tenants')
        .insert([{
          name: tenant.name,
          propertyId: tenant.propertyId,
          startDate: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar inquilino');
        throw error;
      }

      return data;
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
