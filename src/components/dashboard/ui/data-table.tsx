import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T>({
  title,
  description,
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.accessorKey)}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : String(row[column.accessorKey])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
