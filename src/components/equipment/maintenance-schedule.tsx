import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/dashboard/ui/data-table';
import { Calendar } from '@/components/ui/calendar';

interface MaintenanceTask {
  id: string;
  equipmentName: string;
  taskDescription: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo: string;
}

const columns = [
  {
    header: 'Equipment',
    accessorKey: 'equipmentName',
  },
  {
    header: 'Task',
    accessorKey: 'taskDescription',
  },
  {
    header: 'Due Date',
    accessorKey: 'dueDate',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (value: string) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'completed'
            ? 'bg-green-100 text-green-800'
            : value === 'overdue'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    header: 'Assigned To',
    accessorKey: 'assignedTo',
  },
];

export function MaintenanceSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      equipmentName: 'Vacuum Cleaner A1',
      taskDescription: 'Filter replacement',
      dueDate: '2024-02-15',
      status: 'pending',
      assignedTo: 'John Doe',
    },
    {
      id: '2',
      equipmentName: 'Floor Scrubber B2',
      taskDescription: 'Motor inspection',
      dueDate: '2024-02-10',
      status: 'completed',
      assignedTo: 'Jane Smith',
    },
    // Add more tasks as needed
  ]);

  const filteredTasks = selectedDate
    ? tasks.filter((task) => task.dueDate === selectedDate.toISOString().split('T')[0])
    : tasks;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {tasks.filter((t) => t.status === 'overdue').length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Maintenance Tasks"
        description="View and manage equipment maintenance tasks"
        columns={columns}
        data={filteredTasks}
      />

      <div className="flex justify-end">
        <Button>Schedule New Task</Button>
      </div>
    </div>
  );
}
