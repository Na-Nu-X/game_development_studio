import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SITE_CONFIG } from '../../core/config/site.config';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { InquiryFormComponent } from '../../shared/components/inquiry-form/inquiry-form.component';

@Component({
  selector: 'app-studio-contact-page',
  imports: [IconComponent, InquiryFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './studio-contact.page.html',
  styleUrl: './studio-contact.page.scss',
})
export class StudioContactPage {
  protected readonly site = SITE_CONFIG;

  protected readonly pillars = [
    {
      title: 'Atmosféra pred efektom',
      text: 'Každá technológia, ktorú používame, slúži nálade a príbehu. Ray-tracing je nástroj, nie cieľ.',
    },
    {
      title: 'Hrateľné každé dva týždne',
      text: 'Interné aj partnerské projekty majú vždy funkčný build. Rozhodujeme sa podľa toho, čo sa dá zahrať.',
    },
    {
      title: 'Výkon je feature',
      text: 'Profilujeme od prvého dňa a na konzolách cielime stabilné snímkovanie, nie len „spustiteľnú“ verziu.',
    },
  ];

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2);
  }
}
