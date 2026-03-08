import { Component, inject, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  NgOatToolbar,
  NgOatThemeSelector,
  NgOatDropdownComponent,
  NgOatButton,
  NgOatSeparator,
  NgOatSidebar,
} from '@letsprogram/ng-oat';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgOatToolbar,
    NgOatThemeSelector,
    NgOatDropdownComponent,
    NgOatButton,
    NgOatSeparator,
    NgOatSidebar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  readonly sidebar = viewChild(NgOatSidebar);

  logout(): void {
    this.auth.logout();
    this.sidebar()?.close();
    this.router.navigate(['/']);
  }
}
