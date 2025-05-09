
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { Property } from '@/services/googleSheetsService';
import type { Database } from '@/integrations/supabase/types';

// Define a type that uses Supabase's Insert type which already correctly omits auto-generated fields
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];

// Create a type for our frontend Property format (for mutation)
type PropertyInput = {
  address: string;
  purpose: string;
  owner: string;
  type: string;
  rentalPrice?: number;
  salePrice?: number;
  description?: string;
};

// Create a type for property updates
type PropertyUpdate = PropertyInput & { id: string };

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
      // Generate a unique ID for the new property
      const id = generateId();
      
      const propertyData = {
        id,
        address: property.address,
        listingtype: property.purpose,
        owner: property.owner,
        propertytype: property.type,
        rentalprice: property.rentalPrice || null,
        saleprice: property.salePrice || null,
        description: property.description || null,
        createdat: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
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

  const updatePropertyMutation = useMutation({
    mutationFn: async (property: PropertyUpdate) => {
      const { id, ...rest } = property;
      
      const propertyData = {
        address: rest.address,
        listingtype: rest.purpose,
        owner: rest.owner,
        propertytype: rest.type,
        rentalprice: rest.rentalPrice || null,
        saleprice: rest.salePrice || null,
        description: rest.description || null,
      };

      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar imóvel');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Imóvel atualizado com sucesso!');
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
    updateProperty: updatePropertyMutation.mutate,
    deleteProperty: deletePropertyMutation.mutate,
  };
};
