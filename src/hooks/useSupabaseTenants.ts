
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
    mutationFn: async (tenant: Omit<Tenant, 'id'>) => {
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          name: tenant.name,
          propertyid: tenant.propertyId,
          startdate: new Date().toISOString().split('T')[0],
          email: tenant.email || null,
          phone: tenant.phone || null
        })
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
