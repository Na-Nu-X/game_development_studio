import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { SITE_CONFIG } from '../../../core/config/site.config';
import { JobsStore } from '../../../core/services/jobs.store';
import { IconComponent } from '../icon/icon.component';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly showHiringBadge?: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class NavbarComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly jobs = inject(JobsStore);
  protected readonly site = SITE_CONFIG;

  protected readonly links: readonly NavLink[] = [
    { label: 'Naše hry', path: '/hry' },
    { label: 'Vývoj & Co-Dev', path: '/sluzby' },
    { label: 'Kariéra', path: '/kariera', showHiringBadge: true },
    { label: 'Štúdio & Kontakt', path: '/studio-a-kontakt' },
  ];

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));

    effect(() => {
      this.document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
    this.onScroll();
  }

  protected onScroll(): void {
    const y = this.document.defaultView?.scrollY ?? 0;
    this.scrolled.set(y > 24);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
