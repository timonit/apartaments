import Api from '../api/api';
import Component from '../api/component';
import Apartment from '../api/Apartment';
import { store } from '../api/store';

const ROW_CLASS = 'row';
const COL_CLASS = 'col';
const TITLE_APRT_CLASS = 'b';
const SECONDARY_CLASS = 'secondary';
const IMG_SRC = '../assets/imgs/Image.svg';

class ListComponent extends Component {
  root = document.querySelector('#apartment-list') as HTMLElement;

  headRow = document.querySelector('.list-head') as HTMLElement;

  btnLoadMore = document.querySelector('#load-more') as HTMLButtonElement;

  list: HTMLElement[] = [];

  private api = new Api();

  currentPage = 1;

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
    this.createCol(
      this.createElement('span', { content: obj.price.toLocaleString() }),
      row
    );

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

  checkVisibleBtnLoadMore() {
    if (store.state.list.length < store.state.totalCount) {
      this.btnLoadMore.style.display = 'block';
    }

    if (store.state.list.length >= store.state.totalCount) {
      this.btnLoadMore.style.display = 'none';
    }
  }

  async init(): Promise<void> {
    store.onChange((state) => {
      this.setList(state.list);
      this.checkVisibleBtnLoadMore();
    });

    await store.setFilter(store.state.filter);

    this.btnLoadMore?.addEventListener('click', async () => {
      await store.nextPage();
    });
  }
}

export const listComponent = new ListComponent();
listComponent.init();
