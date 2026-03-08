import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import {
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatInput,
  NgOatCheckbox,
  NgOatFormError,
  NgOatButton,
  NgOatSeparator,
  NgOatAlert,
} from '@letsprogram/ng-oat';
import { NgOatToast } from '@letsprogram/ng-oat';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    FormField,
    NgOatCard,
    NgOatCardHeader,
    NgOatCardFooter,
    NgOatInput,
    NgOatCheckbox,
    NgOatFormError,
    NgOatButton,
    NgOatSeparator,
    NgOatAlert,
  ],
  template: `
    <div class="center">
      <div class="w-full max-w-md">
        <ng-oat-card>
          <ng-oat-card-header>
            <h2 class="mt-0 mb-0">Welcome Back</h2>
            <p class="text-light text-sm mt-0">Sign in to your LetsBlog account</p>
          </ng-oat-card-header>

          @if (errorMsg()) {
            <ng-oat-alert
              variant="danger"
              [dismissible]="true"
              (dismissed)="errorMsg.set('')"
              class="mb-4"
            >
              {{ errorMsg() }}
            </ng-oat-alert>
          }

          <form (ngSubmit)="onSubmit()" class="mt-4">
            <div class="flex flex-col gap-4">
              <div>
                <ng-oat-input
                  label="Email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  [formField]="loginForm.email"
                />
                <ng-oat-form-error [control]="loginForm.email()" />
              </div>

              <div>
                <ng-oat-input
                  label="Password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  [formField]="loginForm.password"
                />
                <ng-oat-form-error [control]="loginForm.password()" />
              </div>

              <div class="flex items-center justify-between">
                <ng-oat-checkbox label="Remember me" [(checked)]="rememberMe" />
                <a routerLink="/register" class="text-sm">Forgot password?</a>
              </div>
            </div>

            <ng-oat-card-footer>
              <div class="flex flex-col gap-4 w-full">
                <ng-oat-button type="submit" variant="default" btnStyle="filled" class="w-full">
                  Sign In
                </ng-oat-button>

                <ng-oat-separator label="or" />

                <div class="text-center">
                  <span class="text-sm text-light">Don't have an account? </span>
                  <a routerLink="/register" class="text-sm fw-medium">Create one</a>
                </div>
              </div>
            </ng-oat-card-footer>
          </form>
        </ng-oat-card>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(NgOatToast);

  rememberMe = signal(false);
  errorMsg = signal('');

  loginModel = signal({ email: '', password: '' });

  loginForm = form(this.loginModel, (root) => {
    required(root.email, { message: 'Email is required' });
    email(root.email, { message: 'Please enter a valid email address' });
    required(root.password, { message: 'Password is required' });
    minLength(root.password, 6, { message: 'Password must be at least 6 characters' });
  });

  onSubmit(): void {
    if (!this.loginForm().valid()) {
      this.errorMsg.set('Please fix the errors above before submitting.');
      return;
    }
    const { email, password } = this.loginModel();
    const success = this.auth.login(email, password);
    if (success) {
      this.toast.success('Welcome back!', 'Login Successful');
      this.router.navigate(['/blogs']);
    } else {
      this.errorMsg.set('Invalid email or password. Please try again.');
    }
  }
}
