import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/dashboard/ui/data-table';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'role',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ value }: { value: string }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {value}
      </span>
    ),
  },
];

export function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Cleaner',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Supervisor',
      status: 'active',
    },
    // Add more employees as needed
  ]);

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee List</CardTitle>
        <CardDescription>View and manage employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
            </div>
            <Button>Add Employee</Button>
          </div>

          <DataTable
            title="Employees"
            description="Manage your employees and their roles"
            columns={columns}
            data={filteredEmployees}
          />
        </div>
      </CardContent>
    </Card>
  );
}
