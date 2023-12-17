import { Routes } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
    canMatch: [async() => await inject(AuthService).authGuard()],
    data: {
      type: 'user'
    }
  },
  {
    path: 'menu', 
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/tabs/items/items.page').then( m => m.ItemsPage)
      }
    ]
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/auth-screens/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth-screens/auth/auth.page').then( m => m.AuthPage),
    canMatch: [
      async() => await inject(AuthService).autoLoginGuard(),
      async() => await inject(AuthService).introGuard(),
    ],
  },
];
