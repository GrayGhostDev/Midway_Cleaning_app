import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InventoryFiltersProps {
  category: string;
  stockStatus: string;
  onCategoryChange: (value: string) => void;
  onStockStatusChange: (value: string) => void;
  onReset: () => void;
}

export function InventoryFilters({
  category,
  stockStatus,
  onCategoryChange,
  onStockStatusChange,
  onReset,
}: InventoryFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-[200px]">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="cleaning-solutions">Cleaning Solutions</SelectItem>
            <SelectItem value="cleaning-supplies">Cleaning Supplies</SelectItem>
            <SelectItem value="paper-products">Paper Products</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-[200px]">
        <Select value={stockStatus} onValueChange={onStockStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by stock status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
