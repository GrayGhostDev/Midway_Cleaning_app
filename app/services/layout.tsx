import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Management",
  description: "Manage cleaning services and service packages",
};

const tabs = [
  { value: "services", label: "Services", href: "/services" },
  { value: "packages", label: "Packages", href: "/services/packages" },
  { value: "schedule", label: "Schedule", href: "/services/schedule" },
];

export default function ServicesLayout({
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