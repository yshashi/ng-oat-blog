import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import {
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatInput,
  NgOatSelect,
  NgOatCheckbox,
  NgOatRadioGroup,
  NgOatSwitch,
  NgOatFileUpload,
  NgOatFormError,
  NgOatButton,
  NgOatProgress,
  NgOatAlert,
} from '@letsprogram/ng-oat';
import { NgOatToast } from '@letsprogram/ng-oat';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule,
    FormField,
    NgOatCard,
    NgOatCardHeader,
    NgOatCardFooter,
    NgOatInput,
    NgOatSelect,
    NgOatCheckbox,
    NgOatRadioGroup,
    NgOatSwitch,
    NgOatFileUpload,
    NgOatFormError,
    NgOatButton,
    NgOatProgress,
    NgOatAlert,
  ],
  template: `
    <div class="center">
      <div class="w-full max-w-md">
        <ng-oat-card>
          <ng-oat-card-header>
            <h2 class="mt-0 mb-0">Create Account</h2>
            <p class="text-light text-sm mt-0">Step {{ step() }} of 3</p>
            <ng-oat-progress [value]="step() * 33.33" [max]="100" />
          </ng-oat-card-header>

          @if (errorMsg()) {
            <ng-oat-alert variant="danger" [dismissible]="true" (dismissed)="errorMsg.set('')" class="mb-4">
              {{ errorMsg() }}
            </ng-oat-alert>
          }

          <!-- ── STEP 1: Basic Info ── -->
          @if (step() === 1) {
            <form (ngSubmit)="nextStep()" class="mt-4">
              <div class="flex flex-col gap-4">
                <div>
                  <ng-oat-input label="Full Name" placeholder="John Doe" autocomplete="name" [formField]="regForm.name" />
                  <ng-oat-form-error [control]="regForm.name()" />
                </div>
                <div>
                  <ng-oat-input label="Email" type="email" placeholder="you@example.com" autocomplete="email" [formField]="regForm.email" />
                  <ng-oat-form-error [control]="regForm.email()" />
                </div>
                <div>
                  <ng-oat-input label="Password" type="password" placeholder="••••••••" autocomplete="new-password" [formField]="regForm.password" />
                  <ng-oat-form-error [control]="regForm.password()" />
                </div>
                <div>
                  <ng-oat-input label="Confirm Password" type="password" placeholder="••••••••" [formField]="regForm.confirmPassword" />
                  <ng-oat-form-error [control]="regForm.confirmPassword()" />
                </div>
              </div>
              <ng-oat-card-footer>
                <div class="flex justify-between w-full">
                  <ng-oat-button variant="default" btnStyle="ghost" routerLink="/login"> Back to Login </ng-oat-button>
                  <ng-oat-button type="submit" variant="default" btnStyle="filled"> Next </ng-oat-button>
                </div>
              </ng-oat-card-footer>
            </form>
          }

          <!-- ── STEP 2: Profile Details ── -->
          @if (step() === 2) {
            <div class="mt-4 flex flex-col gap-4">
              <ng-oat-select label="Role" placeholder="Select your role" [options]="roleOptions" [(value)]="selectedRole" />

              <ng-oat-file-upload label="Profile Picture" accept="image/*" (filesSelected)="onFileSelect($event)" />

              <ng-oat-switch label="Subscribe to newsletter" [(checked)]="subscribeNewsletter" />
            </div>
            <ng-oat-card-footer>
              <div class="flex justify-between w-full">
                <ng-oat-button variant="default" btnStyle="ghost" (clicked)="prevStep()"> Back </ng-oat-button>
                <ng-oat-button variant="default" btnStyle="filled" (clicked)="nextStep()"> Next </ng-oat-button>
              </div>
            </ng-oat-card-footer>
          }

          <!-- ── STEP 3: Preferences ── -->
          @if (step() === 3) {
            <div class="mt-4 flex flex-col gap-4">
              <ng-oat-radio-group label="How did you hear about us?" [options]="referralOptions" [(value)]="referralSource" />

              <ng-oat-checkbox label="I agree to the Terms of Service and Privacy Policy" [(checked)]="agreeTerms" />

              @if (showTermsError()) {
                <ng-oat-alert variant="warning"> You must agree to the terms before registering. </ng-oat-alert>
              }
            </div>
            <ng-oat-card-footer>
              <div class="flex justify-between w-full">
                <ng-oat-button variant="default" btnStyle="ghost" (clicked)="prevStep()"> Back </ng-oat-button>
                <ng-oat-button variant="default" btnStyle="filled" (clicked)="register()"> Create Account </ng-oat-button>
              </div>
            </ng-oat-card-footer>
          }
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
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(NgOatToast);

  step = signal(1);
  errorMsg = signal('');
  showTermsError = signal(false);

  // Step 1 – Signal Forms
  regModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  regForm = form(this.regModel, (root) => {
    required(root.name, { message: 'Name is required' });
    required(root.email, { message: 'Email is required' });
    email(root.email, { message: 'Please enter a valid email' });
    required(root.password, { message: 'Password is required' });
    minLength(root.password, 6, { message: 'Minimum 6 characters' });
    required(root.confirmPassword, { message: 'Please confirm your password' });
  });

  // Step 2
  roleOptions = [
    { label: 'Reader', value: 'reader' },
    { label: 'Writer', value: 'writer' },
    { label: 'Admin', value: 'admin' },
  ];
  selectedRole = signal('reader');
  subscribeNewsletter = signal(true);

  // Step 3
  referralOptions = [
    { label: 'Social Media', value: 'social' },
    { label: 'Search Engine', value: 'search' },
    { label: 'A Friend', value: 'friend' },
    { label: 'Other', value: 'other' },
  ];
  referralSource = signal('social');
  agreeTerms = signal(false);

  onFileSelect(files: File[]): void {
    if (files.length) {
      this.toast.info(`Selected: ${files[0].name}`, 'File Upload');
    }
  }

  nextStep(): void {
    if (this.step() === 1) {
      if (!this.regForm().valid()) {
        this.errorMsg.set('Please fix all errors before continuing.');
        return;
      }
      if (this.regModel().password !== this.regModel().confirmPassword) {
        this.errorMsg.set('Passwords do not match.');
        return;
      }
      this.errorMsg.set('');
    }
    this.step.update((s) => Math.min(s + 1, 3));
  }

  prevStep(): void {
    this.step.update((s) => Math.max(s - 1, 1));
    this.errorMsg.set('');
  }

  register(): void {
    if (!this.agreeTerms()) {
      this.showTermsError.set(true);
      return;
    }
    this.showTermsError.set(false);
    const data = this.regModel();
    this.auth.register({ name: data.name, email: data.email, password: data.password });
    this.toast.success('Account created! Check your email for a verification code.', 'Registration Successful');
    this.router.navigate(['/verify']);
  }
}
