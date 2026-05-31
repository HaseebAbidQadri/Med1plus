/**
 * Data structures for MedOne+ Pharmacy
 */

export interface CategoryItem {
  id: string;
  name: string;
  productCount: string;
  iconName: string; // Used to look up Lucide icons
  color?: string;
  description?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color?: string;
}

export interface StatItem {
  value: string;
  label: string;
  iconName: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

