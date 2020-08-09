import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  static delay(ms: number) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms, 'done'));
  }
}
