
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, AlertTriangle, CircleDollarSign, Building, KeyRound, LandPlot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { GoogleSheetsService, Property, Payment, Tenant } from '@/services/googleSheetsService';

// Componente de card de estatísticas
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  subtitle = null,
  subtitleValue = null 
}: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string | null;
  subtitleValue?: string | number | null;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {subtitle && subtitleValue && (
            <p className="text-xs text-gray-500 mt-1">
              {subtitle}: {subtitleValue}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Componente de item de propriedade
const PropertyItem = ({ 
  icon, 
  type, 
  address, 
  price, 
  isRental = false 
}: { 
  icon: React.ReactNode;
  type: string;
  address: string;
  price: number;
  isRental?: boolean;
}) => {
  return (
    <div className="flex items-center space-x-3 py-3">
      <div className="bg-blue-50 p-2 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{type}</h4>
        <p className="text-sm text-gray-500 line-clamp-1">{address}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatCurrency(price)}</p>
        {isRental && <span className="text-xs text-gray-500">/mês</span>}
      </div>
    </div>
  );
};

// Componente de item de pagamento
const PaymentItem = ({ 
  tenant, 
  dueDate, 
  amount 
}: { 
  tenant: string;
  dueDate: string;
  amount: number;
}) => {
  return (
    <div className="flex items-center space-x-3 py-3">
      <div className="bg-red-50 p-2 rounded-lg">
        <Users className="h-5 w-5 text-red-500" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{tenant}</h4>
        <p className="text-sm text-gray-500">Vence em: {dueDate}</p>
      </div>
      <div className="font-medium">{formatCurrency(amount)}</div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, paymentsData, tenantsData] = await Promise.all([
          GoogleSheetsService.getProperties(),
          GoogleSheetsService.getPayments(),
          GoogleSheetsService.getTenants(),
        ]);
        
        setProperties(propertiesData);
        setPayments(paymentsData);
        setTenants(tenantsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  // Cálculo de estatísticas
  const totalProperties = properties.length;
  const propertiesForSale = properties.filter(p => p.purpose === 'Venda').length;
  const propertiesForRent = properties.filter(p => p.purpose === 'Aluguel').length;
  
  const totalTenants = tenants.length;
  const occupancyRate = totalProperties > 0 
    ? Math.round((totalTenants / propertiesForRent) * 100) 
    : 0;
  
  const pendingPayments = payments.filter(p => p.status === 'Não Pago');
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPortfolioValue = properties.reduce((sum, property) => {
    return sum + (property.purpose === 'Venda' ? property.salePrice : 0);
  }, 0);
  
  const monthlyRentalIncome = properties
    .filter(p => p.purpose === 'Aluguel')
    .reduce((sum, property) => sum + property.rentalPrice, 0);
  
  // Ordenar propriedades mais recentes (simulação, na prática seriam as últimas adicionadas)
  const recentProperties = [...properties].slice(0, 5);
  
  // Próximos pagamentos (simulação)
  const upcomingPayments = pendingPayments.slice(0, 3);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        
        <Button 
          onClick={() => navigate("/imoveis/adicionar")}
          className="bg-primary hover:bg-primary/90"
        >
          <Building className="mr-2 h-4 w-4" />
          Adicionar Imóvel
        </Button>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total de Imóveis"
          value={totalProperties}
          icon={<Building className="h-6 w-6 text-primary" />}
          subtitle="Para aluguel"
          subtitleValue={`${propertiesForRent} | Para venda: ${propertiesForSale}`}
        />
        
        <StatsCard
          title="Inquilinos"
          value={totalTenants}
          icon={<Users className="h-6 w-6 text-primary" />}
          subtitle="Taxa de ocupação"
          subtitleValue={`${occupancyRate}%`}
        />
        
        <StatsCard
          title="Pagamentos Pendentes"
          value={pendingPayments.length}
          icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
          subtitle="Valor total"
          subtitleValue={formatCurrency(pendingAmount)}
        />
        
        <StatsCard
          title="Valor do Portfólio"
          value={formatCurrency(totalPortfolioValue)}
          icon={<CircleDollarSign className="h-6 w-6 text-green-600" />}
          subtitle="Renda mensal de aluguéis"
          subtitleValue={formatCurrency(monthlyRentalIncome)}
        />
      </div>
      
      {/* Seções de imóveis e pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imóveis recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Imóveis Recentes</h2>
            <Button
              variant="link"
              onClick={() => navigate("/imoveis")}
              className="text-primary p-0 h-auto"
            >
              Ver todos
            </Button>
          </div>
          
          <div className="space-y-1 divide-y">
            {recentProperties.map(property => {
              const isRental = property.purpose === 'Aluguel';
              let icon;
              
              switch (property.type.toLowerCase()) {
                case 'casa':
                  icon = <Home className="h-5 w-5 text-blue-500" />;
                  break;
                case 'apartamento':
                  icon = <Building className="h-5 w-5 text-blue-500" />;
                  break;
                case 'kitnet':
                  icon = <KeyRound className="h-5 w-5 text-blue-500" />;
                  break;
                case 'terreno':
                case 'propriedade rural':
                  icon = <LandPlot className="h-5 w-5 text-blue-500" />;
                  break;
                default:
                  icon = <Building className="h-5 w-5 text-blue-500" />;
              }
              
              return (
                <PropertyItem
                  key={property.id}
                  icon={icon}
                  type={property.type}
                  address={property.address}
                  price={isRental ? property.rentalPrice : property.salePrice}
                  isRental={isRental}
                />
              );
            })}
            
            {recentProperties.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                Nenhum imóvel cadastrado
              </p>
            )}
          </div>
        </div>
        
        {/* Próximos pagamentos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Próximos Pagamentos</h2>
            <Button
              variant="link"
              onClick={() => navigate("/alugueis")}
              className="text-primary p-0 h-auto"
            >
              Ver todos
            </Button>
          </div>
          
          <div className="space-y-1 divide-y">
            {upcomingPayments.map(payment => {
              // Encontrar o inquilino correspondente
              const tenant = tenants.find(t => t.id === payment.tenantId);
              if (!tenant) return null;
              
              return (
                <PaymentItem
                  key={payment.id}
                  tenant={tenant.name}
                  dueDate={`Dia ${tenant.dueDate}`}
                  amount={payment.amount}
                />
              );
            })}
            
            {upcomingPayments.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                Nenhum pagamento pendente
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
