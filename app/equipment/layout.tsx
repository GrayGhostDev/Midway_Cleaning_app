import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Equipment Management",
  description: "Manage cleaning equipment and maintenance schedules",
};

const tabs = [
  { value: "overview", label: "Overview", href: "/equipment" },
  { value: "maintenance", label: "Maintenance", href: "/equipment/maintenance" },
];

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className="border-b-2 border-transparent px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}