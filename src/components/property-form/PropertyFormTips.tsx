
import React from 'react';

interface PropertyFormTipsProps {
  isEditing: boolean;
}

const PropertyFormTips = ({ isEditing }: PropertyFormTipsProps) => {
  return (
    <div className="bg-blue-50 p-6 rounded-lg h-full">
      <h3 className="text-lg font-medium mb-3">
        {isEditing ? 'Dicas para edição' : 'Dicas para cadastro'}
      </h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start">
          <span className="text-primary font-bold mr-2">•</span>
          <span>Inclua todas as informações do endereço, como rua, número, bairro, cidade e estado.</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary font-bold mr-2">•</span>
          <span>Verifique se o proprietário está corretamente identificado.</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary font-bold mr-2">•</span>
          <span>Selecione o tipo de imóvel que melhor representa a propriedade.</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary font-bold mr-2">•</span>
          <span>Defina se o imóvel é para venda ou aluguel.</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary font-bold mr-2">•</span>
          <span>Informe os valores corretos para facilitar a gestão financeira.</span>
        </li>
      </ul>
    </div>
  );
};

export default PropertyFormTips;
