import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _name: string;
  private _value: string;
  private _onValueChanges: Subject<{name, value}> = new Subject<{name, value}>();
  constructor() { }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }


  get onValueChanges(): Subject<{ name; value }> {
    return this._onValueChanges;
  }
}
