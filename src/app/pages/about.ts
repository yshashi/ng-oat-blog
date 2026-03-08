import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgOatAccordion,
  NgOatAlert,
  NgOatAvatar,
  NgOatBadge,
  NgOatButton,
  NgOatCard,
  NgOatCardHeader,
  NgOatDropdownComponent,
  NgOatSeparator,
  NgOatTabs,
  NgOatDropdown,
  NgOatTooltip,
  NgOatBreadcrumb,
  type OatBreadcrumbItem,
} from '@letsprogram/ng-oat';
import { TEAM_MEMBERS, FAQ_ITEMS, type TeamMember } from '../models/blog.model';

@Component({
  selector: 'app-about',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgOatAccordion,
    NgOatAlert,
    NgOatAvatar,
    NgOatBadge,
    NgOatButton,
    NgOatCard,
    NgOatCardHeader,
    NgOatSeparator,
    NgOatTabs,
    NgOatDropdownComponent,
    NgOatTooltip,
    NgOatBreadcrumb,
  ],
  template: `
    <div class="container py-4">
      <!-- ── Breadcrumb ── -->
      <div class="mb-6">
        <ng-oat-breadcrumb [items]="breadcrumbs" (navigate)="onBreadcrumb($event)" />
        <h1 class="mt-2 mb-1">About LetsBlog</h1>
        <p class="mt-0">
          A modern blogging platform built entirely with &#64;letsprogram/ng-oat components.
        </p>
      </div>

      <!-- ── Info Banner ── -->
      <ng-oat-alert class="mb-4">
        LetsBlog is an open-source showcase project demonstrating 50+ Angular components from the
        ng-oat library — including Signal Forms, Reactive Forms with CVA adapters, dark mode, and
        full accessibility.
      </ng-oat-alert>

      <ng-oat-separator />

      <!-- ── Sidebar Directive (Table of Contents) ── -->
      <div>
        <!-- ── Mission & Values (Tabs Directive) ── -->
        <section id="mission" class="page-section">
          <h2 class="mb-2">Mission & Values</h2>
          <ot-tabs ngOatTabs #missionTabs="ngOatTabs" (ngOatTabChange)="onTabChange($event)">
            <div role="tablist">
              <button role="tab">Our Mission</button>
              <button role="tab">Our Vision</button>
              <button role="tab">Our Values</button>
            </div>
            <div role="tabpanel">
              <ng-oat-card>
                <ng-oat-card-header>
                  <h3 class="mb-1">Mission</h3>
                </ng-oat-card-header>
                <p>
                  To empower developers with a modern, lightweight, and accessible component library
                  that makes building Angular applications a joy. We believe great developer
                  experience leads to great user experience.
                </p>
              </ng-oat-card>
            </div>
            <div role="tabpanel">
              <ng-oat-card>
                <ng-oat-card-header>
                  <h3 class="mb-1">Vision</h3>
                </ng-oat-card-header>
                <p>
                  A world where every web application is fast, accessible, and beautifully designed
                  — powered by open-source tools that anyone can use and contribute to.
                </p>
              </ng-oat-card>
            </div>
            <div role="tabpanel">
              <ng-oat-card>
                <ng-oat-card-header>
                  <h3 class="mb-1">Values</h3>
                </ng-oat-card-header>
                <ul>
                  <li>
                    <strong>Accessibility First</strong> — every component follows WAI-ARIA
                    guidelines.
                  </li>
                  <li>
                    <strong>Lightweight</strong> — no bloated dependencies. CSS-first approach.
                  </li>
                  <li>
                    <strong>Developer Joy</strong> — intuitive APIs, great documentation, and
                    signals-first.
                  </li>
                  <li><strong>Open Source</strong> — free to use, modify, and contribute back.</li>
                </ul>
              </ng-oat-card>
            </div>
          </ot-tabs>
        </section>

        <ng-oat-separator class="my-6" />

        <!-- ── Team Section ── -->
        <section id="team" class="mb-6">
          <h2 class="mb-2">Our Team</h2>
          <div class="grid cols-4 gap-4 mt-2">
            @for (member of teamMembers; track member.name) {
              <ng-oat-card>
                <div class="text-center">
                  <ng-oat-avatar [src]="member.avatar" [alt]="member.name" size="lg" />
                  <h4 class="mb-0">{{ member.name }}</h4>
                  <ng-oat-badge [variant]="getRoleBadge(member.role)">{{
                    member.role
                  }}</ng-oat-badge>
                  <p class="text-sm text-light">{{ member.bio }}</p>
                  <div class="center">
                    <ng-oat-tooltip text="GitHub profile" position="bottom" ngOatTooltip>
                      <ng-oat-button
                        variant="default"
                        btnStyle="ghost"
                        [icon]="true"
                        ariaLabel="GitHub"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                          />
                        </svg>
                      </ng-oat-button>
                    </ng-oat-tooltip>
                    <ng-oat-tooltip text="Twitter / X" position="bottom" ngOatTooltip>
                      <ng-oat-button
                        variant="default"
                        btnStyle="ghost"
                        [icon]="true"
                        ariaLabel="Twitter"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          />
                        </svg>
                      </ng-oat-button>
                    </ng-oat-tooltip>
                  </div>
                </div>
              </ng-oat-card>
            }
          </div>
        </section>

        <ng-oat-separator class="my-6" />

        <!-- ── FAQ Section (Accordion) ── -->
        <section id="faq">
          <h2 class="mb-2">Frequently Asked Questions</h2>
          <ng-oat-accordion [items]="faqItems" group="faq" />
        </section>

        <ng-oat-separator class="my-6" />

        <!-- ── Contact Section (Dropdown Directive) ── -->
        <section>
          <h2 class="mb-2">Get In Touch</h2>
          <ng-oat-dropdown #dd2>
            <button trigger class="outline" (clicked)="dd2.toggle()">
              {{ dd2.isOpen() ? 'Hide' : 'Show' }} Contact Details
            </button>
            <div role="menuitem" class="vstack">
              <p class="text-xs mb-0"><strong>Email:</strong> hello&#64;letsblog.dev</p>
              <p class="text-xs mb-0">
                <strong>GitHub:</strong> github.com/yshashi/ng-oat-workspace
              </p>
              <p class="text-xs mb-0"><strong>Twitter:</strong> &#64;letsprogram</p>
            </div>
          </ng-oat-dropdown>

          <div class="text-center mt-4">
            <h3 class="mb-1">Want to contribute?</h3>
            <p class="text-light mb-2">
              We welcome contributions of all kinds — code, docs, design, and feedback.
            </p>
            <ng-oat-button
              variant="default"
              btnStyle="filled"
              size="large"
              ariaLabel="Open GitHub repository"
            >
              Star Us on GitHub ⭐
            </ng-oat-button>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AboutPage {
  private readonly router = inject(Router);

  teamMembers: TeamMember[] = TEAM_MEMBERS;
  faqItems = FAQ_ITEMS;

  breadcrumbs: OatBreadcrumbItem[] = [{ label: 'Home', url: '/' }, { label: 'About' }];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  onTabChange(_event: any): void {
    // Tab changed – no extra action needed
  }

  getRoleBadge(role: string): 'default' | 'secondary' | 'outline' | 'danger' | 'success' {
    const map: Record<string, 'default' | 'secondary' | 'outline' | 'danger' | 'success'> = {
      'Founder & Lead Dev': 'danger',
      'Frontend Lead': 'default',
      'DevOps Engineer': 'secondary',
      'UX Designer': 'success',
    };
    return map[role] ?? 'outline';
  }

  onBreadcrumb(item: OatBreadcrumbItem): void {
    if (item.url) this.router.navigateByUrl(item.url);
  }
}
