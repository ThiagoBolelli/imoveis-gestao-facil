
import { Building, House, KeyRound, LandPlot, Plus } from 'lucide-react';
import { Property } from '@/services/googleSheetsService';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
  onAddTenant?: (propertyId: string) => void;
}

// Componente para renderizar o ícone correto com base no tipo de propriedade
const PropertyIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'casa':
      return <House className="h-5 w-5" />;
    case 'apartamento':
      return <Building className="h-5 w-5" />;
    case 'kitnet':
      return <Building className="h-5 w-5" />;
    case 'propriedade rural':
      return <LandPlot className="h-5 w-5" />;
    case 'terreno':
      return <LandPlot className="h-5 w-5" />;
    default:
      return <Building className="h-5 w-5" />;
  }
};

const PropertyCard = ({ property, onAddTenant }: PropertyCardProps) => {
  const { id, address, purpose, owner, type, salePrice, rentalPrice } = property;
  const isRental = purpose === 'Aluguel';
  const price = isRental ? rentalPrice : salePrice;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-40 bg-gray-200 flex items-center justify-center">
        <PropertyIcon type={type} />
        <Badge 
          className={`absolute top-2 right-2 ${isRental ? 'bg-blue-500' : 'bg-purple-500'}`}
        >
          {isRental ? 'Aluguel' : 'Venda'}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{type}</h3>
        <p className="text-sm text-gray-600 mb-2 flex items-start">
          <span className="inline-block w-4 mr-1">📍</span>
          <span className="line-clamp-2">{address}</span>
        </p>
        <p className="text-sm text-gray-600 mb-4 flex items-center">
          <span className="inline-block w-4 mr-1">👤</span>
          {owner}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">
            {formatCurrency(price)}
            {isRental && <span className="text-xs text-gray-600">/mês</span>}
          </span>
          
          {isRental && onAddTenant && (
            <Button 
              variant="outline" 
              className="text-xs px-2 py-1 h-8" 
              onClick={() => onAddTenant(id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Inquilino
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
