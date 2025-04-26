
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Property } from '@/services/googleSheetsService';

export const useSupabaseProperties = () => {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        toast.error('Erro ao carregar imóveis');
        throw error;
      }

      return data || [];
    },
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (property: Omit<Property, 'id'>) => {
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          address: property.address,
          listingType: property.purpose,
          owner: property.owner,
          propertyType: property.type,
          rentalPrice: property.rentalPrice,
          salePrice: property.salePrice,
          description: property.description || null,
        }])
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar imóvel');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Imóvel adicionado com sucesso!');
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erro ao excluir imóvel');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Imóvel excluído com sucesso!');
    },
  });

  return {
    properties,
    isLoading,
    addProperty: addPropertyMutation.mutate,
    deleteProperty: deletePropertyMutation.mutate,
  };
};
