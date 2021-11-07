import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// SERVICE
import { GlobalService, SidebarService } from '@services/private';
import { state, style, trigger } from '@angular/animations';

import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: '[app-private-sidebar-main]',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar sidebar-light sidebar-main sidebar-expand-lg',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  animations: [
    trigger('slideUpDown', [
      state('0', style({ 'max-height': '0px', opacity: 0, display: 'none' })),
      state('1', style({ 'max-height': '*', opacity: 1, display: 'block' })),
    ]),
  ],
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  faBars = faBars;
  faTimes = faTimes;

  @ViewChildren('navSidebar') navSidebarEl!: QueryList<ElementRef>;
  @ViewChildren('navItem') navItemEl!: QueryList<ElementRef>;

  isMainResized = false;
  isMainUnfold = false;

  isMobileExpanded!: boolean;

  menu!: any[];
  menuEmitter$ = new BehaviorSubject<any[]>(this.menu);

  constructor(
    private cdRef: ChangeDetectorRef,
    private globalService: GlobalService,
    private sidebarService: SidebarService
  ) {
    this.globalService.currentToggleMobileExpanded.subscribe((current) => {
      this.isMobileExpanded = current;
    });

    this.sidebarService.currentSidebar.subscribe((current) => {
      this.menu = current.map((res: any) => ({ ...res }));
      this.menuEmitter$.next(this.menu);
    });
  }

  @HostBinding('class') get class() {
    const classes: string[] = [];

    if (this.isMainResized) {
      classes.push('sidebar-main-resized');
    } else {
      classes.filter((e) => e !== 'sidebar-main-resized');
    }

    if (this.isMainUnfold) {
      classes.push('sidebar-main-unfold');
    } else {
      classes.filter((e) => e !== 'sidebar-main-unfold');
    }

    if (this.isMobileExpanded) {
      classes.push('sidebar-mobile-expanded');
    } else {
      classes.filter((e) => e !== 'sidebar-mobile-expanded');
    }

    return classes.join(' ');
  }

  onMouseEnter(): void {
    if (this.isMainResized) {
      this.isMainUnfold = true;
    } else {
      this.isMainUnfold = false;
    }
  }

  onMouseLeave(): void {
    this.isMainUnfold = false;
  }

  toggleMobileExpanded(): void {
    this.isMobileExpanded = !this.isMobileExpanded;
    this.globalService.changeToggleMobileExpanded(this.isMobileExpanded);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onSlide(event: any): void {
    const item = event.currentTarget.parentNode;
    const group = item.querySelector('.nav-group-sub');

    if (!group) {
      return;
    }

    const disable = item.querySelector('.nav-item>.nav-link:not(.disabled)');

    if (!disable) {
      return;
    }

    const newHandle = (e: any) => {
      e.preventDefault();

      const dataset = group.dataset['submenuTitle'];
      const objIndex = this.menu.findIndex((res: any) => res.name === dataset);

      if (item.classList.contains('nav-item-open')) {
        item.classList.remove('nav-item-open');
        this.menu[objIndex].slide = false;
      } else {
        item.classList.add('nav-item-open');
        this.menu[objIndex].slide = true;
      }
      this.menuEmitter$.next(this.menu);
    };

    item.addEventListener('click', newHandle, { once: true });
  }

  ngAfterViewInit(): void {}
}
