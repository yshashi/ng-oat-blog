import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register').then(m => m.RegisterPage),
  },
  {
    path: 'verify',
    loadComponent: () => import('./pages/verify').then(m => m.VerifyPage),
  },
  {
    path: 'blogs',
    loadComponent: () => import('./pages/blogs').then(m => m.BlogsPage),
  },
  {
    path: 'blogs/create',
    loadComponent: () => import('./pages/create-blog').then(m => m.CreateBlogPage),
  },
  {
    path: 'blogs/:slug',
    loadComponent: () => import('./pages/blog-detail').then(m => m.BlogDetailPage),
  },
  {
    path: 'blogs/:slug/edit',
    loadComponent: () => import('./pages/create-blog').then(m => m.CreateBlogPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile').then(m => m.ProfilePage),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about').then(m => m.AboutPage),
  },
  { path: '**', redirectTo: '' },
];
