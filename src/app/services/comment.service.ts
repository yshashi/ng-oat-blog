import { Injectable, signal } from '@angular/core';
import { BlogComment, COMMENTS, AUTHORS } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly _comments = signal<BlogComment[]>([...COMMENTS]);

  getByBlogId(blogId: string): BlogComment[] {
    return this._comments().filter((c) => c.blogId === blogId);
  }

  add(blogId: string, content: string): BlogComment {
    const comment: BlogComment = {
      id: `cm${Date.now()}`,
      blogId,
      author: AUTHORS[0],
      content,
      createdAt: new Date(),
    };
    this._comments.update((list) => [...list, comment]);
    return comment;
  }

  delete(commentId: string): void {
    this._comments.update((list) => list.filter((c) => c.id !== commentId));
  }
}
