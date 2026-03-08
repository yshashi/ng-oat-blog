import { Component, inject, signal } from '@angular/core';
import { form, required, email, minLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { NgOatToast } from '@letsprogram/ng-oat';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  template: ``,
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
