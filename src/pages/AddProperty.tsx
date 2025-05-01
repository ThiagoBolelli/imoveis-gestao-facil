
import PropertyForm from '@/components/PropertyForm';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useNavigate } from 'react-router-dom';
import { PropertyFormValues } from '@/components/property-form/PropertyFormSchema';

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useSupabaseProperties();
  
  const handleSubmit = async (data: PropertyFormValues) => {
    // Garantir que os valores exigidos estão presentes
    const property = {
      address: data.address,
      purpose: data.purpose,
      owner: data.owner,
      type: data.type,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
      rentalPrice: data.rentalPrice ? parseFloat(data.rentalPrice) : undefined,
      description: data.description
    };
    
    await addProperty(property);
    navigate("/imoveis");
  };
  
  return <PropertyForm onSubmit={handleSubmit} />;
};

export default AddProperty;
