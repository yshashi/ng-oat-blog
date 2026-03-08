import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  NgOatBreadcrumb,
  NgOatSearchInput,
  NgOatSelect,
  NgOatToggleGroup,
  NgOatToggle,
  NgOatChipGroup,
  NgOatChip,
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatBadge,
  NgOatAvatar,
  NgOatTooltipComponent,
  NgOatPagination,
  NgOatSkeleton,
  NgOatAlert,
  NgOatButton,
  NgOatSeparator,
  type OatBreadcrumbItem,
} from '@letsprogram/ng-oat';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../models/blog.model';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-blogs',
  imports: [
    NgOatBreadcrumb,
    NgOatSearchInput,
    NgOatSelect,
    NgOatToggleGroup,
    NgOatToggle,
    NgOatChipGroup,
    NgOatChip,
    NgOatCard,
    NgOatCardHeader,
    NgOatCardFooter,
    NgOatBadge,
    NgOatAvatar,
    NgOatTooltipComponent,
    NgOatPagination,
    NgOatSkeleton,
    NgOatAlert,
    NgOatButton,
    NgOatSeparator,
    SlicePipe,
    DatePipe,
  ],
  template: `
    <div class="container py-4">
      <!-- ── Breadcrumb + Header ── -->
      <div class="mb-6">
        <ng-oat-breadcrumb [items]="breadcrumbs" (navigate)="onBreadcrumb($event)" />
        <h1 class="mt-2 mb-1">Blog Posts</h1>
        <p class="mt-0 text-light">
          Discover articles on Angular, TypeScript, CSS, DevOps, and more.
        </p>
      </div>

      <!-- ── Toolbar: Search + Sort + View Toggle ── -->
      <div class="flex items-center justify-between gap-4">
        <div class="toolbar-left">
          <ng-oat-search-input
            placeholder="Filter posts..."
            [debounceMs]="300"
            (search)="onSearch($event)"
          />
        </div>

        <div class="vstack">
          <ng-oat-select
            label=""
            placeholder="Sort by"
            [options]="sortOptions"
            [(value)]="sortBy"
          />

          <ng-oat-toggle-group class="mx-auto" [(value)]="viewMode">
            <ng-oat-tooltip text="Grid view" position="bottom">
              <ng-oat-toggle class="mr-2" toggleValue="grid" ariaLabel="Grid view">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </ng-oat-toggle>
            </ng-oat-tooltip>
            <ng-oat-tooltip text="List view" position="bottom">
              <ng-oat-toggle toggleValue="list" ariaLabel="List view">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </ng-oat-toggle>
            </ng-oat-tooltip>
          </ng-oat-toggle-group>
        </div>
      </div>

      <!-- ── Category Chips ── -->
      <section class="mt-4 mb-4">
        <ng-oat-chip-group
          [multiple]="false"
          ariaLabel="Filter by category"
          [(value)]="activeCategory"
        >
          @for (cat of categories; track cat.slug) {
            <ng-oat-chip [chipValue]="cat.slug" [selectable]="true" variant="outline">
              {{ cat.label }}
            </ng-oat-chip>
          }
        </ng-oat-chip-group>
      </section>

      <ng-oat-separator class="mb-6" />

      <!-- ── Loading State ── -->
      @if (loading()) {
        <div class="grid cols-3 mt-4 gap-4">
          @for (_ of [1, 2, 3, 4, 5, 6]; track $index) {
            <ng-oat-card>
              <ng-oat-skeleton type="box" width="100%" />
              <div class="p-2 vstack gap-2">
                <ng-oat-skeleton type="line" width="40%" />
                <ng-oat-skeleton type="line" width="90%" />
                <ng-oat-skeleton type="line" width="70%" />
                <ng-oat-skeleton type="line" width="50%" />
              </div>
            </ng-oat-card>
          }
        </div>
      }

      <!-- ── Empty State ── -->
      @if (!loading() && pagedPosts().length === 0) {
        <div class="mt-6">
          <ng-oat-alert variant="warning">
            No posts found matching your criteria. Try a different search term or category.
          </ng-oat-alert>
          <div class="text-center mt-4">
            <ng-oat-button variant="default" btnStyle="outline" (clicked)="clearFilters()">
              Clear All Filters
            </ng-oat-button>
          </div>
        </div>
      }

      <!-- ── Grid View ── -->
      @if (!loading() && pagedPosts().length > 0 && viewMode() === 'grid') {
        <div class="grid cols-3 mt-4 gap-4">
          @for (post of pagedPosts(); track post.id) {
            <ng-oat-card class="clickable" (click)="goToPost(post)">
              <img [src]="post.coverImage" [alt]="post.title" class="w-full" />
              <ng-oat-card-header>
                <div class="flex justify-between my-2">
                  <ng-oat-badge [variant]="getCategoryVariant(post.category.slug)">
                    {{ post.category.label }}
                  </ng-oat-badge>
                  <span class="text-xs text-light">{{ post.readingTime }} min read</span>
                </div>
                <h3 class="mt-0 mb-2">{{ post.title }}</h3>
                <p class="text-sm text-light">{{ post.excerpt | slice: 0 : 100 }}...</p>
              </ng-oat-card-header>
              <ng-oat-card-footer>
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-sm">
                    <ng-oat-avatar [src]="post.author.avatar" [alt]="post.author.name" size="sm" />
                    <span class="text-sm">{{ post.author.name }}</span>
                  </div>
                  <ng-oat-tooltip [text]="post.views + ' views'" position="top">
                    <span class="text-xs text-light">{{ post.createdAt | date: 'MMM d, y' }}</span>
                  </ng-oat-tooltip>
                </div>
              </ng-oat-card-footer>
            </ng-oat-card>
          }
        </div>
      }

      <!-- ── List View ── -->
      @if (!loading() && pagedPosts().length > 0 && viewMode() === 'list') {
        <div class="flex flex-col gap-4 mt-4">
          @for (post of pagedPosts(); track post.id) {
            <ng-oat-card class="clickable" (click)="goToPost(post)">
              <div class="flex gap-4">
                <img
                  [src]="post.coverImage"
                  [alt]="post.title"
                  class="blog-card-image-sm"
                  style="width:200px;min-width:200px;height:140px;object-fit:cover;flex-shrink:0;border-radius:var(--ot-radius,0.5rem)"
                />
                <div class="flex-1 py-2">
                  <div class="flex items-center gap-sm mb-1">
                    <ng-oat-badge [variant]="getCategoryVariant(post.category.slug)">
                      {{ post.category.label }}
                    </ng-oat-badge>
                    <span class="text-xs text-light">{{ post.readingTime }} min read</span>
                  </div>
                  <h3 class="mt-0 mb-1" style="font-size:1rem;line-height:1.3">{{ post.title }}</h3>
                  <p class="text-sm text-light mt-0 mb-1">{{ post.excerpt | slice: 0 : 160 }}...</p>
                  <div class="flex items-center gap-sm">
                    <ng-oat-avatar [src]="post.author.avatar" [alt]="post.author.name" size="sm" />
                    <span class="text-sm">{{ post.author.name }}</span>
                    <span class="text-xs text-light"
                      >· {{ post.createdAt | date: 'MMM d, y' }}</span
                    >
                  </div>
                </div>
              </div>
            </ng-oat-card>
          }
        </div>
      }

      <!-- ── Pagination ── -->
      @if (!loading() && totalPages() > 1) {
        <div class="flex justify-center mt-6 mb-4">
          <ng-oat-pagination
            [totalPages]="totalPages()"
            [currentPage]="currentPage()"
            [maxVisible]="5"
            (pageChange)="onPageChange($event)"
          />
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class BlogsPage implements OnInit {
  private readonly blog = inject(BlogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(true);
  searchQuery = signal('');
  sortBy = signal('newest');
  viewMode = signal('grid');
  activeCategory = signal('');
  currentPage = signal(1);
  readonly pageSize = 6;

  breadcrumbs: OatBreadcrumbItem[] = [{ label: 'Home', url: '/' }, { label: 'Blogs' }];

  sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Most Liked', value: 'liked' },
  ];

  categories = this.blog.categories;

  filteredPosts = computed(() => {
    let posts = this.blog.publishedPosts();
    const q = this.searchQuery().toLowerCase();
    const cat = this.activeCategory();

    if (q) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (cat) {
      if (cat === 'all') return posts;
      posts = posts.filter((p) => p.category.slug === cat);
      return posts;
    }

    const sort = this.sortBy();
    switch (sort) {
      case 'oldest':
        posts = [...posts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'popular':
        posts = [...posts].sort((a, b) => b.views - a.views);
        break;
      case 'liked':
        posts = [...posts].sort((a, b) => b.likes - a.likes);
        break;
      default:
        posts = [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return posts;
  });

  totalPages = computed(() => Math.ceil(this.filteredPosts().length / this.pageSize));

  pagedPosts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPosts().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    // Read initial search query from URL
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
    });
    setTimeout(() => this.loading.set(false), 500);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.activeCategory.set('');
    this.sortBy.set('newest');
    this.currentPage.set(1);
  }

  goToPost(post: BlogPost): void {
    this.router.navigate(['/blogs', post.slug]);
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
