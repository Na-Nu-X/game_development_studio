import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { SITE_CONFIG } from '../config/site.config';

/** Appends the studio name to every route title and updates the meta description. */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} | ${SITE_CONFIG.studioName}` : `${SITE_CONFIG.studioName} – ${SITE_CONFIG.tagline}`);

    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const description = (route.data['description'] as string | undefined) ?? SITE_CONFIG.description;
    this.meta.updateTag({ name: 'description', content: description });
  }

  /** Allows pages with dynamic content (game detail) to set their own title. */
  setDynamicTitle(pageTitle: string, description?: string): void {
    this.title.setTitle(`${pageTitle} | ${SITE_CONFIG.studioName}`);
    if (description) this.meta.updateTag({ name: 'description', content: description });
  }
}
