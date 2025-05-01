
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '@/components/PropertyForm';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { toast } from '@/components/ui/sonner';
import { PropertyFormValues } from '@/components/property-form/PropertyFormSchema';

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, isLoading, updateProperty } = useSupabaseProperties();
  
  // Find the property with the matching ID
  const property = properties.find(p => p.id === id);
  
  useEffect(() => {
    if (!isLoading && !property) {
      toast.error('Imóvel não encontrado');
      navigate('/imoveis');
    }
  }, [property, isLoading, navigate]);
  
  const handleSubmit = async (data: PropertyFormValues) => {
    if (id) {
      await updateProperty({ id, ...data });
      navigate("/imoveis");
    }
  };
  
  if (isLoading) {
    return <div className="container mx-auto p-4">Carregando...</div>;
  }
  
  if (!property) {
    return null;
  }
  
  // Convert property data to form data format
  const formData = {
    address: property.address,
    purpose: property.purpose,
    owner: property.owner,
    type: property.type,
    salePrice: property.salePrice.toString(),
    rentalPrice: property.rentalPrice.toString(),
    description: property.description || ''
  };
  
  return <PropertyForm onSubmit={handleSubmit} initialData={formData} isEditing={true} />;
};

export default EditProperty;
