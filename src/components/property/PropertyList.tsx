
import { Building } from 'lucide-react';
import { Property } from '@/services/googleSheetsService';
import PropertyCard from '@/components/PropertyCard';

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  hasTenant: (propertyId: string) => boolean;
  onAddTenant: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
}

const PropertyList = ({ 
  properties, 
  isLoading, 
  hasTenant, 
  onAddTenant, 
  onDelete 
}: PropertyListProps) => {
  if (isLoading) {
    return <div className="text-center py-12">Carregando imóveis...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-600">Nenhum imóvel encontrado</h3>
        <p className="text-gray-500 mt-2">
          Tente ajustar os filtros de busca ou adicione um novo imóvel
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          hasTenant={hasTenant(property.id)}
          onAddTenant={property.purpose === 'Aluguel' && !hasTenant(property.id) ? onAddTenant : undefined}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PropertyList;
