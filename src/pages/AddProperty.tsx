
import PropertyForm from '@/components/PropertyForm';
import { GoogleSheetsService } from '@/services/googleSheetsService';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (data: any) => {
    try {
      await GoogleSheetsService.addProperty(data);
      toast.success("Imóvel adicionado com sucesso!");
      navigate("/imoveis");
    } catch (error) {
      console.error('Erro ao adicionar imóvel:', error);
      toast.error("Erro ao adicionar imóvel. Tente novamente.");
    }
  };
  
  return <PropertyForm onSubmit={handleSubmit} />;
};

export default AddProperty;
