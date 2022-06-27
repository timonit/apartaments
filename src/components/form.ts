import Api, { MinMax } from '../api/api';
import Component from '../api/component';
import { QueryParams } from '../api/i-api';
import { defaultFilter, store } from '../api/store';

type FormFields = {
  area: { value: () => [number, number] };
  price: { value: () => [number, number] };
  numberOfRooms: { value: [number, number] };
};

class FormComponent extends Component {
  form = document.forms[0];
  priceElement = document.querySelector('#price');
  areaElement = document.querySelector('#area');
  numberOfRoomselemens = this.form.numberOfRooms;

  priceLabels = {
    from: this.priceElement?.parentElement?.querySelector('.from'),
    to: this.priceElement?.parentElement?.querySelector('.to'),
  };

  areaLabels = {
    from: this.areaElement?.parentElement?.querySelector('.from'),
    to: this.areaElement?.parentElement?.querySelector('.to'),
  };

  roomsCheckboxes = this.form['numberofroom'] as NodeList;

  dataFields!: FormFields;

  isInited = false;

  priceMaxMin!: MinMax;
  areaMaxMin!: MinMax;

  async changeFields(): Promise<void> {
    this.form.classList.add('disabled');
    const priceVal = this.dataFields.price.value();
    const areaVal = this.dataFields.area.value();
    const rooms = Array.from(this.roomsCheckboxes)
      // @ts-ignore
      .filter((el: HTMLInputElement) => el.checked)
      // @ts-ignore
      .map((el: HTMLInputElement) => el.dataset.id as number);

    const filter: QueryParams = {
      from: {
        price: priceVal[0],
        area: areaVal[0],
        numberOfRooms: this.dataFields.numberOfRooms.value[0],
        floor: 1,
      },
      to: {
        price: priceVal[1],
        area: areaVal[1],
        numberOfRooms: this.dataFields.numberOfRooms.value[1],
        floor: 100,
      },
      numberOfRooms: rooms,
    };

    await store.setFilter(filter);

    this.form.classList.remove('disabled');
  }

  private async initSliders() {
    const api = new Api();
    this.priceMaxMin = await api.getMinMax('price');
    this.areaMaxMin = await api.getMinMax('area');
    const setLabels = (field: string) => {
      // @ts-ignore
      const fieldVal = this.dataFields[field].value();
      // @ts-ignore
      this[`${field}Labels`].from?.innerHTML = String(fieldVal[0]);
      // @ts-ignore
      this[`${field}Labels`].to?.innerHTML = String(fieldVal[1]);
    };
    this.dataFields = {
      // @ts-ignore
      area: rangeSlider(this.areaElement, {
        onInput: () => {
          setLabels('area');
          this.changeFields();
        },
        max: this.areaMaxMin.max,
        min: this.areaMaxMin.min,
        value: [20, 100],
      }),
      // @ts-ignore
      price: rangeSlider(this.priceElement, {
        onInput: () => {
          setLabels('price');
          this.changeFields();
        },
        max: this.priceMaxMin.max,
        min: this.priceMaxMin.min,
        value: [1000000, 5000000],
      }),
      numberOfRooms: { value: [1, 4] },
    };
  }

  syncElementsAtFields(): void {
    const from = defaultFilter.from;
    const to = defaultFilter.to;
    const rooms = defaultFilter.numberOfRooms;
    // @ts-ignore
    this.roomsCheckboxes.forEach((el: HTMLInputElement) => {
      el.checked = true;
    })

    // @ts-ignore
    this.dataFields.area.value([20, 100]);
    // @ts-ignore
    this.dataFields.price.value([1000000, 5000000]);
  }

  async init(): Promise<void> {
    this.isInited = true;

    await this.initSliders();
    const areaVal = this.dataFields.area.value();
    const priceVal = this.dataFields.price.value();
    // @ts-ignore
    this.areaLabels.from?.innerHTML = String(areaVal[0]);
    // @ts-ignore
    this.areaLabels.to?.innerHTML = String(areaVal[1]);
    // @ts-ignore
    this.priceLabels.from?.innerHTML = String(priceVal[0]);
    // @ts-ignore
    this.priceLabels.to?.innerHTML = String(priceVal[1]);

    // @ts-ignore
    this.roomsCheckboxes.forEach((chBox: HTMLInputElement) => {
      chBox.addEventListener('change', this.changeFields.bind(this));
      chBox.checked =
        store.state.filter.numberOfRooms.indexOf(Number(chBox.dataset.id)) > -1;
    });

    this.form.querySelector('.reset-btn')?.addEventListener('click', () => {
      // store.setDefaultFilter();
      this.syncElementsAtFields();
    });
  }
}

export const formComponent = new FormComponent();
formComponent.init();
