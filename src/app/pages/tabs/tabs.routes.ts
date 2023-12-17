import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then( m => m.HomePage)
      },
      {
        path: 'search',
        loadComponent: () => import('./search/search.page').then( m => m.SearchPage)
      },
      {
        path: 'account',
        loadComponent: () => import('./account/account.page').then( m => m.AccountPage)
      },
      {
        path: 'address',
        loadComponent: () => import('./address/address.page').then( m => m.AddressPage)
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadComponent: () => import('./items/items.page').then( m => m.ItemsPage)
          },
          {
            path: 'add',
            loadComponent: () => import('./items/add-item/add-item.page').then( m => m.AddItemPage)
          },
        ]
      },
      {
        path: 'cuisines',
        children: [
          {
            path: '',
            loadComponent: () => import('./cuisines/cuisines.page').then( m => m.CuisinesPage)
          },
        ]
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment/payment.page').then( m => m.PaymentPage)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./reviews/reviews.page').then( m => m.ReviewsPage)
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadComponent: () => import('./cart/cart.page').then( m => m.CartPage)
          },
          {
            path: 'address',
            children: [
              {
                path: '',
                loadComponent: () => import('./address/address.page').then( m => m.AddressPage)
              },
              {
                path: 'edit-address',
                loadComponent: () => import('./address/edit-address/edit-address.page').then( m => m.EditAddressPage)
              },
            ]
          },
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'address',
    children: [
      {
        path: '',
        loadComponent: () => import('./address/edit-address/edit-address.page').then( m => m.EditAddressPage)
      },
    ]
  },
  {
    path: 'timings',
    children: [
      {
        path: '',
        loadComponent: () => import('./timings/timings.page').then( m => m.TimingsPage)
      },
    ]
  },
  {
    path: 'chefs/:chefId',
    children: [
      {
        path: '',
        loadComponent: () => import('./items/items.page').then( m => m.ItemsPage)
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadComponent: () => import('./cart/cart.page').then( m => m.CartPage)
          },
          {
            path: 'address',
            children: [
              {
                path: '',
                loadComponent: () => import('./address/address.page').then( m => m.AddressPage)
              },
              {
                path: 'edit-address',
                loadComponent: () => import('./address/edit-address/edit-address.page').then( m => m.EditAddressPage)
              },
            ]
          },
          {
            path: 'payment-option',
            loadComponent: () => import('./payment-option/payment-option.page').then( m => m.PaymentOptionPage),
            canActivate: [async() => await inject(AuthService).authGuard()]
          },
        ]
      },
    ]
  },
  {
    path: 'orders/:id',
    children: [
      {
        path: '',
        loadComponent: () => import('./order-detail/order-detail.page').then( m => m.OrderDetailPage),
      },
      {
        path: 'chat',
        loadComponent: () => import('./order-detail/chat/chat.page').then( m => m.ChatPage),
      },
    ]
  },
  {
    path: 'payment-option',
    loadComponent: () => import('./payment-option/payment-option.page').then( m => m.PaymentOptionPage),
    canActivate: [async() => await inject(AuthService).authGuard()]
  },
  {
    path: 'add-item',
    loadComponent: () => import('./items/add-item/add-item.page').then( m => m.AddItemPage)
  },
  {
    path: 'cuisines',
    loadComponent: () => import('./cuisines/cuisines.page').then( m => m.CuisinesPage)
  },
  {
    path: 'timings',
    loadComponent: () => import('./timings/timings.page').then( m => m.TimingsPage)
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./terms-conditions/terms-conditions.page').then( m => m.TermsConditionsPage)
  },
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.page').then( m => m.PaymentPage)
  },
  {
    path: 'reviews',
    loadComponent: () => import('./reviews/reviews.page').then( m => m.ReviewsPage)
  },
];
