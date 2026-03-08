import { Injectable, signal, computed } from '@angular/core';
import { BlogPost, Category, BLOG_POSTS, CATEGORIES } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly _posts = signal<BlogPost[]>([...BLOG_POSTS]);

  readonly posts = this._posts.asReadonly();
  readonly categories: Category[] = CATEGORIES;

  readonly publishedPosts = computed(() =>
    this._posts().filter(p => p.status === 'published' && p.visibility === 'public')
  );

  readonly featuredPosts = computed(() =>
    this.publishedPosts().filter(p => p.featured)
  );

  getBySlug(slug: string): BlogPost | undefined {
    return this._posts().find(p => p.slug === slug);
  }

  getByCategory(categorySlug: string): BlogPost[] {
    return this.publishedPosts().filter(p => p.category.slug === categorySlug);
  }

  search(query: string): BlogPost[] {
    const q = query.toLowerCase();
    return this.publishedPosts().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  create(post: Partial<BlogPost>): BlogPost {
    const newPost: BlogPost = {
      id: `b${Date.now()}`,
      slug: this.slugify(post.title ?? 'untitled'),
      title: post.title ?? '',
      subtitle: post.subtitle ?? '',
      content: post.content ?? '',
      excerpt: post.excerpt ?? post.content?.substring(0, 150) ?? '',
      coverImage: post.coverImage ?? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
      category: post.category ?? CATEGORIES[0],
      tags: post.tags ?? [],
      author: post.author ?? BLOG_POSTS[0].author,
      createdAt: new Date(),
      updatedAt: new Date(),
      readingTime: Math.ceil((post.content?.split(' ').length ?? 100) / 200),
      views: 0,
      likes: 0,
      commentsCount: 0,
      status: post.status ?? 'draft',
      featured: post.featured ?? false,
      allowComments: post.allowComments ?? true,
      visibility: post.visibility ?? 'public',
    };
    this._posts.update(list => [newPost, ...list]);
    return newPost;
  }

  update(id: string, changes: Partial<BlogPost>): void {
    this._posts.update(list =>
      list.map(p => p.id === id ? { ...p, ...changes, updatedAt: new Date() } : p)
    );
  }

  delete(id: string): void {
    this._posts.update(list => list.filter(p => p.id !== id));
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
}
