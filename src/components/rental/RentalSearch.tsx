
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RentalSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RentalSearch = ({ searchQuery, setSearchQuery }: RentalSearchProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por inquilino, imóvel..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button 
          variant="outline"
          onClick={() => setSearchQuery('')}
        >
          <Filter className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default RentalSearch;
