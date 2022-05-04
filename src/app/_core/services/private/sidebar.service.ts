import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import _ from 'lodash';
import { faHome, faCogs, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

@Injectable()
export class SidebarService {
  constructor() {}

  private sidebarSource = new BehaviorSubject([]);
  currentSidebar = this.sidebarSource.asObservable();

  changeSidebar(sidebar: any): void {
    this.sidebarSource.next(sidebar);
  }

  getSidebars(sidebarCode: string, url: string): any {
    const menu = [
      { code: 'dashboard', name: 'Dashboard', icon: faHome, link: '/dashboard' },
      {
        code: 'general',
        name: 'Pengaturan Umum',
        icon: faCogs,
        link: null,
        children: [
          { name: 'Aplikasi', link: '/general/application' },
          { name: 'Peran', link: '/general/role' },
          { name: 'Pengguna', link: '/general/user' },
        ],
      },
      {
        code: 'invitation',
        name: 'Undangan',
        icon: faEnvelopeOpenText,
        link: null,
        children: [
          { name: 'Acara', link: '/invitation/event' },
          { name: 'Paket Acara', link: '/invitation/event-package' },
          { name: 'Kategori Tema', link: '/invitation/theme-category' },
          { name: 'Tema', link: '/invitation/theme' },
          { name: 'Undangan', link: '/invitation/invitation' },
          { name: 'Testimoni', link: '/invitation/testimonial' },
        ],
      },
    ];

    const mapped = menu.map((element) => ({ slide: element.code === sidebarCode, ...element }));

    return mapped;
  }
}
