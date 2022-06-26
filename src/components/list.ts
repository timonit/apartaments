import Api from '../api/api';
import Component from '../api/component';
import Apartment from '../api/Apartment';
import { QueryParams } from '../api/i-api';

const ROW_CLASS = 'row';
const COL_CLASS = 'col';
const TITLE_APRT_CLASS = 'b';
const SECONDARY_CLASS = 'secondary';
const IMG_SRC = '../assets/imgs/Image.svg';

class ListComponent extends Component {
  root = document.querySelector('#apartment-list') as HTMLElement;

  headRow = document.querySelector('.list-head') as HTMLElement;

  list: HTMLElement[] = [];

  private api = new Api();

  currentPage = 1;

  currentFilter: QueryParams = {
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
      apartmentNumber: 10000,
      area: 100,
      floor: 100,
      price: 100000000,
      numberOfFloors: 100,
    }
  }

  private createPlan(): HTMLImageElement {
    const img = this.createElement('img') as HTMLImageElement;
    img.src = IMG_SRC;
    return img;
  }

  private createCol(value: HTMLElement, row: HTMLDivElement): HTMLDivElement {
    const col = this.createElement('div', { inElement: row, content: value });
    col.classList.add(COL_CLASS);

    return col as HTMLDivElement;
  }

  private createRow(obj: Apartment): HTMLDivElement {
    const row = this.createElement('div', {
      inElement: this.root,
    }) as HTMLDivElement;
    row.classList.add(ROW_CLASS);

    // adding plan col
    this.createCol(this.createPlan(), row);

    // adding title col
    this.createCol(
      this.createElement(TITLE_APRT_CLASS, {
        content: `${obj.numberOfRooms}-комнатная №${obj.apartmentNumber}`,
      }),
      row
    );

    // adding area col
    this.createCol(this.createElement('span', { content: obj.area }), row);

    // adding floor col
    this.createCol(
      this.createElement('span', {
        content: `${obj.floor} <span class="${SECONDARY_CLASS}">из ${obj.numberOfFloors}</span>`,
      }),
      row
    );

    // adding price col
    this.createCol(this.createElement('span', { content: obj.price.toLocaleString() }), row);

    return row;
  }

  private setList(list: Apartment[]): void {
    this.list.forEach((elem) => {
      this.root.removeChild(elem);
    });

    this.list = list.map((item) => {
      return this.createRow(item);
    });
  }

  private addItems(items: Apartment[]): void {
    this.list = this.list.concat(
      items.map((item) => {
        return this.createRow(item);
      })
    );
  }

  private async fetchList(): Promise<void> {
    this.setList(await this.api.getApartments(this.currentFilter, 1));
  }

  async nextPage(): Promise<void> {
    const nextPage = this.currentPage + 1;
    const result =  await this.api.getApartments(this.currentFilter, nextPage);

    if (result) {
      this.addItems(result);
      this.currentPage = nextPage;
    }
  }

  async init(): Promise<void> {
    await this.fetchList();
  }

  filter(filter: QueryParams) {
    this.currentFilter = filter;
    this.fetchList();
  }
}

export const listComponent = new ListComponent();
listComponent.init();


const btn = document.querySelector('#load-more');
btn?.addEventListener('click', () => {
  listComponent.filter({
    from: {
      numberOfRooms: 1,
      apartmentNumber: 50,
      area: 1,
      floor: 1,
      price: 1,
      numberOfFloors: 1,
    },
    to: {
      numberOfRooms: 4,
      apartmentNumber: 10000,
      area: 100,
      floor: 100,
      price: 100000000,
      numberOfFloors: 100,
    }
  });
})
