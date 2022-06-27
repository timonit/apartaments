import Apartment from './Apartment';
import Api from './api';
import { QueryParams } from './i-api';

export type StoreState = {
  filter: QueryParams;
  isFetching: boolean;
  list: Apartment[];
  page: number;
  totalCount: number;
};

export type Store = {
  state: StoreState;
  onChange: (cb: (state: StoreState) => void) => void;
  setState: (state: StoreState) => void;
  setFilter(filter: QueryParams): void;
  nextPage(): void;
  setStatus(isFetching: boolean): void;
  subscribers: ((state: StoreState) => void)[];
  setDefaultFilter: () => void;
};

export const defaultFilter: QueryParams = {
  from: {
    apartmentNumber: 1,
    area: 1,
    floor: 1,
    price: 1,
    numberOfFloors: 1,
  },
  to: {
    apartmentNumber: 1000,
    area: 1000,
    floor: 1000,
    price: 100000000,
    numberOfFloors: 100,
  },
  numberOfRooms: [1, 2, 3, 4],
};

export const store: Store = {
  state: {
    isFetching: false,
    filter: defaultFilter,
    list: [],
    page: 1,
    totalCount: 100,
  },
  subscribers: [],
  onChange(cb: (state: StoreState) => void): void {
    this.subscribers.push(cb);
  },
  async setState(state: StoreState): Promise<void> {
    this.state = state;
    this.subscribers.forEach((subscriber) => {
      subscriber(this.state);
    });
  },
  async nextPage(): Promise<void> {
    this.setStatus(true);
    const api = new Api();
    const page = this.state.page + 1;
    const list = this.state.list.concat(
      await api.getApartments(store.state.filter, page)
    );
    const totalCount = api.totalCount as number;
    await this.setState({
      isFetching: false,
      list,
      filter: this.state.filter,
      page,
      totalCount,
    });
  },
  async setFilter(filter: QueryParams): Promise<void> {
    this.setStatus(true);
    const api = new Api();
    const list = await api.getApartments(filter, 1);
    const totalCount = api.totalCount as number;
    await this.setState({
      isFetching: false,
      list,
      filter,
      page: 1,
      totalCount,
    });
  },
  async setStatus(isFetching: boolean): Promise<void> {
    await this.setState({ ...this.state, isFetching });
  },
  async setDefaultFilter(): Promise<void> {
    await this.setFilter(defaultFilter);
  },
};
