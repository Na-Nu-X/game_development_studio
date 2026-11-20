import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { TitleStrategy, Router, RouterLink } from '@angular/router';

import { GameDetail } from '../../core/models/api.models';
import { engineTag } from '../../core/models/labels';
import { InquiryPrefillService } from '../../core/services/inquiry-prefill.service';
import { PageTitleStrategy } from '../../core/services/page-title.strategy';
import { StudioApiService } from '../../core/services/studio-api.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { LightboxComponent, LightboxImage } from '../../shared/components/lightbox/lightbox.component';
import { StateComponent } from '../../shared/components/state/state.component';

@Component({
  selector: 'app-game-detail-page',
  imports: [RouterLink, IconComponent, LightboxComponent, StateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-detail.page.html',
  styleUrl: './game-detail.page.scss',
})
export class GameDetailPage {
  private readonly api = inject(StudioApiService);
  private readonly router = inject(Router);
  private readonly prefill = inject(InquiryPrefillService);
  private readonly titleStrategy = inject(TitleStrategy) as PageTitleStrategy;

  /** Route param bound via `withComponentInputBinding`. */
  readonly slug = input.required<string>();

  protected readonly game = httpResource<GameDetail>(() => this.api.url(`games/${encodeURIComponent(this.slug())}/`));

  protected readonly notFound = computed(() => {
    const error = this.game.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  });

  protected readonly activeShot = signal(0);
  protected readonly lightboxIndex = signal<number | null>(null);

  protected readonly gallery = computed<LightboxImage[]>(() =>
    (this.game.value()?.screenshots ?? []).map((shot) => ({ src: shot.image_url, caption: shot.caption })),
  );
  protected readonly isReleased = computed(() => this.game.value()?.status === 'vydane');
  protected readonly isUnreal = computed(() => this.game.value()?.engine_used.startsWith('Unreal') ?? false);
  protected readonly engineTag = engineTag;

  constructor() {
    effect(() => {
      const game = this.game.value();
      if (game) this.titleStrategy.setDynamicTitle(game.title, `${game.title} – ${game.tagline}`);
    });
    // Reset gallery when navigating between games.
    effect(() => {
      this.slug();
      this.activeShot.set(0);
    });
  }

  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
  }

  protected requestPressKit(game: GameDetail): void {
    this.prefill.set({
      inquiryType: 'press',
      message:
        `Dobrý deň,\n\nprosím o zaslanie press kitu k hre ${game.title} (logá, key art, screenshoty, fact sheet). ` +
        `Zaujíma nás aj možnosť recenzného kľúča / rozhovoru s tímom.\n\nĎakujem.`,
    });
    void this.router.navigate(['/studio-a-kontakt'], { fragment: 'kontakt-formular' });
  }
}
