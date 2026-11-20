import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SITE_CONFIG } from '../../../core/config/site.config';
import { JobOpening } from '../../../core/models/api.models';
import { StudioApiService } from '../../../core/services/studio-api.service';
import { formatEur } from '../../../core/utils/format';
import { HTTP_URL_PATTERN, applyServerErrors, controlError } from '../../../core/utils/form-errors';
import { IconComponent } from '../../../shared/components/icon/icon.component';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-job-application-modal',
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './job-application-modal.component.html',
  styleUrl: './job-application-modal.component.scss',
  host: { '(document:keydown.escape)': 'close()' },
})
export class JobApplicationModalComponent implements OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(StudioApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly previouslyFocused = this.document.activeElement as HTMLElement | null;

  readonly job = input.required<JobOpening>();
  readonly closed = output<void>();

  private readonly firstField = viewChild<ElementRef<HTMLInputElement>>('firstField');

  protected readonly site = SITE_CONFIG;
  protected readonly formatEur = formatEur;
  protected readonly state = signal<SubmitState>('idle');
  protected readonly generalError = signal<string | null>(null);

  protected readonly form = this.fb.group({
    applicantName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\+?[0-9 ]{9,20}$/)]],
    portfolioUrl: ['', [Validators.required, Validators.pattern(HTTP_URL_PATTERN)]],
    coverNote: ['', [Validators.maxLength(4000)]],
    gdprConsent: [false, Validators.requiredTrue],
  });

  constructor() {
    this.document.body.style.overflow = 'hidden';
    afterNextRender(() => this.firstField()?.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
    this.previouslyFocused?.focus?.();
  }

  protected error(name: string): string | null {
    const control = this.form.get(name);
    if (name === 'portfolioUrl' && control?.hasError('pattern') && control.touched) {
      return 'Zadajte celý odkaz vrátane https:// (ArtStation, GitHub, LinkedIn, itch.io…).';
    }
    if (name === 'phone' && control?.hasError('pattern') && control.touched) {
      return 'Zadajte telefónne číslo v tvare +421 900 123 456.';
    }
    return controlError(control);
  }

  protected close(): void {
    if (this.state() !== 'submitting') this.closed.emit();
  }

  protected submit(): void {
    this.generalError.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.state.set('submitting');
    this.api
      .submitApplication({
        job: this.job().id,
        applicant_name: value.applicantName.trim(),
        email: value.email.trim(),
        phone: value.phone.trim(),
        portfolio_url: value.portfolioUrl.trim(),
        cover_note: value.coverNote.trim(),
        gdpr_consent: value.gdprConsent,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.state.set('success'),
        error: (err: unknown) => {
          this.state.set('error');
          this.generalError.set(applyServerErrors(this.form, err));
        },
      });
  }
}
