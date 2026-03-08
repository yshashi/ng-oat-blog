import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgOatCard, NgOatCardHeader, NgOatCardFooter, NgOatInputOtp, NgOatButton, NgOatAlert, NgOatSpinner } from '@letsprogram/ng-oat';
import { NgOatToast } from '@letsprogram/ng-oat';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify',
  imports: [FormsModule, NgOatCard, NgOatCardHeader, NgOatCardFooter, NgOatInputOtp, NgOatButton, NgOatAlert, NgOatSpinner],
  template: `
    <div class="center">
      <div class="w-full max-w-md">
        <ng-oat-card>
          <ng-oat-card-header>
            <h2 class="mb-2">Verify Your Email</h2>
            <p class="text-sm mb-2">Enter the 6-digit code sent to your inbox</p>
          </ng-oat-card-header>

          <ng-oat-alert> A verification code has been sent to your email address. Check your spam folder if you don't see it. </ng-oat-alert>

          <div class="mt-6 center">
            @if (verifying()) {
              <ng-oat-spinner size="large" />
              <p class="text-light text-sm">Verifying...</p>
            } @else {
              <ng-oat-input-otp [length]="6" [separator]="3" [(value)]="otpCode" />
            }
          </div>
          @if (errorMsg()) {
            <ng-oat-alert variant="danger" class="mt-4" [dismissible]="true" (dismissed)="errorMsg.set('')">
              {{ errorMsg() }}
            </ng-oat-alert>
          }

          <ng-oat-card-footer>
            <div class="flex justify-between w-full">
              <ng-oat-button variant="default" btnStyle="ghost" (clicked)="resendCode()" [disabled]="verifying()"> Resend Code </ng-oat-button>
              <ng-oat-button variant="default" btnStyle="filled" (clicked)="verify()" [disabled]="verifying()"> Verify </ng-oat-button>
            </div>
          </ng-oat-card-footer>
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
export class VerifyPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(NgOatToast);

  otpCode = signal('');
  verifying = signal(false);
  errorMsg = signal('');

  verify(): void {
    const code = this.otpCode();
    if (code.length < 6) {
      this.errorMsg.set('Please enter the full 6-digit code.');
      return;
    }
    this.verifying.set(true);
    this.errorMsg.set('');
    setTimeout(() => {
      const ok = this.auth.verifyOtp(code);
      this.verifying.set(false);
      if (ok) {
        this.toast.success('Email verified successfully!', 'Verified');
        this.router.navigate(['/blogs']);
      } else {
        this.errorMsg.set('Invalid verification code. Please try again.');
      }
    }, 1500);
  }

  resendCode(): void {
    this.toast.info('A new verification code has been sent.', 'Code Resent');
  }
}
