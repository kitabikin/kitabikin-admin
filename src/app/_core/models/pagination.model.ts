import { Deserializable } from '@models';

export class Pagination implements Deserializable {
  [x: string]: any;
  total_items?: number;
  current_page?: number;
  previous_page?: number;
  next_page?: number;
  page_size?: number;
  total_pages?: number;
  start_page?: number;
  end_page?: number;
  start_index?: number;
  end_index?: number;
  pages?: any;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
