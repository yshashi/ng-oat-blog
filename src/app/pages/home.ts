import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  NgOatCarousel,
  NgOatCardCarousel,
  NgOatCard,
  NgOatCardHeader,
  NgOatCardFooter,
  NgOatBadge,
  NgOatAvatar,
  NgOatChipGroup,
  NgOatChip,
  NgOatButton,
  NgOatAlert,
  NgOatSeparator,
  NgOatSkeleton,
  type NgOatCarouselSlide,
  type NgOatProductCard,
} from '@letsprogram/ng-oat';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../models/blog.model';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOatCarousel,
    NgOatCardCarousel,
    NgOatCard,
    NgOatCardHeader,
    NgOatCardFooter,
    NgOatBadge,
    NgOatAvatar,
    NgOatChipGroup,
    NgOatChip,
    NgOatButton,
    NgOatAlert,
    NgOatSeparator,
    NgOatSkeleton,
    SlicePipe,
    DatePipe,
  ],
  template: `
    <div class="container py-4">
      <!-- ── Welcome Alert ── -->
      @if (hasWelcomeBanner()) {
        <ng-oat-alert
          class="mb-6"
          variant="default"
          [dismissible]="true"
          (dismissed)="hasWelcomeBanner.set(false)"
        >
          <div class="text-xs">
            Welcome to <strong>LetsBlog</strong> — a modern blogging platform built entirely with
            <strong>&#64;letsprogram/ng-oat</strong> components. Explore, write, and share!
          </div>
        </ng-oat-alert>
      }

      <!-- ── Hero Carousel ── -->
      <section class="mb-6">
        <ng-oat-carousel
          [slides]="heroSlides()"
          [autoplay]="true"
          [interval]="6000"
          [loop]="true"
          [showCaptions]="true"
          aspectRatio="16:9"
          ariaLabel="Featured blog posts"
        />
      </section>

      <ng-oat-separator class="my-6" />

      <!-- ── Trending Posts (Card Carousel) ── -->
      @if (loading()) {
        <div class="grid cols-3">
          @for (_ of [1, 2, 3]; track $index) {
            <ng-oat-card class="vstack gap-2">
              <ng-oat-skeleton type="box" width="100%" />
              <div class="p-2 vstack gap-2">
                <ng-oat-skeleton type="line" width="80%" />
                <ng-oat-skeleton type="line" width="60%" />
                <ng-oat-skeleton type="line" width="40%" />
              </div>
            </ng-oat-card>
          }
        </div>
      } @else {
        <section class="mb-6">
          <ng-oat-card-carousel
            heading="Trending Posts"
            ariaLabel="Trending blog posts"
            [items]="trendingCards()"
            [showSeeAll]="true"
            (seeAllClick)="goToBlogs()"
            (cardClick)="onCardClick($event)"
          />
        </section>
      }

      <ng-oat-separator class="my-6" />

      <!-- ── Latest Posts Grid ── -->
      <section class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <h2 class="mt-0 mb-0">Latest Posts</h2>
          <ng-oat-button variant="default" btnStyle="outline" size="small" routerLink="/blogs">
            View All
          </ng-oat-button>
        </div>

        @if (loading()) {
          <div class="grid cols-3">
            @for (_ of [1, 2, 3, 4, 5, 6]; track $index) {
              <ng-oat-card class="vstack gap-2">
                <ng-oat-skeleton type="box" width="100%" />
                <div class="p-2 vstack gap-2">
                  <ng-oat-skeleton type="line" width="80%" />
                  <ng-oat-skeleton type="line" width="60%" />
                  <ng-oat-skeleton type="line" width="40%" />
                </div>
              </ng-oat-card>
            }
          </div>
        } @else {
          <div class="grid cols-3">
            @for (post of latestPosts(); track post.id) {
              <ng-oat-card class="clickable" (click)="goToPost(post)">
                <img [src]="post.coverImage" [alt]="post.title" class="w-full" />
                <ng-oat-card-header>
                  <div class="flex justify-between items-center mt-1">
                    <ng-oat-badge [variant]="getCategoryVariant(post.category.slug)">
                      {{ post.category.label }}
                    </ng-oat-badge>
                    <span class="text-xs text-light">{{ post.readingTime }} min read</span>
                  </div>
                  <h3 class="mt-0 mb-1" style="font-size: 1rem;">{{ post.title }}</h3>
                  <p class="text-sm text-light mt-0">{{ post.excerpt | slice: 0 : 100 }}...</p>
                </ng-oat-card-header>
                <ng-oat-card-footer class="w-100">
                  <div class="flex justify-between items-center gap-4">
                    <div class="hstack gap-1 items-center">
                      <ng-oat-avatar
                        [src]="post.author.avatar"
                        [alt]="post.author.name"
                        size="sm"
                      />
                      <span class="text-sm">{{ post.author.name }}</span>
                    </div>
                    <span class="text-xs text-light">{{ post.createdAt | date: 'MMM d' }}</span>
                  </div>
                </ng-oat-card-footer>
              </ng-oat-card>
            }
          </div>
        }
      </section>

      <ng-oat-separator class="my-6" />

      <!-- ── Popular Tags ── -->
      <section class="mb-6">
        <h2 class="mt-0 mb-2">Popular Tags</h2>
        <ng-oat-chip-group [multiple]="false" ariaLabel="Popular tags">
          @for (tag of allTags(); track tag) {
            <ng-oat-chip
              [selectable]="true"
              [chipValue]="tag"
              variant="outline"
              (selectedChange)="onTagSelect(tag)"
            >
              {{ tag }}
            </ng-oat-chip>
          }
        </ng-oat-chip-group>
      </section>

      <ng-oat-separator class="my-6" />

      <!-- ── CTA Section ── -->
      <section class="text-center py-8">
        <h2 class="mt-0 mb-2">Ready to Start Writing?</h2>
        <p class="text-light mb-4">Share your knowledge with the developer community.</p>
        <div class="center hstack gap-2">
          <ng-oat-button variant="default" btnStyle="filled" size="large" routerLink="/register">
            Get Started
          </ng-oat-button>
          <ng-oat-button variant="default" btnStyle="outline" size="large" routerLink="/blogs">
            Browse Posts
          </ng-oat-button>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class HomePage implements OnInit {
  private readonly blog = inject(BlogService);
  private readonly router = inject(Router);

  loading = signal(true);
  hasWelcomeBanner = signal(true);

  heroSlides = signal<NgOatCarouselSlide[]>([]);
  trendingCards = signal<NgOatProductCard[]>([]);
  latestPosts = signal<BlogPost[]>([]);
  allTags = signal<string[]>([]);

  ngOnInit(): void {
    // Simulate a brief loading state
    setTimeout(() => {
      const published = this.blog.publishedPosts();
      const featured = this.blog.featuredPosts();

      this.heroSlides.set(
        featured.slice(0, 4).map((p) => ({
          src: p.coverImage,
          alt: p.title,
          title: p.title,
          description: p.excerpt.substring(0, 120) + '...',
        })),
      );

      this.trendingCards.set(
        published
          .sort((a, b) => b.views - a.views)
          .slice(0, 8)
          .map((p) => ({
            id: p.slug,
            image: p.coverImage,
            imageAlt: p.title,
            title: p.title,
            description: p.excerpt.substring(0, 80) + '...',
            badge: p.category.label,
          })),
      );

      this.latestPosts.set(published.slice(0, 6));

      const tags = new Set<string>();
      published.forEach((p) => p.tags.forEach((t) => tags.add(t)));
      this.allTags.set([...tags]);

      this.loading.set(false);
    }, 2000);
  }

  goToBlogs(): void {
    this.router.navigate(['/blogs']);
  }

  goToPost(post: BlogPost): void {
    this.router.navigate(['/blogs', post.slug]);
  }

  onCardClick(card: NgOatProductCard): void {
    this.router.navigate(['/blogs', card.id]);
  }

  onTagSelect(tag: string): void {
    this.router.navigate(['/blogs'], { queryParams: { q: tag } });
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
