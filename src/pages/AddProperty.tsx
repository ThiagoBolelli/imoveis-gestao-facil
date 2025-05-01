
import PropertyForm from '@/components/PropertyForm';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useNavigate } from 'react-router-dom';
import { PropertyFormValues } from '@/components/property-form/PropertyFormSchema';

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useSupabaseProperties();
  
  const handleSubmit = async (data: PropertyFormValues) => {
    await addProperty(data);
    navigate("/imoveis");
  };
  
  return <PropertyForm onSubmit={handleSubmit} />;
};

export default AddProperty;
