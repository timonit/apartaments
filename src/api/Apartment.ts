export default interface Apartment {
  [p: string]: string | number;
  id: string;
  plan: 'img';
  numberOfRooms: 1 | 2 | 3 | 4;
  apartmentNumber: number;
  area: number;
  floor: number
  price: number;
  numberOfFloors: number;
}
