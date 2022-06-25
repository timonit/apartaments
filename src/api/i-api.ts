import Apartment from './Apartment';

export type QueryParams = {
  from: Omit<Apartment, 'plan' | 'id' | 'numberOfFloors'>;
  to: Omit<Apartment, 'plan' | 'id' | 'numberOfFloors'>;
}

export interface IApi {
  getApartments(filter: QueryParams, page: number): Promise<Apartment[]>
}
