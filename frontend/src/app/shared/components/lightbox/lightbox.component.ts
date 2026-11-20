import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';

import { IconComponent } from '../icon/icon.component';

export interface LightboxImage {
  readonly src: string;
  readonly caption: string;
}

/** Fullscreen screenshot viewer. Bind `[(index)]`; `null` means closed. */
@Component({
  selector: 'app-lightbox',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
  template: `
    @if (current(); as image) {
      <div
        class="lightbox"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="'Galéria – ' + image.caption"
        (click)="close()"
      >
        <div class="lightbox__bar" (click)="$event.stopPropagation()">
          <span class="mono">{{ (index() ?? 0) + 1 }} / {{ images().length }}</span>
          <button #closeButton type="button" class="lightbox__btn" (click)="close()" aria-label="Zavrieť galériu">
            <app-icon name="close" [size]="22" />
          </button>
        </div>

        <figure class="lightbox__figure" (click)="$event.stopPropagation()">
          <img [src]="image.src" [alt]="image.caption" />
          <figcaption>{{ image.caption }}</figcaption>
        </figure>

        @if (images().length > 1) {
          <button type="button" class="lightbox__nav lightbox__nav--prev" (click)="step(-1); $event.stopPropagation()" aria-label="Predchádzajúci obrázok">
            <app-icon name="chevron-left" [size]="28" />
          </button>
          <button type="button" class="lightbox__nav lightbox__nav--next" (click)="step(1); $event.stopPropagation()" aria-label="Nasledujúci obrázok">
            <app-icon name="chevron-right" [size]="28" />
          </button>
        }
      </div>
    }
  `,
  styleUrl: './lightbox.component.scss',
})
export class LightboxComponent {
  private readonly document = inject(DOCUMENT);

  readonly images = input.required<readonly LightboxImage[]>();
  readonly index = model<number | null>(null);

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : (this.images()[i] ?? null);
  });

  constructor() {
    effect(() => {
      const open = this.current() !== null;
      this.document.body.style.overflow = open ? 'hidden' : '';
      if (open) queueMicrotask(() => this.closeButton()?.nativeElement.focus());
    });
  }

  protected close(): void {
    this.index.set(null);
  }

  protected step(delta: number): void {
    const count = this.images().length;
    this.index.update((i) => (i === null ? null : (i + delta + count) % count));
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.index() === null) return;
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowRight') this.step(1);
    if (event.key === 'ArrowLeft') this.step(-1);
  }
}
