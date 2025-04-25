
import { Badge } from '@/components/ui/badge';

interface PropertyStatusProps {
  isRental: boolean;
  hasTenant: boolean;
}

export const PropertyStatus = ({ isRental, hasTenant }: PropertyStatusProps) => {
  const getBadgeClass = () => {
    if (isRental) {
      return hasTenant ? 'bg-green-500' : 'bg-blue-500';
    }
    return 'bg-purple-500';
  };

  const getStatusText = () => {
    if (isRental) {
      return hasTenant ? 'ALUGADO' : 'Aluguel';
    }
    return 'Venda';
  };

  return (
    <Badge className={`absolute top-2 right-2 ${getBadgeClass()}`}>
      {getStatusText()}
    </Badge>
  );
};
