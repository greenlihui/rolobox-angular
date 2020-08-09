import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';

export const wipeVertical = trigger('wipeVertical', [
  transition(':increment', [
    style({position: 'relative'}),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    ]),
    query(':enter', [
      style({top: '100%', 'z-index': 100}),
      animate('.8s', style({top: 0}))
    ]),
    query(':enter', animateChild())
  ]),
  transition(':decrement', [
    style({position: 'relative'}),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      })
    ]),
    query(':leave', [
      style({top: 0, 'z-index': 100}),
      animate('.8s', style({top: '100%'}))
    ]),
    query(':leave', animateChild())
  ])
]);
