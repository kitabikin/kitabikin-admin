import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import _ from 'lodash';

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
      { code: 'dashboard', name: 'Dashboard', icon: 'home', link: '/dashboard' },
      {
        code: 'general',
        name: 'Pengaturan Umum',
        icon: 'cog',
        link: null,
        children: [
          { name: 'User & Permission', link: '/user' },
          { name: 'Topik', link: '/topic' },
          { name: 'Organisasi', link: '/organization' },
          { name: 'Satuan', link: '/unit' },
          { name: 'Syarat & Ketentuan', link: '/agreement' },
        ],
      },
      {
        code: 'satu-data',
        name: 'Satu Data Jabar',
        icon: 'folder-minus',
        link: null,
        children: [
          { name: 'Dataset', icon: 'user', link: '/satudata/dataset' },
          { name: 'Indikator', icon: 'user', link: '/satudata/indicator' },
          { name: 'Visualisasi', icon: 'user', link: '/satudata/visualization' },
          { name: 'Request Dataset', icon: 'user', link: '/satudata/request-dataset' },
        ],
      },
      {
        code: 'open-data',
        name: 'Open Data Jabar',
        icon: 'file-alt',
        link: null,
        children: [
          { name: 'Artikel', icon: 'user', link: '/opendata/article' },
          { name: 'Highlight Data', icon: 'user', link: '/opendata/highlight' },
          { name: 'Infografik', icon: 'user', link: '/opendata/infographic' },
          { name: 'Request Dataset', icon: 'user', link: '/opendata/request-dataset-public' },
        ],
      },
      {
        code: 'satu-peta',
        name: 'Satu Peta Jabar',
        icon: 'compass',
        link: null,
        children: [{ name: 'Dataset Geospasial', icon: 'user', link: '/satupeta/mapset' }],
      },
    ];

    const mapped = menu.map((element) => ({ slide: element.code === sidebarCode, ...element }));

    return mapped;
  }
}
