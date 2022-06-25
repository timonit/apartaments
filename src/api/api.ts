import Apartment from './Apartment';
import { IApi, QueryParams } from './i-api';

type MinMax = { min: number; max: number };

export default class Api implements IApi {
  origin = document.URL;

  createParams(filter: QueryParams): URLSearchParams {
    const params = new URLSearchParams('_limit=20');
    const from = filter.from;
    const to = filter.to;

    for (const prop in from) params.append(`${prop}_gte`, String(from[prop]));
    for (const prop in to) params.append(`${prop}_lte`, String(to[prop]));

    return params;
  }

  async getApartments(filter: QueryParams, page: number): Promise<Apartment[]> {
    const params = this.createParams(filter);
    params.append('_page', String(page));

    const url = new URL('apartments', document.URL);
    url.search = params.toString();

    return fetch(url).then((res) => res.json()) as unknown as Apartment[];
  }

  async getMinMax(prop: keyof Apartment): Promise<MinMax> {
    const minUrl = new URL(
      `apartments?_limit=1&_order=asc&_sort=${prop}`,
      this.origin
    );

    const maxUrl = new URL(
      `apartments?_limit=1&_order=desc&_sort=${prop}`,
      this.origin
    );

    const [[minRes], [maxRes]] = (await Promise.all([
      fetch(minUrl).then((res) => res.json()),
      fetch(maxUrl).then((res) => res.json()),
    ])) as [Apartment[], Apartment[]];

    return { min: Number(minRes[prop]), max: Number(maxRes[prop]) };
  }
}
