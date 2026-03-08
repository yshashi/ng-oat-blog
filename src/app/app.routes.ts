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
];
