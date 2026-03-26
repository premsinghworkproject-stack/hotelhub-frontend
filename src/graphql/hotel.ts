import { gql } from '@apollo/client';

// Enums matching backend
export enum MealPlan {
  NONE = 'NONE',
  BREAKFAST_ONLY = 'BREAKFAST_ONLY',
  BREAKFAST_LUNCH = 'BREAKFAST_LUNCH',
  BREAKFAST_LUNCH_DINNER = 'BREAKFAST_LUNCH_DINNER',
  ALL_MEALS = 'ALL_MEALS'
}

export enum PropertyType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  GUEST_HOUSE = 'GUEST_HOUSE',
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA'
}

// GraphQL Queries
export const SEARCH_HOTELS_QUERY = gql`
  query SearchHotels($input: SearchHotelsInput!) {
    searchHotels(input: $input) {
      id
      name
      address
      city
      state
      country
      postalCode
      latitude
      longitude
      phone
      email
      website
      description
      mealPlan
      propertyType
      checkInTime
      checkOutTime
      cancellationPolicy
      petPolicy
      parkingInfo
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_HOTELS_QUERY = gql`
  query GetHotels($limit: Int, $offset: Int) {
    hotels(limit: $limit, offset: $offset) {
      id
      name
      address
      city
      state
      country
      postalCode
      latitude
      longitude
      phone
      email
      website
      description
      mealPlan
      propertyType
      checkInTime
      checkOutTime
      cancellationPolicy
      petPolicy
      parkingInfo
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_HOTEL_BY_ID_QUERY = gql`
  query GetHotelById($id: Int!) {
    hotel(id: $id) {
      id
      name
      address
      city
      state
      country
      postalCode
      latitude
      longitude
      phone
      email
      website
      description
      mealPlan
      propertyType
      checkInTime
      checkOutTime
      cancellationPolicy
      petPolicy
      parkingInfo
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`;

export const GET_HOTEL_COUNT_QUERY = gql`
  query GetHotelCount {
    hotelCount
  }
`;

export const SEARCH_NEARBY_QUERY = gql`
  query SearchNearby($latitude: Number!, $longitude: Number!, $radiusKm: Int) {
    searchNearby(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm) {
      id
      name
      address
      city
      state
      country
      postalCode
      latitude
      longitude
      phone
      email
      website
      description
      mealPlan
      propertyType
      checkInTime
      checkOutTime
      cancellationPolicy
      petPolicy
      parkingInfo
      isActive
      isVerified
      createdAt
      updatedAt
    }
  }
`;

// TypeScript interfaces
export interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  mealPlan?: MealPlan;
  propertyType?: PropertyType;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  petPolicy?: string;
  parkingInfo?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHotelsInput {
  searchQuery?: string;
  city?: string;
  state?: string;
  country?: string;
  minRating?: number;
  maxRating?: number;
  minPrice?: number;
  maxPrice?: number;
  mealPlan?: MealPlan;
  propertyType?: PropertyType;
  amenities?: string[];
  adults?: number;
  children?: number;
  checkInDate?: string;
  checkOutDate?: string;
  limit?: number;
  offset?: number;
}

export interface GetHotelsInput {
  limit?: number;
  offset?: number;
}

export interface SearchNearbyInput {
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export interface HotelSearchResponse {
  searchHotels: Hotel[];
}

export interface HotelsResponse {
  hotels: Hotel[];
}

export interface HotelResponse {
  hotel: Hotel | null;
}

export interface HotelCountResponse {
  hotelCount: number;
}

export interface SearchNearbyResponse {
  searchNearby: Hotel[];
}

// Pagination helper interface
export interface PaginatedHotels {
  hotels: Hotel[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}
