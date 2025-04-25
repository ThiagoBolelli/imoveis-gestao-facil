
import { Building, House, LandPlot } from 'lucide-react';

interface PropertyIconProps {
  type: string;
}

export const PropertyIcon = ({ type }: PropertyIconProps) => {
  switch (type.toLowerCase()) {
    case 'casa':
      return <House className="h-5 w-5" />;
    case 'apartamento':
    case 'kitnet':
      return <Building className="h-5 w-5" />;
    case 'propriedade rural':
    case 'terreno':
      return <LandPlot className="h-5 w-5" />;
    default:
      return <Building className="h-5 w-5" />;
  }
};
