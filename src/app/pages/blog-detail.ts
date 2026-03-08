import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, SlicePipe } from '@angular/common';
import {
  NgOatBreadcrumb,
  NgOatAvatar,
  NgOatBadge,
  NgOatChipGroup,
  NgOatChip,
  NgOatMeter,
  NgOatSplitButton,
  NgOatDialogComponent,
  NgOatDropdownComponent,
  NgOatTooltipComponent,
  NgOatTabsComponent,
  NgOatTextarea,
  NgOatButton,
  NgOatAlert,
  NgOatFormError,
  NgOatSeparator,
  NgOatSpinner,
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatCardCarousel,
  type OatBreadcrumbItem,
  type NgOatProductCard,
} from '@letsprogram/ng-oat';
import { NgOatToast } from '@letsprogram/ng-oat';
import { BlogService } from '../services/blog.service';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { BlogPost, BlogComment } from '../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    NgOatBreadcrumb,
    NgOatAvatar,
    NgOatBadge,
    NgOatChipGroup,
    NgOatChip,
    NgOatMeter,
    NgOatSplitButton,
    NgOatDialogComponent,
    NgOatDropdownComponent,
    NgOatTooltipComponent,
    NgOatTabsComponent,
    NgOatTextarea,
    NgOatButton,
    NgOatAlert,
    NgOatFormError,
    NgOatSeparator,
    NgOatSpinner,
    NgOatCard,
    NgOatCardCarousel,
  ],
  template: `
    @if (loading()) {
      <div class="container flex justify-center mt-4">
        <ng-oat-spinner size="large" />
      </div>
    } @else if (!post()) {
      <div class="container mt-4">
        <ng-oat-alert variant="danger">
          Post not found. It may have been deleted or the URL is incorrect.
        </ng-oat-alert>
        <div class="mt-2">
          <ng-oat-button variant="default" btnStyle="outline" routerLink="/blogs">
            ← Back to Blogs
          </ng-oat-button>
        </div>
      </div>
    } @else {
      <!-- ── Reading Progress Meter ── -->
      <div style="position:fixed;top:-12px;left:0;right:0;z-index:90">
        <!-- between --z-dropdown(50) and --z-drawer(150) -->
        <ng-oat-meter style="display:block" [value]="readingProgress()" [min]="0" [max]="100" />
      </div>

      <div class="container-md py-4">
        <!-- ── Breadcrumb ── -->
        <div class="mb-4">
          <ng-oat-breadcrumb [items]="breadcrumbs()" (navigate)="onBreadcrumb($event)" />
        </div>

        <!-- ── Article Header ── -->
        <article>
          <header class="pt-2">
            <div class="flex items-center gap-sm mb-2">
              <ng-oat-badge [variant]="getCategoryVariant(post()!.category.slug)">
                {{ post()!.category.label }}
              </ng-oat-badge>
              <ng-oat-badge variant="outline">{{ post()!.readingTime }} min read</ng-oat-badge>
            </div>

            <h1 class="mt-0 mb-1">{{ post()!.title }}</h1>
            <p class="text-light text-lg mt-0 mb-3">{{ post()!.subtitle }}</p>

            <div class="flex items-center justify-between flex-wrap gap-md">
              <div class="flex items-center gap-sm">
                <ng-oat-avatar
                  [src]="post()!.author.avatar"
                  [alt]="post()!.author.name"
                  size="default"
                />
                <div>
                  <span class="fw-medium">{{ post()!.author.name }}</span>
                  <div class="text-xs text-light">
                    {{ post()!.createdAt | date: 'MMMM d, y' }} · {{ post()!.views }} views
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-sm">
                <!-- Like button -->
                <ng-oat-tooltip text="Like this post" position="bottom">
                  <ng-oat-button
                    variant="default"
                    btnStyle="ghost"
                    [icon]="true"
                    ariaLabel="Like"
                    (clicked)="likePost()"
                  >
                    <span class="flex items-center gap-xs">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                      </svg>
                      {{ post()!.likes }}
                    </span>
                  </ng-oat-button>
                </ng-oat-tooltip>

                <!-- Bookmark -->
                <ng-oat-tooltip text="Bookmark" position="bottom">
                  <ng-oat-button
                    variant="default"
                    btnStyle="ghost"
                    [icon]="true"
                    ariaLabel="Bookmark"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </ng-oat-button>
                </ng-oat-tooltip>

                <!-- Share dropdown -->
                <ng-oat-dropdown>
                  <div trigger>
                    <ng-oat-button
                      variant="default"
                      btnStyle="ghost"
                      [icon]="true"
                      ariaLabel="Share"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </ng-oat-button>
                  </div>
                  <ng-oat-button
                    role="menuitem"
                    variant="default"
                    btnStyle="ghost"
                    (clicked)="copyLink()"
                  >
                    Copy Link
                  </ng-oat-button>
                  <ng-oat-button
                    role="menuitem"
                    variant="default"
                    btnStyle="ghost"
                    (clicked)="shareTwitter()"
                  >
                    Share on Twitter
                  </ng-oat-button>
                  <ng-oat-button
                    role="menuitem"
                    variant="default"
                    btnStyle="ghost"
                    (clicked)="shareLinkedIn()"
                  >
                    Share on LinkedIn
                  </ng-oat-button>
                </ng-oat-dropdown>

                <!-- Edit/Delete split button (author only) -->
                @if (auth.isLoggedIn()) {
                  <ng-oat-split-button
                    label="Edit"
                    variant="default"
                    btnStyle="outline"
                    size="small"
                    (clicked)="editPost()"
                  >
                    <ng-oat-button
                      role="menuitem"
                      variant="danger"
                      btnStyle="ghost"
                      (clicked)="confirmDelete()"
                    >
                      Delete Post
                    </ng-oat-button>
                  </ng-oat-split-button>
                }
              </div>
            </div>
          </header>

          <ng-oat-separator />

          <!-- ── Cover Image ── -->
          <img
            [src]="post()!.coverImage"
            [alt]="post()!.title"
            style="width:100%;max-height:480px;object-fit:cover;border-radius:var(--ot-radius);margin-bottom:2rem;display:block"
          />

          <!-- ── Article Body ── -->
          <div class="article-content" [innerHTML]="renderedContent()"></div>

          <ng-oat-separator />

          <!-- ── Tags ── -->
          <section class="mt-4 mb-4">
            <h4 class="mt-0 mb-1">Tags</h4>
            <ng-oat-chip-group [multiple]="false" ariaLabel="Post tags">
              @for (tag of post()!.tags; track tag) {
                <ng-oat-chip
                  [chipValue]="tag"
                  variant="outline"
                  [selectable]="true"
                  (selectedChange)="onTagClick(tag)"
                >
                  {{ tag }}
                </ng-oat-chip>
              }
            </ng-oat-chip-group>
          </section>

          <ng-oat-separator />

          <!-- ── Tabs: Comments | Related Posts ── -->
          <section class="mt-6">
            <ng-oat-tabs [tabs]="tabLabels()">
              <!-- Comments tab -->
              <div>
                @if (post()!.allowComments) {
                  <!-- Comment form -->
                  @if (auth.isLoggedIn()) {
                    <div class="mt-2">
                      <ng-oat-textarea
                        label="Write a comment"
                        placeholder="Share your thoughts..."
                        [rows]="3"
                        [(value)]="newCommentText"
                      />
                      @if (commentError()) {
                        <ng-oat-form-error [errors]="[commentError()]" [show]="true" />
                      }
                      <div class="mt-1">
                        <ng-oat-button
                          variant="default"
                          btnStyle="filled"
                          size="small"
                          (clicked)="postComment()"
                        >
                          Post Comment
                        </ng-oat-button>
                      </div>
                    </div>
                  } @else {
                    <ng-oat-alert variant="default" class="mt-2">
                      <a routerLink="/login">Sign in</a> to leave a comment.
                    </ng-oat-alert>
                  }

                  <ng-oat-separator />

                  <!-- Comments list -->
                  @if (comments().length === 0) {
                    <p class="text-light text-sm mt-2">No comments yet. Be the first!</p>
                  } @else {
                    <div class="flex flex-col gap-3 mt-2">
                      @for (comment of comments(); track comment.id) {
                        <ng-oat-card>
                          <div class="flex items-start gap-sm">
                            <ng-oat-avatar
                              [src]="comment.author.avatar"
                              [alt]="comment.author.name"
                              size="sm"
                            />
                            <div class="flex-1">
                              <div class="flex items-center gap-sm">
                                <span class="fw-medium text-sm">{{ comment.author.name }}</span>
                                <span class="text-xs text-light">{{
                                  comment.createdAt | date: 'MMM d, y'
                                }}</span>
                              </div>
                              <p class="text-sm mt-1 mb-0">{{ comment.content }}</p>
                            </div>
                          </div>
                        </ng-oat-card>
                      }
                    </div>
                  }
                } @else {
                  <ng-oat-alert variant="warning" class="mt-2">
                    Comments are disabled for this post.
                  </ng-oat-alert>
                }
              </div>

              <!-- Related Posts tab -->
              <div class="mt-2">
                @if (relatedCards().length > 0) {
                  <ng-oat-card-carousel
                    heading=""
                    ariaLabel="Related posts"
                    [items]="relatedCards()"
                    (cardClick)="onRelatedClick($event)"
                  />
                } @else {
                  <p class="text-light text-sm">No related posts found.</p>
                }
              </div>
            </ng-oat-tabs>
          </section>
        </article>

        <!-- ── Back Button ── -->
        <div class="mt-6 mb-6">
          <ng-oat-button variant="default" btnStyle="ghost" routerLink="/blogs">
            ← Back to Blogs
          </ng-oat-button>
        </div>
      </div>

      <!-- ── Delete Confirmation Dialog ── -->
      <ng-oat-dialog (closed)="onDialogClose($event)">
        <h3 header class="mt-0 mb-0">Delete Post?</h3>
        <p>Are you sure you want to delete "{{ post()!.title }}"? This action cannot be undone.</p>
        <div footer class="flex justify-between w-full">
          <ng-oat-button
            variant="default"
            btnStyle="ghost"
            (clicked)="deleteDialog()?.close('cancel')"
          >
            Cancel
          </ng-oat-button>
          <ng-oat-button
            variant="danger"
            btnStyle="filled"
            (clicked)="deleteDialog()?.close('confirm')"
          >
            Delete
          </ng-oat-button>
        </div>
      </ng-oat-dialog>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class BlogDetailPage implements OnInit, OnDestroy {
  private readonly blog = inject(BlogService);
  private readonly commentSvc = inject(CommentService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NgOatToast);

  readonly deleteDialog = signal<NgOatDialogComponent | undefined>(undefined);

  loading = signal(true);
  post = signal<BlogPost | null>(null);
  comments = signal<BlogComment[]>([]);
  newCommentText = signal('');
  commentError = signal('');
  readingProgress = signal(0);

  breadcrumbs = computed<OatBreadcrumbItem[]>(() => {
    const p = this.post();
    return [
      { label: 'Home', url: '/' },
      { label: 'Blogs', url: '/blogs' },
      { label: p?.title ?? 'Loading...' },
    ];
  });

  tabLabels = computed(() => [`Comments (${this.comments().length})`, 'Related Posts']);

  renderedContent = computed(() => {
    const p = this.post();
    if (!p) return '';
    // Render markdown-like content as HTML (simple approach)
    return p.content
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hublop])/gm, '<p>')
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```\w*\n?/g, '').trim();
        return `<pre><code>${code}</code></pre>`;
      });
  });

  relatedCards = computed<NgOatProductCard[]>(() => {
    const p = this.post();
    if (!p) return [];
    return this.blog
      .publishedPosts()
      .filter(
        (bp) =>
          bp.id !== p.id &&
          (bp.category.slug === p.category.slug || bp.tags.some((t) => p.tags.includes(t))),
      )
      .slice(0, 6)
      .map((bp) => ({
        id: bp.slug,
        image: bp.coverImage,
        imageAlt: bp.title,
        title: bp.title,
        description: bp.excerpt.substring(0, 80) + '...',
        badge: bp.category.label,
      }));
  });

  private scrollHandler = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.readingProgress.set(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) this.loadPost(slug);
    });
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  private loadPost(slug: string): void {
    this.loading.set(true);
    setTimeout(() => {
      const p = this.blog.getBySlug(slug);
      this.post.set(p ?? null);
      if (p) {
        this.comments.set(this.commentSvc.getByBlogId(p.id));
      }
      this.loading.set(false);
    }, 400);
  }

  likePost(): void {
    const p = this.post();
    if (p) {
      this.blog.update(p.id, { likes: p.likes + 1 });
      this.post.set({ ...p, likes: p.likes + 1 });
      this.toast.success('Post liked!', 'Liked');
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    this.toast.success('Link copied to clipboard!', 'Copied');
  }

  shareTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.post()?.title ?? '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  editPost(): void {
    this.router.navigate(['/blogs', this.post()?.slug, 'edit']);
  }

  confirmDelete(): void {
    const dlg = document.querySelector('ng-oat-dialog') as any;
    dlg?.showModal?.();
  }

  onDialogClose(result: string): void {
    if (result === 'confirm') {
      const p = this.post();
      if (p) {
        this.blog.delete(p.id);
        this.toast.success('Post deleted successfully.', 'Deleted');
        this.router.navigate(['/blogs']);
      }
    }
  }

  postComment(): void {
    const text = this.newCommentText().trim();
    if (!text) {
      this.commentError.set('Comment cannot be empty.');
      return;
    }
    this.commentError.set('');
    const p = this.post();
    if (p) {
      this.commentSvc.add(p.id, text);
      this.comments.set(this.commentSvc.getByBlogId(p.id));
      this.newCommentText.set('');
      this.toast.success('Comment posted!', 'Comment');
    }
  }

  onTagClick(tag: string): void {
    this.router.navigate(['/blogs'], { queryParams: { q: tag } });
  }

  onRelatedClick(card: NgOatProductCard): void {
    this.router.navigate(['/blogs', card.id]);
  }

  onBreadcrumb(item: OatBreadcrumbItem): void {
    if (item.url) this.router.navigateByUrl(item.url);
  }

  getCategoryVariant(slug: string): 'default' | 'secondary' | 'outline' | 'danger' | 'success' {
    const map: Record<string, 'default' | 'secondary' | 'outline' | 'danger' | 'success'> = {
      angular: 'danger',
      typescript: 'default',
      css: 'success',
      devops: 'secondary',
      design: 'outline',
      performance: 'default',
    };
    return map[slug] ?? 'default';
  }
}
