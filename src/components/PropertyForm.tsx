
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { propertySchema, PropertyFormValues } from './property-form/PropertyFormSchema';
import PropertyFormHeader from './property-form/PropertyFormHeader';
import PropertyGeneralInfoFields from './property-form/PropertyGeneralInfoFields';
import PropertyPriceFields from './property-form/PropertyPriceFields';
import PropertyFormTips from './property-form/PropertyFormTips';

interface PropertyFormProps {
  onSubmit: (data: any) => void;
  initialData?: PropertyFormValues;
  isEditing?: boolean;
}

const PropertyForm = ({ onSubmit, initialData, isEditing = false }: PropertyFormProps) => {
  const [purpose, setPurpose] = useState<string>(initialData?.purpose || '');
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      address: '',
      purpose: '',
      owner: '',
      type: '',
      salePrice: '',
      rentalPrice: '',
      description: '',
    },
  });
  
  useEffect(() => {
    if (initialData && initialData.purpose) {
      setPurpose(initialData.purpose);
    }
  }, [initialData]);
  
  const handlePurposeChange = (value: string) => {
    setPurpose(value);
    form.setValue('purpose', value);
  };
  
  const handleFormSubmit = (data: PropertyFormValues) => {
    // Converter valores para números
    const formattedData = {
      ...data,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : 0,
      rentalPrice: data.rentalPrice ? parseFloat(data.rentalPrice) : 0,
    };
    
    onSubmit(formattedData);
    
    if (!isEditing) {
      form.reset();
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <PropertyFormHeader isEditing={isEditing} />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-medium mb-4">Informações Gerais</h2>
            <p className="text-sm text-gray-500 mb-6">Informe os dados básicos do imóvel</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <PropertyGeneralInfoFields 
                  control={form.control} 
                  onPurposeChange={handlePurposeChange} 
                />
              
                <PropertyPriceFields 
                  control={form.control} 
                  purpose={purpose} 
                  isEditing={isEditing}
                />
              </form>
            </Form>
          </div>
          
          <div className="hidden lg:block">
            <PropertyFormTips isEditing={isEditing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
