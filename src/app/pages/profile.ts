import { Component, inject, signal, computed, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  NgOatBreadcrumb,
  NgOatTabsComponent,
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatAvatar,
  NgOatInput,
  NgOatFileUpload,
  NgOatButton,
  NgOatTable,
  NgOatBadge,
  NgOatSwitch,
  NgOatDialog,
  NgOatAlert,
  NgOatSeparator,
  NgOatFormsCva,
  type OatBreadcrumbItem,
  type NgOatTableColumn,
  NgOatDialogComponent,
} from '@letsprogram/ng-oat';
import { NgOatToast } from '@letsprogram/ng-oat';
import { AuthService } from '../services/auth.service';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink,
    FormsModule,
    NgOatBreadcrumb,
    NgOatTabsComponent,
    NgOatCard,
    NgOatCardHeader,
    NgOatCardFooter,
    NgOatAvatar,
    NgOatInput,
    NgOatFileUpload,
    NgOatButton,
    NgOatTable,
    NgOatSwitch,
    NgOatDialogComponent,
    NgOatAlert,
    NgOatSeparator,
    ...NgOatFormsCva,
  ],
  template: `
    <div>
      <!-- ── Breadcrumb ── -->
      <div class="mb-6">
        <ng-oat-breadcrumb [items]="breadcrumbs" (navigate)="onBreadcrumb($event)" />
        <h1 class="text-6 sm:text-2">My Profile</h1>
        <p>Manage your account and view your posts.</p>
      </div>

      @if (!auth.isLoggedIn()) {
        <ng-oat-alert variant="warning">
          You must be <a routerLink="/login">signed in</a> to view your profile.
        </ng-oat-alert>
      } @else {
        <ng-oat-tabs [tabs]="['Profile', 'My Posts', 'Settings']">
          <!-- ═══ Tab 1: Profile ═══ -->
          <div role="tabpanel">
            <ng-oat-card>
              <ng-oat-card-header>
                <h2 class="mb-0">Personal Information</h2>
              </ng-oat-card-header>

              <div class="items-center flex flex-col">
                <ng-oat-avatar
                  [src]="auth.currentUser()?.avatar ?? ''"
                  [alt]="auth.currentUser()?.name ?? ''"
                  size="xl"
                />
                <div class="mt-2">
                  <ng-oat-file-upload
                    label="Change Avatar"
                    accept="image/*"
                    (filesSelected)="onAvatarSelected($event)"
                  />
                </div>
              </div>

              <ng-oat-separator class="my-4" />

              <!-- Template-driven forms with ngModel -->
              <div class="vstack">
                <ng-oat-input label="Full Name" placeholder="Your name" [(ngModel)]="profileName" />

                <ng-oat-input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  [(ngModel)]="profileEmail"
                  [readonly]="true"
                />

                <ng-oat-input
                  label="Bio"
                  placeholder="Tell us about yourself"
                  [(ngModel)]="profileBio"
                />
              </div>

              <ng-oat-card-footer>
                <div class="hstack">
                  <span class="text-normal text-light">Role: {{ auth.currentUser()?.role }}</span>
                  <ng-oat-button variant="default" btnStyle="filled" (clicked)="saveProfile()">
                    Save Changes
                  </ng-oat-button>
                </div>
              </ng-oat-card-footer>
            </ng-oat-card>

            @if (profileSaved()) {
              <ng-oat-alert
                variant="success"
                [dismissible]="true"
                (dismissed)="profileSaved.set(false)"
                class="mt-4"
              >
                Profile updated successfully!
              </ng-oat-alert>
            }
          </div>

          <!-- ═══ Tab 2: My Posts ═══ -->
          <div role="tabpanel" class="mt-4">
            <ng-oat-card>
              <ng-oat-card-header>
                <div class="flex justify-between items-center w-full">
                  <h2 class="mt-0 mb-0">My Posts</h2>
                  <ng-oat-button
                    variant="default"
                    btnStyle="filled"
                    size="small"
                    routerLink="/blogs/create"
                  >
                    + New Post
                  </ng-oat-button>
                </div>
              </ng-oat-card-header>

              @if (myPostsData().length === 0) {
                <div class="mt-4 mb-4">
                  <ng-oat-alert variant="default">
                    You haven't written any posts yet.
                    <a routerLink="/blogs/create">Write your first post!</a>
                  </ng-oat-alert>
                </div>
              } @else {
                <div class="mt-4">
                  <ng-oat-table
                    [columns]="postColumns"
                    [data]="myPostsData()"
                    [striped]="true"
                    [clickable]="true"
                    [scrollX]="true"
                    (rowClick)="onPostRowClick($event)"
                  />
                </div>
              }
            </ng-oat-card>
          </div>

          <!-- ═══ Tab 3: Settings ═══ -->
          <div role="tabpanel">
            <ng-oat-card>
              <ng-oat-card-header>
                <h2 class="mb-4">Settings</h2>
              </ng-oat-card-header>

              <div class="vstack">
                <div class="flex justify-between items-center">
                  <div>
                    <span>Email Notifications</span>
                    <p class="text-xs text-light">
                      Receive email updates about new comments and likes.
                    </p>
                  </div>
                  <ng-oat-switch label="" [(checked)]="emailNotifications" />
                </div>

                <ng-oat-separator class="my-4" />

                <div class="flex justify-between items-center">
                  <div>
                    <span>Public Profile</span>
                    <p class="text-xs text-light">
                      Allow other users to see your profile and posts.
                    </p>
                  </div>
                  <ng-oat-switch label="" [(checked)]="publicProfile" />
                </div>

                <ng-oat-separator class="my-4" />

                <div>
                  <h3 class="text-danger">Danger Zone</h3>
                  <p>Permanently delete your account and all associated data.</p>
                  <ng-oat-button variant="danger" btnStyle="outline" (clicked)="modal.showModal()">
                    Delete Account
                  </ng-oat-button>
                </div>
              </div>
            </ng-oat-card>
          </div>
        </ng-oat-tabs>

        <!-- ── Delete Account Dialog (directive-based) ── -->
        <ng-oat-dialog #modal (closed)="onDeleteDialogClose($event)">
          <h3 header>Delete Account</h3>
          <p>Are you sure you want to proceed?</p>
          <div footer class="hstack">
            <button class="outline" (click)="modal.close('cancel')">Cancel</button>
            <button (click)="modal.close('confirm')">Confirm</button>
          </div>
        </ng-oat-dialog>
      }
    </div>
  `,
})
export class ProfilePage {
  protected readonly auth = inject(AuthService);
  private readonly blog = inject(BlogService);
  private readonly router = inject(Router);
  private readonly toast = inject(NgOatToast);

