
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Tenant } from '@/services/googleSheetsService';
import type { Database } from '@/integrations/supabase/types';

// Define a type that uses Supabase's Insert type which already correctly omits auto-generated fields
type TenantInsert = Database['public']['Tables']['tenants']['Insert'];

// Create a type for our frontend Tenant format (for mutation)
type TenantInput = {
  name: string;
  propertyId: string;
  email?: string;
  phone?: string;
  dueDate?: number;
};

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
      // Generate a unique ID for the new tenant
      const id = generateId();
      
      const tenantData = {
        id,
        name: tenant.name,
        propertyid: tenant.propertyId,
        startdate: new Date().toISOString().split('T')[0],
        email: tenant.email || null,
        phone: tenant.phone || null
      };

      const { data, error } = await supabase
        .from('tenants')
        .insert([tenantData])
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

  const removeTenantMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      // Mark the end date as today and save it
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('tenants')
        .update({ enddate: today })
        .eq('id', tenantId);

      if (error) {
        toast.error('Erro ao remover inquilino');
        throw error;
      }

      return { id: tenantId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Contrato de inquilino finalizado com sucesso!');
    },
  });

  return {
    tenants,
    isLoading,
    addTenant: addTenantMutation.mutate,
    removeTenant: removeTenantMutation.mutate,
  };
};
