import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { GameStatus, GameSummary } from '../../core/models/api.models';
import { PLATFORM_FILTERS, PlatformCode } from '../../core/models/labels';
import { StudioApiService } from '../../core/services/studio-api.service';
import { plural } from '../../core/utils/format';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { StateComponent } from '../../shared/components/state/state.component';

const STATUS_FILTERS: readonly { value: GameStatus | null; label: string }[] = [
  { value: null, label: 'Všetky' },
  { value: 'vydane', label: 'Vydané' },
  { value: 'early_access', label: 'Predbežný prístup' },
  { value: 'vo_vyvoji', label: 'Vo vývoji' },
];

@Component({
  selector: 'app-games-page',
  imports: [GameCardComponent, StateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './games.page.html',
  styleUrl: './games.page.scss',
})
export class GamesPage {
  private readonly api = inject(StudioApiService);
  private readonly router = inject(Router);

  /** Bound from the `?stav=` and `?platforma=` query params (shareable filter URLs). */
  readonly stav = input<string | undefined>();
  readonly platforma = input<string | undefined>();

  protected readonly statusFilters = STATUS_FILTERS;
  protected readonly platformFilters = PLATFORM_FILTERS;

  protected readonly status = computed<GameStatus | null>(() => {
    const value = this.stav();
    return STATUS_FILTERS.some((f) => f.value === value) ? (value as GameStatus) : null;
  });
  protected readonly platform = computed<PlatformCode | null>(() => {
    const value = this.platforma();
    return PLATFORM_FILTERS.some((f) => f.code === value) ? (value as PlatformCode) : null;
  });

  protected readonly games = httpResource<GameSummary[]>(
    () => ({
      url: this.api.url('games/'),
      params: StudioApiService.params({ status: this.status(), platform: this.platform() }),
    }),
    { defaultValue: [] },
  );

  protected readonly resultLabel = computed(() => {
    const count = this.games.value().length;
    return `${count} ${plural(count, ['titul', 'tituly', 'titulov'])}`;
  });

  protected setStatus(value: GameStatus | null): void {
    this.updateQuery({ stav: value });
  }

  protected setPlatform(value: PlatformCode | null): void {
    this.updateQuery({ platforma: value === this.platform() ? null : value });
  }

  protected resetFilters(): void {
    this.updateQuery({ stav: null, platforma: null });
  }

  private updateQuery(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true });
  }
}
