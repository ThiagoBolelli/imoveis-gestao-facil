
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TenantForm from '@/components/TenantForm';
import { toast } from '@/components/ui/sonner';
import { useSupabaseProperties } from '@/hooks/useSupabaseProperties';
import { useSupabaseTenants } from '@/hooks/useSupabaseTenants';
import { useSupabasePayments } from '@/hooks/useSupabasePayments';

const AddTenant = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { properties, isLoading: propertiesLoading } = useSupabaseProperties();
  const { addTenant } = useSupabaseTenants();
  const { addPayment } = useSupabasePayments();
  const [isLoading, setIsLoading] = useState(true);
  const propertyId = searchParams.get('propertyId');
  
  useEffect(() => {
    // Wait for properties to load
    if (!propertiesLoading) {
      setIsLoading(false);
    }
  }, [propertiesLoading]);
  
  const handleSubmit = async (data: any) => {
    try {
      // Adicionar o inquilino
      const tenantData = await addTenant(data);
      
      // Get property for rent value
      const property = properties.find(p => p.id === data.propertyId);
      if (!property) {
        throw new Error('Propriedade não encontrada');
      }

      // Adicionar pagamento para o mês atual
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const currentYear = currentDate.getFullYear();
      
      await addPayment({
        tenantId: tenantData.id,
        propertyId: data.propertyId,
        amount: property.rentalPrice,
        dueDate: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${data.dueDate.toString().padStart(2, '0')}`,
        month: currentMonth.toString(),
        year: currentYear
      });
      
      toast.success("Inquilino adicionado com sucesso!");
      navigate("/alugueis");
    } catch (error) {
      console.error('Erro ao adicionar inquilino:', error);
      toast.error("Erro ao adicionar inquilino. Tente novamente.");
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  // Filtrar apenas propriedades para aluguel
  const rentalProperties = properties.filter(p => p.purpose === 'Aluguel');
  
  if (rentalProperties.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Adicionar Inquilino</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-4">
            Não há imóveis disponíveis para aluguel. Adicione um imóvel para aluguel primeiro.
          </p>
          <button
            onClick={() => navigate('/imoveis/adicionar')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Adicionar Imóvel para Aluguel
          </button>
        </div>
      </div>
    );
  }
  
  return <TenantForm 
    onSubmit={handleSubmit} 
    properties={rentalProperties} 
    preSelectedPropertyId={propertyId || undefined} 
  />;
};

export default AddTenant;
