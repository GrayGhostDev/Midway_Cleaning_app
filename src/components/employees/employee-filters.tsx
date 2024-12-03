import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeFiltersProps {
  role: string;
  status: string;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export function EmployeeFilters({
  role,
  status,
  onRoleChange,
  onStatusChange,
  onReset,
}: EmployeeFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-[200px]">
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="cleaner">Cleaner</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
