import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE_CONFIG } from '../../core/config/site.config';
import { GameSummary, StudioService } from '../../core/models/api.models';
import { engineTag } from '../../core/models/labels';
import { JobsStore } from '../../core/services/jobs.store';
import { StudioApiService } from '../../core/services/studio-api.service';
import { formatEur, plural } from '../../core/utils/format';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';
import { StateComponent } from '../../shared/components/state/state.component';

const SERVICE_ICONS: readonly IconName[] = ['gamepad', 'cpu', 'layers', 'cube'];

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, GameCardComponent, IconComponent, StateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly api = inject(StudioApiService);
  protected readonly jobs = inject(JobsStore);
  protected readonly site = SITE_CONFIG;

  protected readonly games = httpResource<GameSummary[]>(
    () => ({ url: this.api.url('games/'), params: { featured: 'true' } }),
    { defaultValue: [] },
  );
  protected readonly services = httpResource<StudioService[]>(() => this.api.url('services/'), {
    defaultValue: [],
  });

  protected readonly flagship = computed(() => this.games.value()[0] ?? null);
  protected readonly topJobs = computed(() => this.jobs.jobs().slice(0, 3));
  protected readonly serviceIcons = SERVICE_ICONS;

  protected readonly engineTag = engineTag;
  protected readonly formatEur = formatEur;

  protected positionsLabel(count: number): string {
    return `${count} ${plural(count, ['otvorená pozícia', 'otvorené pozície', 'otvorených pozícií'])}`;
  }
}
