
import { useState, useEffect } from 'react';
import { Property } from '@/services/googleSheetsService';

export const usePropertyFilters = (properties: Property[]) => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    let results = properties;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        property => 
          property.address.toLowerCase().includes(query) || 
          property.owner.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query)
      );
    }
    
    if (purposeFilter && purposeFilter !== 'all') {
      results = results.filter(property => property.purpose === purposeFilter);
    }
    
    if (typeFilter && typeFilter !== 'all') {
      results = results.filter(property => property.type === typeFilter);
    }
    
    setFilteredProperties(results);
  }, [searchQuery, purposeFilter, typeFilter, properties]);

  const resetFilters = () => {
    setSearchQuery('');
    setPurposeFilter('all');
    setTypeFilter('all');
  };

  return {
    filteredProperties,
    searchQuery,
    setSearchQuery,
    purposeFilter,
    setPurposeFilter,
    typeFilter,
    setTypeFilter,
    resetFilters
  };
};
