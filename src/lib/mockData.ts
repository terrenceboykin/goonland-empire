export interface LineItem {
    id: string;
    category: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
    notes?: string;
}

export interface Scope {
    jobId: string;
    customerName: string;
    address: string;
    date: string;
    summary: {
        total: number;
        subtotal: number;
        tax: number;
        overheadProfit: number;
    };
    items: LineItem[];
}

export const mockScope: Scope = {
    jobId: "ODB-2025-001",
    customerName: "Danny Flanagan",
    address: "1234 W Addison St, Chicago, IL 60613",
    date: new Date().toLocaleDateString(),
    summary: {
        subtotal: 28450.00,
        tax: 0.00, // Labor often non-taxable, simplified for demo
        overheadProfit: 5690.00, // 20% O&P
        total: 34140.00,
    },
    items: [
        {
            id: "1",
            category: "Roofing",
            description: "Tear off, haul off, and dispose of comp. shingles - Laminated",
            quantity: 42.00,
            unit: "SQ",
            unitPrice: 95.00,
            total: 3990.00,
            notes: "Includes 2 layers felt"
        },
        {
            id: "2",
            category: "Roofing",
            description: "Laminated - High Grade - shingle - w/ felt (GAF Timberline HDZ)",
            quantity: 45.00, // 10% waste
            unit: "SQ",
            unitPrice: 345.00,
            total: 15525.00,
            notes: "Color: Charcoal. Includes GAF System Plus Warranty."
        },
        {
            id: "3",
            category: "Roofing",
            description: "Ice & Water Shield (2 rows at eaves + valleys)",
            quantity: 950.00,
            unit: "SF",
            unitPrice: 2.25,
            total: 2137.50,
            notes: "Chicago Code Requirement"
        },
        {
            id: "4",
            category: "Roofing",
            description: "Drip edge - aluminum",
            quantity: 380.00,
            unit: "LF",
            unitPrice: 4.50,
            total: 1710.00,
        },
        {
            id: "5",
            category: "Roofing",
            description: "R&R Flashing - pipe jack - lead",
            quantity: 4.00,
            unit: "EA",
            unitPrice: 125.00,
            total: 500.00,
        },
        {
            id: "6",
            category: "Roofing",
            description: "R&R Chimney flashing - large (32\" x 32\")",
            quantity: 1.00,
            unit: "EA",
            unitPrice: 450.00,
            total: 450.00,
        },
        {
            id: "7",
            category: "Roofing",
            description: "Ridge Cap - High Profile (GAF Timbertex)",
            quantity: 110.00,
            unit: "LF",
            unitPrice: 12.50,
            total: 1375.00,
        },
        {
            id: "8",
            category: "Permits & Fees",
            description: "Building Permit - City of Chicago",
            quantity: 1.00,
            unit: "EA",
            unitPrice: 450.00,
            total: 450.00,
        },
        {
            id: "9",
            category: "General",
            description: "Dumpster - 30 yard roll-off",
            quantity: 1.00,
            unit: "EA",
            unitPrice: 650.00,
            total: 650.00,
        },
        {
            id: "10",
            category: "General",
            description: "Temporary Toilet",
            quantity: 1.00,
            unit: "MO",
            unitPrice: 185.00,
            total: 185.00,
        },
        {
            id: "11",
            category: "General",
            description: "Final Cleaning - Magnet sweep & gutter clean",
            quantity: 1.00,
            unit: "EA",
            unitPrice: 350.00,
            total: 350.00,
        }
    ]
};
