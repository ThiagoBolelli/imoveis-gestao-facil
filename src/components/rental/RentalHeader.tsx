
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RentalHeaderProps {
  isSyncing: boolean;
  handleSyncData: () => Promise<void>;
  rentalPropertiesAvailable: number;
}

const RentalHeader = ({ isSyncing, handleSyncData, rentalPropertiesAvailable }: RentalHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 className="text-2xl font-bold mb-4 sm:mb-0">Aluguéis</h1>
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={handleSyncData}
          disabled={isSyncing}
          className="bg-background hover:bg-accent"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Dados'}
        </Button>
        
        <Button 
          onClick={() => navigate("/alugueis/adicionar")}
          className="bg-primary hover:bg-primary/90"
          disabled={rentalPropertiesAvailable === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Inquilino
        </Button>
      </div>
    </div>
  );
};

export default RentalHeader;
