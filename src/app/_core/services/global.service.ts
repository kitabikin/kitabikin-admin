import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalService {
  constructor(@Inject(DOCUMENT) private dom: any) {}

  readonly title: string = 'Kitabikin.com';

  private sidebarSource = new BehaviorSubject('This Sidebar');
  currentSidebar = this.sidebarSource.asObservable();

  private toggleSidebarSource = new BehaviorSubject(false);
  currentToggleSidebar = this.toggleSidebarSource.asObservable();

  private labelSource = new BehaviorSubject('This Label');
  currentLabel = this.labelSource.asObservable();

  private descriptionSource = new BehaviorSubject('This Description');
  currentDescription = this.descriptionSource.asObservable();

  private breadcrumbSource = new BehaviorSubject([]);
  currentBreadcrumb = this.breadcrumbSource.asObservable();

  private toggleMobileExpandedSource = new BehaviorSubject(false);
  currentToggleMobileExpanded = this.toggleMobileExpandedSource.asObservable();

  changeSidebar(sidebar: string): void {
    this.sidebarSource.next(sidebar);
  }

  changeToggleSidebar(toggleSidebar: boolean): void {
    this.toggleSidebarSource.next(toggleSidebar);
  }

  changeLabel(label: string): void {
    this.labelSource.next(label);
  }

  changeDescription(description: string): void {
    this.descriptionSource.next(description);
  }

  changeBreadcrumb(breadcrumb: any): void {
    this.breadcrumbSource.next(breadcrumb);
  }

  changeToggleMobileExpanded(toggleMobileExpanded: boolean): void {
    this.toggleMobileExpandedSource.next(toggleMobileExpanded);
  }

  changeCanonicalURL(url?: string): void {
    const canURL = url === undefined ? this.dom.URL : url;
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }

  currentURL(url?: string): string {
    const URL = url === undefined ? this.dom.URL : url;
    return URL;
  }
}
