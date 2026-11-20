import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_CONFIG } from '../../../core/config/site.config';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly year = new Date().getFullYear();
  protected readonly footerSocials = SITE_CONFIG.socials.filter((s) =>
    ['Steam', 'Discord', 'YouTube', 'LinkedIn', 'X'].includes(s.label),
  );

  protected readonly quickLinks = [
    { label: 'Naše hry', path: '/hry' },
    { label: 'Vývoj & Co-Development', path: '/sluzby' },
    { label: 'Kariéra', path: '/kariera' },
    { label: 'Štúdio & Kontakt', path: '/studio-a-kontakt' },
  ];
}
