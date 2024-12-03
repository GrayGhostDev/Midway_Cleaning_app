import { Card } from "@/components/ui/card"

interface ServicePackage {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  recommended?: boolean
}

const servicePackages: ServicePackage[] = [
  {
    id: "basic",
    name: "Basic Clean",
    description: "Essential cleaning service for your space",
    price: 99,
    features: [
      "General dusting and wiping",
      "Vacuum and mop floors",
      "Bathroom cleaning",
      "Kitchen surface cleaning"
    ]
  },
  {
    id: "premium",
    name: "Premium Clean",
    description: "Comprehensive cleaning with extra attention to detail",
    price: 199,
    features: [
      "All Basic Clean services",
      "Deep carpet cleaning",
      "Window washing",
      "Cabinet organization",
      "Appliance cleaning"
    ],
    recommended: true
  },
  {
    id: "deep",
    name: "Deep Clean",
    description: "Thorough deep cleaning for a complete refresh",
    price: 299,
    features: [
      "All Premium Clean services",
      "Wall washing",
      "Furniture deep cleaning",
      "Baseboard and trim cleaning",
      "Light fixture cleaning",
      "Air vent cleaning"
    ]
  }
]

export function ServicePackageSelector() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {servicePackages.map((pkg) => (
        <Card key={pkg.id} className={pkg.recommended ? "ring-2 ring-blue-500" : ""}>
          <Card.Header>
            <div className="flex justify-between items-start">
              <div>
                <Card.Title>{pkg.name}</Card.Title>
                <Card.Description>{pkg.description}</Card.Description>
              </div>
              {pkg.recommended && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Recommended
                </span>
              )}
            </div>
          </Card.Header>
          <Card.Content>
            <div className="mb-4">
              <span className="text-3xl font-bold">${pkg.price}</span>
              <span className="text-gray-500 ml-1">/service</span>
            </div>
            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Select Package
            </button>
          </Card.Content>
        </Card>
      ))}
    </div>
  )
}
