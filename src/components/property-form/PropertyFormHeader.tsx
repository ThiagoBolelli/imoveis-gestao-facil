
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyFormHeaderProps {
  isEditing: boolean;
}

const PropertyFormHeader = ({ isEditing }: PropertyFormHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <Link to="/imoveis" className="flex items-center text-gray-600 hover:text-primary mr-4">
        <ArrowLeft size={20} className="mr-1" />
        <span>Voltar</span>
      </Link>
      <h1 className="text-2xl font-bold">{isEditing ? 'Editar Imóvel' : 'Adicionar Imóvel'}</h1>
    </div>
  );
};

export default PropertyFormHeader;
