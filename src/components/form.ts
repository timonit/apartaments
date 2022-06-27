import Component from '../api/component';
import { QueryParams } from '../api/i-api';
import { store } from '../api/store';

type FormFields = {
  area: { value: [number, number] };
  price: { value: [number, number] };
  numberOfRooms: { value: [number, number] };
};

class FormComponent extends Component {
  form = document.forms[0];
  priceElement = document.querySelector('#price');
  areaElement = document.querySelector('#area');
  numberOfRoomselemens = this.form.numberOfRooms;

  dataFields: FormFields;

  isInited = false;

  constructor() {
    super();
    this.dataFields = {
      // @ts-ignore
      area: rangeSlider(this.price),
      // @ts-ignore
      price: rangeSlider(this.price),
      numberOfRooms: { value: [1, 4] },
    };
  }

  async changeFields(event: Event): Promise<void> {
    this.form.classList.add('disabled');

    const filter: QueryParams = {
      from: {
        price: this.dataFields.price.value[0],
        area: this.dataFields.area.value[0],
        numberOfRooms: this.dataFields.numberOfRooms.value[0],
        floor: 1,
      },
      to: {
        price: this.dataFields.price.value[1],
        area: this.dataFields.area.value[1],
        numberOfRooms: this.dataFields.numberOfRooms.value[1],
        floor: 100,
      }
    }

    await store.setFilter(filter);

    this.form.classList.remove('dsabled');
  }

  private eventsInit() {

  }

  async init(): Promise<void> {
    this.isInited = true;
  }
}

export const formComponent = new FormComponent();
formComponent.init();
