
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PropertyPriceFieldsProps {
  control: Control<any>;
  purpose: string;
  isEditing: boolean;
}

const PropertyPriceFields = ({ control, purpose, isEditing }: PropertyPriceFieldsProps) => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <h2 className="text-xl font-medium mb-4">Valores</h2>
      <p className="text-sm text-gray-500 mb-6">Informe os valores do imóvel</p>
      
      {purpose === 'Venda' && (
        <FormField
          control={control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor de Venda *</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <Input
                    type="number"
                    placeholder="0,00"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {purpose === 'Aluguel' && (
        <FormField
          control={control}
          name="rentalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Aluguel *</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                  <Input
                    type="number"
                    placeholder="0,00"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <Button type="submit" className="w-full mt-6">
        {isEditing ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
      </Button>
    </div>
  );
};

export default PropertyPriceFields;
