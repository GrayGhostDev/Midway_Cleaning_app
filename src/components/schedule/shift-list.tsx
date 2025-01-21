'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddShiftDialog } from './add-shift-dialog';
import { format } from 'date-fns';

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  location: string;
  type: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

interface ShiftListProps {
  selectedDate: Date;
}

export function ShiftList({ selectedDate }: ShiftListProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddShift = (shiftData: {
    employeeId: string;
    location: string;
    type: string;
    startTime: string;
    endTime: string;
  }) => {
    const newShift: Shift = {
      id: (shifts.length + 1).toString(),
      employeeId: shiftData.employeeId,
      employeeName: 'John Doe', // This should come from your employee data
      location: shiftData.location,
      type: shiftData.type,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      status: 'Scheduled',
    };
    setShifts((prev) => [...prev, newShift]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shifts</CardTitle>
        <CardDescription>View and manage cleaning shifts</CardDescription>
      </CardHeader>
      <CardContent>
        {shifts.length > 0 ? (
          <div className="space-y-4">
            {shifts.map((shift) => (
              <Card key={shift.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{shift.employeeName}</h3>
                    <p className="text-sm text-muted-foreground">{shift.location}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {shift.startTime} - {shift.endTime}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {shift.type}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {shift.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No shifts scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setDialogOpen(true)}>Add Shift</Button>
      </CardFooter>

      <AddShiftDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        onAdd={handleAddShift}
      />
    </Card>
  )
}
