// Mock data for development and testing
export const mockServices = [
  {
    id: 1,
    name: "Deep Cleaning",
    description: "Comprehensive cleaning service for all areas",
    category: "regular",
    duration: "4 hours",
    rate: 120,
    rateUnit: "hour",
    staffRequired: 2,
    status: "Active",
    utilization: 85,
    lastUpdated: "2024-03-15",
    requirements: {
      equipment: ["vacuum", "mop", "cleaning solutions"],
      supplies: ["cleaning cloths", "disinfectants"],
      certifications: ["basic cleaning"],
    },
  },
  {
    id: 2,
    name: "Maintenance Cleaning",
    description: "Regular maintenance cleaning service",
    category: "regular",
    duration: "2 hours",
    rate: 80,
    rateUnit: "hour",
    staffRequired: 1,
    status: "Active",
    utilization: 92,
    lastUpdated: "2024-03-14",
    requirements: {
      equipment: ["vacuum", "mop"],
      supplies: ["cleaning cloths"],
      certifications: ["basic cleaning"],
    },
  },
];

export const mockServicePackages = [
  {
    id: 1,
    name: "Premium Package",
    services: [
      { serviceId: 1, frequency: "weekly" },
      { serviceId: 2, frequency: "daily" },
    ],
    pricing: {
      monthly: 2000,
      quarterly: 5700,
      annual: 22000,
    },
    discounts: [
      {
        type: "annual",
        value: 10,
        conditions: "Annual subscription required",
      },
    ],
  },
];

export const mockBookings = [
  {
    id: 1,
    service: "Deep Cleaning",
    client: {
      name: "Tech Corp",
      image: "https://i.pravatar.cc/150?u=tech",
    },
    time: "09:00 AM",
    duration: "3 hours",
    location: "Downtown Office",
    staff: 2,
    status: "Scheduled",
  },
  {
    id: 2,
    service: "Regular Maintenance",
    client: {
      name: "Medical Center",
      image: "https://i.pravatar.cc/150?u=medical",
    },
    time: "02:00 PM",
    duration: "2 hours",
    location: "Medical Center",
    staff: 1,
    status: "In Progress",
  },
];