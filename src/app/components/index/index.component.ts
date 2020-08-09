import { Component, OnInit } from '@angular/core';
import { slideHorizontal } from '../../animations/slide-horizontal';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [
    slideHorizontal
  ]
})

export class IndexComponent implements OnInit {
  navBackground = '#2C3444';
  logoTextColor = 'white';
  logoSvgWhite = true;

  constructor() {
  }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRouteData.animationIndex;
  }

  onActivated($event) {
    if ($event.constructor.name === 'SigninComponent') {
      this.navBackground = 'linear-gradient(to right, white 40%, #2C3344 40%)';
      this.logoTextColor = '#2C3444';
      this.logoSvgWhite = false;
    } else {
      this.navBackground = '#2C3444';
      this.logoTextColor = 'white';
      this.logoSvgWhite = true;
    }
  }

}
