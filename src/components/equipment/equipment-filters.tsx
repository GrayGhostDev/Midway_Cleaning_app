import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EquipmentFiltersProps {
  type?: string;
  status?: string;
  onTypeChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onReset?: () => void;
}

export function EquipmentFilters({
  type = '',
  status = '',
  onTypeChange = () => {},
  onStatusChange = () => {},
  onReset = () => {},
}: EquipmentFiltersProps) {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-[200px]">
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="vacuum">Vacuum</SelectItem>
                <SelectItem value="scrubber">Scrubber</SelectItem>
                <SelectItem value="mop">Mop</SelectItem>
                <SelectItem value="buffer">Buffer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[200px]">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={onReset}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}
