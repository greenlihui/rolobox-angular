import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const slideHorizontal = trigger('slideHorizontal', [
  transition(':increment', [ // leave to left, enter from right
    style({position: 'relative'}), // host relative position
    query(':enter, :leave', [ // children absolution position for transition
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    ]),
    query(':enter', [
      style({left: '100%'})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('.5s', style({left: '-100%'}))
      ]),
      query(':enter', [
        animate('.5s', style({left: '0%'}))
      ])
    ]),
    query(':enter', animateChild())
  ]),
  transition(':decrement', [ // leave to right, enter from left
    style({position: 'relative'}),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({left: '-100%'})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('.5s', style({left: '100%'}))
      ]),
      query(':enter', [
        animate('.5s', style({left: '0%'}))
      ])]),
    query(':enter', animateChild())
  ])
]);
