export type PackageData = {
  carriers: Carrier[];
  packages: Package[];
  country_distance?: CountryDistance;
};

export type CountryDistance = {
  [countryKey: string]: DestCountryDistance;
};

export type DestCountryDistance = {
  [countryKey: string]: number;
};

export type Carrier = {
  code: string;
  delivery_promise: number;
  saturday_deliveries?: boolean;
  oversea_delay_threshold?: number;
};

export type Package = {
  id: number;
  carrier: string;
  shipping_date: string;
  origin_country?: string;
  destination_country?: string;
};
