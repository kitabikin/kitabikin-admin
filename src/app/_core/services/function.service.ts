import { Injectable } from '@angular/core';

@Injectable()
export class FunctionService {
  imageURL(value: string): string {
    if (value) {
      if (value.indexOf('http://') === 0 || value.indexOf('https://') === 0) {
        return value;
      } else {
        return `api-backend/${value}`;
      }
    } else {
      return 'assets/images/thumbnail.svg';
    }
  }

  delay(ms: number): any {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
