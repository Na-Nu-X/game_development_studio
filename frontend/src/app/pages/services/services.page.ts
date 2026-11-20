import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_CONFIG } from '../../core/config/site.config';
import { StudioService } from '../../core/models/api.models';
import { StudioApiService } from '../../core/services/studio-api.service';
import { CoDevScopeEstimatorComponent } from '../../shared/components/co-dev-scope-estimator/co-dev-scope-estimator.component';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';
import { StateComponent } from '../../shared/components/state/state.component';

@Component({
  selector: 'app-services-page',
  imports: [RouterLink, CoDevScopeEstimatorComponent, IconComponent, StateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.page.html',
  styleUrl: './services.page.scss',
})
export class ServicesPage {
  private readonly api = inject(StudioApiService);
  protected readonly site = SITE_CONFIG;

  protected readonly services = httpResource<StudioService[]>(() => this.api.url('services/'), {
    defaultValue: [],
  });

  protected readonly icons: readonly IconName[] = ['gamepad', 'cpu', 'layers', 'cube'];

  protected readonly process = [
    { title: 'Úvodný hovor & NDA', text: 'Do 48 hodín sa spojíme, podpíšeme NDA a zmapujeme vaše ciele, termíny a technológie.', time: '1 – 2 dni' },
    { title: 'Technický audit', text: 'Prejdeme kód, build pipeline a výkon na cieľových platformách. Dostanete písomný odhad.', time: '1 týždeň' },
    { title: 'Pilotný sprint', text: 'Dedikovaný tím sa zapojí do vášho repozitára a dodá prvý merateľný výsledok.', time: '2 týždne' },
    { title: 'Produkcia & delivery', text: 'Pravidelné buildy, transparentné reporty, certifikácia a podpora po vydaní.', time: 'podľa dohody' },
  ];

  protected readonly capabilities = [
    { platform: 'PlayStation 5', points: ['TRC compliance & submission', 'Trofeje, Activities, DualSense haptika', 'Výkonnostné profilovanie na dev kitoch'] },
    { platform: 'Xbox Series X|S', points: ['XR certifikácia', 'Smart Delivery & Quick Resume', 'Optimalizácia pre Series S (pamäť)'] },
    { platform: 'Nintendo Switch', points: ['Lotcheck príprava', 'Agresívna optimalizácia CPU/GPU a pamäte', 'Handheld & docked profily'] },
    { platform: 'PC (Steam)', points: ['Steamworks integrácia', 'Steam Deck verifikácia', 'DLSS / FSR / XeSS upscaling'] },
  ];
}
