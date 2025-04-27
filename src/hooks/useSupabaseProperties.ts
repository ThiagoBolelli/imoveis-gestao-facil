
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Property } from '@/services/googleSheetsService';

// Create a type that matches our database schema
type PropertyInsert = {
  address: string;
  listingtype: string;
  owner: string;
  propertytype: string;
  rentalprice?: number | null;
  saleprice?: number | null;
  description?: string | null;
  createdat: string;
};

// Create a type for our frontend Property format (for mutation)
type PropertyInput = {
  address: string;
  purpose: string;
  owner: string;
  type: string;
  rentalPrice: number;
  salePrice: number;
  description?: string;
};

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

      // Mapear os dados do Supabase para o formato esperado pelo restante da aplicação
      return data.map(item => ({
        id: item.id,
        address: item.address,
        purpose: item.listingtype, // mapeamento de listingtype para purpose
        owner: item.owner,
        type: item.propertytype, // mapeamento de propertytype para type
        salePrice: item.saleprice || 0,
        rentalPrice: item.rentalprice || 0,
        description: item.description || '',
        area: item.area,
        bathrooms: item.bathrooms,
        bedrooms: item.bedrooms,
        createdAt: item.createdat,
        images: item.images || []
      })) || [];
    },
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (property: PropertyInput) => {
      const propertyData: PropertyInsert = {
        address: property.address,
        listingtype: property.purpose,
        owner: property.owner,
        propertytype: property.type,
        rentalprice: property.rentalPrice,
        saleprice: property.salePrice,
        description: property.description || null,
        createdat: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])  // Wrap in array to match expected format
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
