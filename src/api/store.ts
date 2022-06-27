import { QueryParams } from './i-api';

export type StoreState = {
  filter: QueryParams;
  isFetching: boolean;
};

export type Store = {
  state: StoreState;
  onChange: (cb: (state: StoreState) => void) => void;
  setState: (state: StoreState) => void;
  setFilter(filter: QueryParams): void;
  setStatus(isFetching: boolean): void;
  subscribers: ((state: StoreState) => void)[];
};

export const store: Store = {
  state: {
    isFetching: false,
    filter: {
      from: {
        numberOfRooms: 1,
        apartmentNumber: 1,
        area: 1,
        floor: 1,
        price: 1,
        numberOfFloors: 1,
      },
      to: {
        numberOfRooms: 4,
        apartmentNumber: 1000,
        area: 1000,
        floor: 1000,
        price: 100000000,
        numberOfFloors: 100,
      },
    },
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
  async setFilter(filter: QueryParams): Promise<void> {
    this.setState({...this.state, filter});
  },
  async setStatus(isFetching: boolean): Promise<void> {
    this.setState({...this.state, isFetching});
  }
};
