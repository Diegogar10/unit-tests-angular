import { Injectable } from '@angular/core';
import { ValueService } from './value.service';
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private valueService: ValueService
  ) { }

  getValue() {
    return `add text after of: ${this.valueService.getValue()}`;
  }
}
