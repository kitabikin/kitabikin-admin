import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import _ from 'lodash';
import { faHome, faCogs } from '@fortawesome/free-solid-svg-icons';

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
    ];

    const mapped = menu.map((element) => ({ slide: element.code === sidebarCode, ...element }));

    return mapped;
  }
}
