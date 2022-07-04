export interface City {
  name: string;
  code: string;
  countryCode: string;
  macCode?: string;
}

export interface Airport {
  countryName: string;
  iataCode: string;
  name: string;
  seoName: string;
  city: City;
}

export interface Price {
  value: number;
  valueMainUnit: string;
  valueFractionalUnit: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface Bound {
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureDate: Date;
  arrivalDate: Date;
  price: Price;
  flightKey: string;
  flightNumber: string;
  sellKey: string;
  previousPrice: null;
  priceUpdated: number;
}

export interface Summary {
  price: Price;
  previousPrice: null;
  newRoute: boolean;
  tripDurationDays: number;
}

export interface Fare {
  outbound: Bound;
  inbound: Bound;
  summary: Summary;
}

export interface FaresResponse {
  arrivalAirportCategories: null;
  fares: Fare[];
  nextPage: null;
  size: number;
}

export interface Trip {
  destination: {
    country: string;
    airport: string;
    city: string;
  }

  outbound: {
    date: Date;
    flightNumber: string;
  }

  inbound: {
    date: Date;
    flightNumber: string;
  }

  price: {
    value: number;
    currency: string;
  }

  tripDurationDays: number;
}
