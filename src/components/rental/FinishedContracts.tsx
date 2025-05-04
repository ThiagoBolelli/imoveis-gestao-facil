
import { Property } from '@/services/googleSheetsService';

interface FinishedContractsProps {
  isLoading: boolean;
  tenants: any[];
  properties: Property[];
}

const FinishedContracts = ({ isLoading, tenants, properties }: FinishedContractsProps) => {
  const finishedTenants = tenants.filter(t => t.endDate);
  
  if (isLoading) {
    return <div className="text-center py-6">Carregando dados...</div>;
  }
  
  if (finishedTenants.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-500">
          Não há contratos finalizados para exibir.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imóvel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Término</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finishedTenants.map(tenant => {
              const property = properties.find(p => p.id === tenant.propertyId);
              return (
                <tr key={tenant.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{tenant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property?.address || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tenant.startDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.endDate && new Date(tenant.endDate).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinishedContracts;
