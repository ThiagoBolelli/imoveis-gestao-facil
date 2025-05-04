
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Property } from '@/services/googleSheetsService';

interface AvailablePropertiesProps {
  isLoading: boolean;
  rentalPropertiesAvailable: Property[];
}

const AvailableProperties = ({ isLoading, rentalPropertiesAvailable }: AvailablePropertiesProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return <div className="text-center py-6">Carregando imóveis...</div>;
  }
  
  if (rentalPropertiesAvailable.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">
          Não há imóveis disponíveis para aluguel. Adicione um imóvel para aluguel primeiro.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/imoveis/adicionar')}
        >
          Adicionar Imóvel para Aluguel
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rentalPropertiesAvailable.map(property => (
        <div 
          key={property.id}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="mb-2">
            <p className="font-medium">{property.address}</p>
            <p className="text-sm text-gray-600">{property.type}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-primary font-bold">
              R$ {Number(property.rentalPrice).toFixed(2).replace('.', ',')}
            </p>
            <Button 
              size="sm"
              onClick={() => navigate(`/alugueis/adicionar?propertyId=${property.id}`)}
            >
              Adicionar Inquilino
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableProperties;
