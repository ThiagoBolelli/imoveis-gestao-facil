
import PropertyForm from '@/components/PropertyForm';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useSupabaseProperties();
  
  const handleSubmit = async (data: any) => {
    await addProperty(data);
    navigate("/imoveis");
  };
  
  return <PropertyForm onSubmit={handleSubmit} />;
};

export default AddProperty;
