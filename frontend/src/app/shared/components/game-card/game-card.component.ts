import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GameStatus, GameSummary } from '../../../core/models/api.models';
import { engineTag, platformShort } from '../../../core/models/labels';
import { IconComponent } from '../icon/icon.component';

const STATUS_VARIANT: Record<GameStatus, string> = {
  vydane: 'badge--success',
  early_access: 'badge--accent',
  vo_vyvoji: 'badge--muted',
  oznamene: 'badge--muted',
};

@Component({
  selector: 'app-game-card',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  readonly game = input.required<GameSummary>();
  /** Larger, wide layout used for the first card on the home page. */
  readonly size = input<'default' | 'wide'>('default');
  readonly index = input<number | null>(null);

  protected readonly statusClass = computed(() => STATUS_VARIANT[this.game().status]);
  protected readonly engine = computed(() => engineTag(this.game().engine_used));
  protected readonly isUnreal = computed(() => this.game().engine_used.startsWith('Unreal'));
  protected readonly platforms = computed(() => this.game().platforms.map(platformShort));
  protected readonly topAward = computed(() => this.game().awards[0] ?? null);
  protected readonly indexLabel = computed(() => {
    const index = this.index();
    return index === null ? null : String(index + 1).padStart(2, '0');
  });
  protected readonly image = computed(() =>
    this.size() === 'wide' ? this.game().hero_banner_url : this.game().cover_image_url,
  );
}
