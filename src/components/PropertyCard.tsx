
import { Plus, Edit } from 'lucide-react';
import { Property } from '@/services/googleSheetsService';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PropertyIcon } from './property/PropertyIcon';
import { PropertyStatus } from './property/PropertyStatus';
import { DeletePropertyDialog } from './property/DeletePropertyDialog';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  onAddTenant?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => void;
  hasTenant?: boolean;
}

const PropertyCard = ({ property, onAddTenant, onDelete, hasTenant = false }: PropertyCardProps) => {
  const { id, address, purpose, owner, type, salePrice, rentalPrice } = property;
  const isRental = purpose === 'Aluguel';
  const price = isRental ? rentalPrice : salePrice;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-40 bg-gray-200 flex items-center justify-center">
        <PropertyIcon type={type} />
        <PropertyStatus isRental={isRental} hasTenant={hasTenant} />
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
          
          <div className="flex gap-2">
            <Link to={`/imoveis/editar/${id}`}>
              <Button
                variant="outline"
                className="text-xs px-2 py-1 h-8"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </Link>
            
            {isRental && !hasTenant && onAddTenant && (
              <Button 
                variant="outline" 
                className="text-xs px-2 py-1 h-8" 
                onClick={() => onAddTenant(id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Inquilino
              </Button>
            )}
            
            {onDelete && (
              <DeletePropertyDialog 
                onDelete={() => onDelete(id)}
                disabled={hasTenant}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
