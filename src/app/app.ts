import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  NgOatButton,
  NgOatThemeSelector,
  NgOatToolbar,
  NgOatDropdownComponent,
  NgOatDropdown,
  NgOatSidebarComponent,
  NgOatSidebar,
  NgOatSeparator,
} from '@letsprogram/ng-oat';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [NgOatToolbar, RouterOutlet, RouterLink, NgOatThemeSelector, NgOatSeparator, NgOatButton, NgOatDropdownComponent, NgOatSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-oat-blog');

  readonly auth = inject(AuthService);

  onToggle(event: any) {
    console.log('Toggle event:', event);
  }
}
