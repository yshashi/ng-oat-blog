import { Injectable, signal, computed } from '@angular/core';
import { Author, AUTHORS } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<Author | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(email: string, _password: string): boolean {
    if (email && _password.length >= 6) {
      this._currentUser.set(AUTHORS[0]);
      return true;
    }
    return false;
  }

  register(_data: { name: string; email: string; password: string }): boolean {
    return true;
  }

  verifyOtp(code: string): boolean {
    if (code.length === 6) {
      this._currentUser.set(AUTHORS[0]);
      return true;
    }
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
  }

  updateProfile(partial: Partial<Author>): void {
    const current = this._currentUser();
    if (current) {
      this._currentUser.set({ ...current, ...partial });
    }
  }
}
