import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Shared error / empty state block. */
@Component({
  selector: 'app-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="state-message" [attr.role]="kind() === 'error' ? 'alert' : null">
      <strong>{{ title() }}</strong>
      <p>{{ message() }}</p>
      @if (kind() === 'error') {
        <button type="button" class="btn btn--ghost btn--sm retry" (click)="retry.emit()">Skúsiť znova</button>
      }
    </div>
  `,
  styles: `
    .retry {
      margin-top: 1rem;
    }
  `,
})
export class StateComponent {
  readonly kind = input<'error' | 'empty'>('error');
  readonly title = input('Obsah sa nepodarilo načítať');
  readonly message = input('Server je momentálne nedostupný. Skontrolujte, či beží backend, a skúste to znova.');
  readonly retry = output<void>();
}
