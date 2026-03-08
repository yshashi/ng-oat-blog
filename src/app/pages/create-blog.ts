import { Component, inject, signal, computed, OnInit, viewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  NgOatBreadcrumb,
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatInput,
  NgOatTextarea,
  NgOatSelect,
  NgOatRadioGroup,
  NgOatChipInput,
  NgOatFileUpload,
  NgOatSwitch,
  NgOatCheckbox,
  NgOatFormError,
  NgOatButton,
  NgOatProgress,
  NgOatDialogComponent,
  NgOatAlert,
  NgOatSeparator,
  NgOatFormsCva,
  type OatBreadcrumbItem,
} from '@letsprogram/ng-oat';
import { NgOatToast } from '@letsprogram/ng-oat';
import { BlogService } from '../services/blog.service';
import { AuthService } from '../services/auth.service';
import { CATEGORIES } from '../models/blog.model';

@Component({
  selector: 'app-create-blog',
  imports: [
    ReactiveFormsModule,
    NgOatBreadcrumb,
    NgOatCard,
    NgOatCardHeader,
    NgOatCardFooter,
    NgOatInput,
    NgOatTextarea,
    NgOatSelect,
    NgOatRadioGroup,
    NgOatChipInput,
    NgOatFileUpload,
    NgOatSwitch,
    NgOatCheckbox,
    NgOatFormError,
    NgOatButton,
    NgOatProgress,
    NgOatDialogComponent,
    NgOatAlert,
    NgOatSeparator,
    ...NgOatFormsCva,
  ],
  template: `
    <div class="container-md py-4 pb-8">
      <!-- ── Breadcrumb ── -->
      <div class="mb-6">
        <ng-oat-breadcrumb [items]="breadcrumbs()" (navigate)="onBreadcrumb($event)" />
        <h1 class="mt-2 mb-1">{{ isEditMode() ? 'Edit Post' : 'Create New Post' }}</h1>
        <p class="mt-0 text-light">
          {{ isEditMode() ? 'Update your blog post.' : 'Write and publish a new article.' }}
        </p>
      </div>

      <!-- ── Upload Progress (simulated) ── -->
      @if (publishing()) {
        <ng-oat-progress [value]="uploadProgress()" [max]="100" class="mb-2" />
        <p class="text-sm text-light text-center mb-4">Publishing... {{ uploadProgress() }}%</p>
      }

      <form [formGroup]="postForm" (ngSubmit)="onSubmit('published')">
        <ng-oat-card>
          <ng-oat-card-header>
            <h2 class="mt-0 mb-0">Post Details</h2>
          </ng-oat-card-header>

          <div class="flex flex-col gap-4 mt-4 mb-2">
            <!-- Title -->
            <div>
              <ng-oat-input
                label="Title"
                placeholder="An awesome blog post title"
                formControlName="title"
                [required]="true"
              />
              <ng-oat-form-error [errors]="getErrors('title')" [show]="isFieldInvalid('title')" />
            </div>

            <!-- Subtitle -->
            <div>
              <ng-oat-input
                label="Subtitle"
                placeholder="A short summary line"
                formControlName="subtitle"
              />
            </div>

            <ng-oat-separator class="my-4" />

            <!-- Content -->
            <div>
              <ng-oat-textarea
                label="Content"
                placeholder="Write your article in Markdown..."
                [rows]="12"
                formControlName="content"
                [required]="true"
              />
              <ng-oat-form-error
                [errors]="getErrors('content')"
                [show]="isFieldInvalid('content')"
              />
            </div>

            <ng-oat-separator class="my-4" />

            <!-- Category -->
            <div>
              <ng-oat-select
                label="Category"
                placeholder="Select a category"
                [options]="categoryOptions"
                formControlName="category"
                [required]="true"
              />
              <ng-oat-form-error
                [errors]="getErrors('category')"
                [show]="isFieldInvalid('category')"
              />
            </div>

            <!-- Visibility -->
            <ng-oat-radio-group
              label="Visibility"
              [options]="visibilityOptions"
              formControlName="visibility"
            />

            <!-- Tags -->
            <div>
              <label class="text-sm fw-medium">Tags</label>
              <ng-oat-chip-input
                placeholder="Type a tag and press Enter..."
                [(chips)]="tags"
                variant="outline"
                [maxChips]="10"
              />
            </div>

            <!-- Cover Image -->
            <div>
              <ng-oat-file-upload
                label="Cover Image"
                accept="image/*"
                (filesSelected)="onCoverSelected($event)"
              />
              @if (coverFileName()) {
                <ng-oat-alert
                  variant="success"
                  [dismissible]="true"
                  (dismissed)="coverFileName.set('')"
                >
                  Selected: {{ coverFileName() }}
                </ng-oat-alert>
              }
            </div>

            <ng-oat-separator class="my-4" />

            <!-- Toggles -->
            <div class="flex flex-wrap gap-lg">
              <ng-oat-switch label="Allow comments" formControlName="allowComments" />
              <ng-oat-checkbox label="Featured post" formControlName="featured" />
            </div>
          </div>

          <ng-oat-card-footer>
            <div class="flex justify-between w-full flex-wrap gap-sm">
              <div class="flex gap-sm">
                <ng-oat-button variant="default" btnStyle="ghost" (clicked)="confirmDiscard()">
                  Cancel
                </ng-oat-button>
                <ng-oat-button
                  variant="default"
                  btnStyle="outline"
                  (clicked)="saveDraft()"
                  [disabled]="publishing()"
                >
                  Save Draft
                </ng-oat-button>
              </div>
              <ng-oat-button
                type="submit"
                variant="default"
                btnStyle="filled"
                [disabled]="publishing()"
              >
                {{ isEditMode() ? 'Update Post' : 'Publish' }}
              </ng-oat-button>
            </div>
          </ng-oat-card-footer>
        </ng-oat-card>
      </form>

      <!-- ── Discard Dialog ── -->
      <ng-oat-dialog (closed)="onDiscardDialogClose($event)">
        <h3 header class="mt-0 mb-0">Discard Changes?</h3>
        <p>You have unsaved changes. Are you sure you want to leave?</p>
        <div footer class="flex justify-between w-full">
          <ng-oat-button
            variant="default"
            btnStyle="ghost"
            (clicked)="discardDialog()?.close('stay')"
          >
            Keep Editing
          </ng-oat-button>
          <ng-oat-button
            variant="danger"
            btnStyle="filled"
            (clicked)="discardDialog()?.close('discard')"
          >
            Discard
          </ng-oat-button>
        </div>
      </ng-oat-dialog>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CreateBlogPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly blog = inject(BlogService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NgOatToast);

  discardDialog = viewChild(NgOatDialogComponent);

  isEditMode = signal(false);
  editSlug = signal('');
  publishing = signal(false);
  uploadProgress = signal(0);
  coverFileName = signal('');
  tags = signal<string[]>([]);

  postForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    subtitle: [''],
    content: ['', [Validators.required, Validators.minLength(20)]],
    category: ['', Validators.required],
    visibility: ['public'],
    allowComments: [true],
    featured: [false],
  });

  categoryOptions = CATEGORIES.map((c) => ({ label: c.label, value: c.slug }));

  visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Draft', value: 'draft' },
  ];

  breadcrumbs = computed<OatBreadcrumbItem[]>(() => [
    { label: 'Home', url: '/' },
    { label: 'Blogs', url: '/blogs' },
    { label: this.isEditMode() ? 'Edit Post' : 'Create New Post' },
  ]);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        const existing = this.blog.getBySlug(slug);
        if (existing) {
          this.isEditMode.set(true);
          this.editSlug.set(slug);
          this.postForm.patchValue({
            title: existing.title,
            subtitle: existing.subtitle,
            content: existing.content,
            category: existing.category.slug,
            visibility: existing.visibility,
            allowComments: existing.allowComments,
            featured: existing.featured,
          });
          this.tags.set([...existing.tags]);
        }
      }
    });
  }

  getErrors(field: string): string[] {
    const ctrl = this.postForm.get(field);
    if (!ctrl || !ctrl.errors) return [];
    const errors: string[] = [];
    if (ctrl.errors['required']) errors.push(`${this.capitalise(field)} is required.`);
    if (ctrl.errors['minlength']) {
      const req = ctrl.errors['minlength'].requiredLength;
      errors.push(`${this.capitalise(field)} must be at least ${req} characters.`);
    }
    return errors;
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.postForm.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onCoverSelected(files: File[]): void {
    if (files.length) {
      this.coverFileName.set(files[0].name);
      this.toast.info(`Cover image selected: ${files[0].name}`, 'File');
    }
  }

  saveDraft(): void {
    this.doSubmit('draft');
  }

  onSubmit(status: 'published' | 'draft'): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.toast.warning('Please fix the errors before publishing.', 'Validation');
      return;
    }
    this.doSubmit(status);
  }

  private doSubmit(status: 'published' | 'draft'): void {
    this.publishing.set(true);
    this.uploadProgress.set(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress.update((v) => Math.min(v + 15, 95));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      this.uploadProgress.set(100);

      const val = this.postForm.value;
      const catObj = CATEGORIES.find((c) => c.slug === val.category) ?? CATEGORIES[0];

      if (this.isEditMode()) {
        const existing = this.blog.getBySlug(this.editSlug());
        if (existing) {
          this.blog.update(existing.id, {
            title: val.title,
            subtitle: val.subtitle,
            content: val.content,
            category: catObj,
            visibility: val.visibility,
            status,
            allowComments: val.allowComments,
            featured: val.featured,
            tags: this.tags(),
          });
          this.toast.success('Post updated successfully!', 'Updated');
        }
      } else {
        this.blog.create({
          title: val.title,
          subtitle: val.subtitle,
          content: val.content,
          category: catObj,
          visibility: val.visibility,
          status,
          allowComments: val.allowComments,
          featured: val.featured,
          tags: this.tags(),
          author: this.auth.currentUser() ?? undefined,
        });
        this.toast.success(
          status === 'published' ? 'Post published!' : 'Draft saved!',
          status === 'published' ? 'Published' : 'Saved',
        );
      }

      this.publishing.set(false);
      this.router.navigate(['/blogs']);
    }, 1500);
  }

  confirmDiscard(): void {
    if (this.postForm.dirty) {
      const dlg = this.discardDialog();
      dlg?.showModal();
    } else {
      this.router.navigate(['/blogs']);
    }
  }

  onDiscardDialogClose(result: string): void {
    if (result === 'discard') {
      this.router.navigate(['/blogs']);
    }
  }

  onBreadcrumb(item: OatBreadcrumbItem): void {
    if (item.url) this.router.navigateByUrl(item.url);
  }

  private capitalise(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
