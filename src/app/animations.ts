import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Cabinet => MainPage, UserView => Cabinet, CreateProject => Cabinet, * => EditProfileView, ' +
      'EditProfileView => MainPage, EditProfileView => Cabinet', [
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
        style({left: '-100%', opacity: '0.5'})
      ]),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({left: '100%', opacity: '0'})),
        ], {optional: true}),
        query(':enter', [
          animate('300ms ease-in-out', style({left: '0%', opacity: '1'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('MainPage => Cabinet,  UserView => MainPage, CreateProject => MainPage, ProjectView => MainPage, ' +
      'LoginView => MainPage, RegisterView => MainPage', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({right: '-100%', opacity: '0.5'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({right: '100%', opacity: '0'}))
        ]),
        query(':enter', [
          animate('300ms ease-in-out', style({right: '0%', opacity: '1'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Cabinet => CreateProject, * => LoginView, * => RegisterView', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({bottom: '-1000px', opacity: '0.5'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({bottom: '100%', opacity: '0'}))
        ]),
        query(':enter', [
          animate('300ms ease-in-out', style({bottom: '0', opacity: '1'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* => UserView', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({top: '-1000px', opacity: '0.5'})
      ]),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({top: '100%', opacity: '0'}))
        ], {optional: true}),
        query(':enter', [
          animate('300ms ease-in-out', style({top: '0', opacity: '1'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* => ProjectView', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({
          opacity: '0',
          transform: 'scale(0.1)',
        })
      ]),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({opacity: '0'}))
        ], {optional: true}),
        query(':enter', [
          animate('300ms ease-in-out', style({
            opacity: '1',
            transform: 'scale(1)',
          }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
  ]);
