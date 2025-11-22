export interface LineItem {
    category: string;
    description: string;
    xactimateCode?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
    notes?: string;
}

export interface ScopeData {
    summary: string;
    material: string;
    damage: string[];
    lineItems: LineItem[];
}
