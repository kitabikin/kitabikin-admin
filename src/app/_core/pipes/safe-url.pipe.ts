import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(html: string): SafeUrl {
    const sanitizedContent = DOMPurify.sanitize(html);
    return this.domSanitizer.bypassSecurityTrustUrl(html);
  }
}
