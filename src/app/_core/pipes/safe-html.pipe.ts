import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(html: string): SafeHtml {
    const sanitizedContent = DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      ADD_TAGS: ['iframe'],
    });
    return this.domSanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }
}
