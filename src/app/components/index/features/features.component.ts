import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Utils } from '../../../utils';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translate(-50%, 100%)', opacity: '0'}),
        animate('1500ms ease-in', style({transform: 'translate(-50%, 0)', opacity: 1}))
      ])
    ])
  ]
})
export class FeaturesComponent implements OnInit {
  introTextDisplay = false;

  constructor() {
  }

  ngOnInit() {
    Utils.delay(1500).then(res => {
      this.introTextDisplay = true;
    });
  }

}