  private readonly tab = viewChild(NgOatTabsComponent);

  profileName = signal(this.auth.currentUser()?.name ?? '');
  profileEmail = signal(
    this.auth.currentUser()?.name
      ? `${this.auth.currentUser()!.name.toLowerCase().replace(/\s/g, '.')}@example.com`
      : '',
  );
  profileBio = signal(this.auth.currentUser()?.bio ?? '');
  profileSaved = signal(false);
  emailNotifications = signal(true);
  publicProfile = signal(true);

  breadcrumbs: OatBreadcrumbItem[] = [{ label: 'Home', url: '/' }, { label: 'Profile' }];

  postColumns: NgOatTableColumn[] = [
    { key: 'title', label: 'Title', width: '40%' },
    { key: 'category', label: 'Category', width: '15%' },
    { key: 'status', label: 'Status', width: '15%' },
    { key: 'date', label: 'Date', width: '15%' },
    { key: 'views', label: 'Views', width: '15%' },
  ];

  myPostsData = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.blog
      .posts()
      .filter((p) => p.author.id === user.id)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category.label,
        status: p.status,
        date: p.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        views: p.views.toString(),
      }));
  });

  onAvatarSelected(files: File[]): void {
    if (files.length) {
      this.toast.info(`Avatar selected: ${files[0].name}`, 'Avatar');
    }
  }

  saveProfile(): void {
    this.auth.updateProfile({
      name: this.profileName(),
      bio: this.profileBio(),
    });
    this.profileSaved.set(true);
    this.toast.success('Profile saved!', 'Updated');
  }

  onPostRowClick(row: Record<string, any>): void {
    this.router.navigate(['/blogs', row['slug']]);
  }

  openDeleteDialog(): void {
    const dlg = document.querySelector('dialog[ngOatDialog]') as HTMLDialogElement;
    dlg?.showModal?.();
  }

  onDeleteDialogClose(result: string): void {
    if (result === 'confirm') {
      this.auth.logout();
      this.toast.warning('Account deleted.', 'Goodbye');
      this.router.navigate(['/']);
    }
  }

  onBreadcrumb(item: OatBreadcrumbItem): void {
    if (item.url) this.router.navigateByUrl(item.url);
  }
}
