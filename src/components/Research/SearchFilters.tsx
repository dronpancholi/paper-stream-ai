import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface SearchFiltersType {
  author?: string;
  year?: string;
  domain?: string;
  source?: string;
  minCitations?: number;
  maxResults?: number;
}

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onChange: (filters: SearchFiltersType) => void;
}

export const SearchFilters = ({ filters, onChange }: SearchFiltersProps) => {
  const domains = [
    'Computer Science', 'Medicine', 'Physics', 'Biology', 'Chemistry', 
    'Mathematics', 'Engineering', 'Psychology', 'Economics', 'Environmental Science'
  ];

  const sources = ['arXiv', 'PubMed', 'CrossRef', 'Semantic Scholar', 'CORE'];

  const updateFilter = (key: keyof SearchFiltersType, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof SearchFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onChange(newFilters);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Author name"
              value={filters.author || ''}
              onChange={(e) => updateFilter('author', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="2024"
              value={filters.year || ''}
              onChange={(e) => updateFilter('year', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Select onValueChange={(value) => updateFilter('domain', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select onValueChange={(value) => updateFilter('source', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="citations">Min Citations</Label>
            <Input
              id="citations"
              type="number"
              placeholder="10"
              value={filters.minCitations || ''}
              onChange={(e) => updateFilter('minCitations', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {Object.entries(filters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="gap-1">
                {key}: {value}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeFilter(key as keyof SearchFiltersType)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};