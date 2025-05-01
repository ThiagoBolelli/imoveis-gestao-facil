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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';

const propertySchema = z.object({
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
  purpose: z.string().min(1, { message: 'Finalidade é obrigatória' }),
  owner: z.string().min(1, { message: 'Proprietário é obrigatório' }),
  type: z.string().min(1, { message: 'Tipo de imóvel é obrigatório' }),
  salePrice: z.string().optional(),
  rentalPrice: z.string().optional(),
  description: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

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
      <div className="flex items-center mb-6">
        <Link to="/imoveis" className="flex items-center text-gray-600 hover:text-primary mr-4">
          <ArrowLeft size={20} className="mr-1" />
          <span>Voltar</span>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Editar Imóvel' : 'Adicionar Imóvel'}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-medium mb-4">Informações Gerais</h2>
            <p className="text-sm text-gray-500 mb-6">Informe os dados básicos do imóvel</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Rua, número, bairro, cidade, estado"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proprietário *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do proprietário"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do Imóvel *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="KITNET">KITNET</SelectItem>
                          <SelectItem value="Propriedade Rural">Propriedade Rural</SelectItem>
                          <SelectItem value="Terreno">Terreno</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finalidade *</FormLabel>
                      <Select
                        onValueChange={(value) => handlePurposeChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a finalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Aluguel">Aluguel</SelectItem>
                          <SelectItem value="Venda">Venda</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição do imóvel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Valores</h2>
                  <p className="text-sm text-gray-500 mb-6">Informe os valores do imóvel</p>
                  
                  {purpose === 'Venda' && (
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
              </form>
            </Form>
          </div>
          
          <div className="hidden lg:block">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
