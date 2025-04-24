
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { Property } from '@/services/googleSheetsService';
import { formatCurrency } from '@/lib/utils';

const tenantSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  dueDate: z.string().min(1, { message: 'Dia de vencimento é obrigatório' }),
  propertyId: z.string().min(1, { message: 'Imóvel é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  onSubmit: (data: any) => void;
  properties: Property[];
  preSelectedPropertyId?: string;
}

const TenantForm = ({ onSubmit, properties, preSelectedPropertyId }: TenantFormProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      dueDate: '',
      propertyId: preSelectedPropertyId || '',
      email: '',
      phone: '',
    },
  });
  
  useEffect(() => {
    if (preSelectedPropertyId) {
      const property = properties.find(p => p.id === preSelectedPropertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [preSelectedPropertyId, properties]);
  
  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    setSelectedProperty(property || null);
    form.setValue('propertyId', propertyId);
  };
  
  const handleFormSubmit = (data: TenantFormValues) => {
    if (!selectedProperty) return;
    
    const tenantData = {
      ...data,
      dueDate: parseInt(data.dueDate),
      monthlyRent: selectedProperty.rentalPrice,
    };
    
    onSubmit(tenantData);
    
    toast.success("Inquilino cadastrado com sucesso!");
    form.reset();
  };
  
  // Filtrar apenas propriedades para aluguel
  const rentalProperties = properties.filter(p => p.purpose === 'Aluguel');
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link to="/alugueis" className="flex items-center text-gray-600 hover:text-primary mr-4">
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar</span>
        </Link>
        <h1 className="text-2xl font-bold">Adicionar Inquilino</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium mb-4">Informações do Inquilino</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Inquilino *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@exemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de Vencimento do Aluguel *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="Dia do mês"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imóvel *</FormLabel>
                      <Select
                        onValueChange={handlePropertyChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um imóvel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rentalProperties.length > 0 ? (
                            rentalProperties.map((property) => (
                              <SelectItem key={property.id} value={property.id}>
                                {property.address} - {property.type}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-properties-available" disabled>
                              Nenhum imóvel para aluguel disponível
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={rentalProperties.length === 0}
                >
                  Cadastrar Inquilino
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium mb-4">Imóvel Selecionado</h2>
            
            {selectedProperty ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Endereço</h3>
                  <p className="text-gray-600">{selectedProperty.address}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Tipo</h3>
                  <p className="text-gray-600">{selectedProperty.type}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Proprietário</h3>
                  <p className="text-gray-600">{selectedProperty.owner}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700">Valor do Aluguel</h3>
                  <p className="text-primary font-bold text-xl">
                    {formatCurrency(selectedProperty.rentalPrice)}
                    <span className="text-sm font-normal text-gray-500">/mês</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Selecione um imóvel para ver suas informações</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantForm;
