
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TenantForm from '@/components/TenantForm';
import { GoogleSheetsService, Property } from '@/services/googleSheetsService';
import { toast } from '@/components/ui/sonner';
import { getCurrentMonth } from '@/lib/utils';

const AddTenant = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const propertyId = searchParams.get('propertyId');
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await GoogleSheetsService.getProperties();
        // Filtrar apenas imóveis para aluguel
        setProperties(data.filter(p => p.purpose === 'Aluguel'));
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        toast.error("Erro ao buscar imóveis. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const handleSubmit = async (data: any) => {
    try {
      // Adicionar o inquilino
      const tenant = await GoogleSheetsService.addTenant(data);
      
      // Adicionar pagamento para o mês atual
      const currentMonth = getCurrentMonth() + ' ' + new Date().getFullYear();
      await GoogleSheetsService.addPayment({
        tenantId: tenant.id,
        month: currentMonth,
        amount: tenant.monthlyRent,
        status: 'Não Pago',
        paymentDate: '',
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
  
  if (properties.length === 0) {
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
    properties={properties} 
    preSelectedPropertyId={propertyId || undefined} 
  />;
};

export default AddTenant;
