import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'blogs',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register').then((m) => m.RegisterPage),
  },
  {
    path: 'verify',
    loadComponent: () => import('./pages/verify').then((m) => m.VerifyPage),
  },
  {
    path: 'blogs',
    loadComponent: () => import('./pages/blogs').then((m) => m.BlogsPage),
  },
];
