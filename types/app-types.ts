export interface PropertyAddType {
  name: string;
  type: string;
  description: string;
  location: Location;
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates: Rates;
  seller_info: SellerInfo;
  images: string[];
}

export interface PropertyType extends PropertyAddType {
  id: string;
  owner: string;
  is_featured: boolean;
  createdAt: string;
}

export interface Location {
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export interface Rates {
  weekly?: number;
  monthly?: number;
  nightly?: number;
}

export interface SellerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface MessageType {
  id: string;
  sender: string | { username: string };
  recipient: string;
  property: string | Partial<PropertyType>;
  name: string;
  email: string;
  phone?: string;
  msgBody?: string;
  read?: boolean;
  createdAt?: string;
}
