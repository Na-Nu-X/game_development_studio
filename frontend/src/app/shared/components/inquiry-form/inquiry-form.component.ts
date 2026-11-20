import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SITE_CONFIG } from '../../../core/config/site.config';
import { InquiryType } from '../../../core/models/api.models';
import { INQUIRY_TYPE_LABELS } from '../../../core/models/labels';
import { InquiryPrefillService } from '../../../core/services/inquiry-prefill.service';
import { StudioApiService } from '../../../core/services/studio-api.service';
import { applyServerErrors, controlError } from '../../../core/utils/form-errors';
import { IconComponent } from '../icon/icon.component';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-inquiry-form',
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inquiry-form.component.html',
  styleUrl: './inquiry-form.component.scss',
})
export class InquiryFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(StudioApiService);
  private readonly prefill = inject(InquiryPrefillService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly site = SITE_CONFIG;
  protected readonly types = Object.entries(INQUIRY_TYPE_LABELS) as [InquiryType, string][];

  protected readonly form = this.fb.group({
    inquiryType: this.fb.control<InquiryType>('co_development', Validators.required),
    companyName: ['', [Validators.maxLength(160)]],
    contactName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]],
    email: ['', [Validators.required, Validators.email]],
    budgetOrScope: ['', [Validators.maxLength(255)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(5000)]],
    gdprConsent: [false, Validators.requiredTrue],
  });

  protected readonly state = signal<SubmitState>('idle');
  protected readonly generalError = signal<string | null>(null);
  protected readonly prefilled = signal(false);

  private readonly inquiryType = toSignal(this.form.controls.inquiryType.valueChanges, {
    initialValue: this.form.controls.inquiryType.value,
  });
  protected readonly isPress = computed(() => this.inquiryType() === 'press');
  protected readonly companyRequired = computed(() =>
    ['co_development', 'publishing'].includes(this.inquiryType()),
  );

  ngOnInit(): void {
    const prefill = this.prefill.consume();
    if (prefill) {
      this.form.patchValue({
        inquiryType: prefill.inquiryType,
        budgetOrScope: prefill.budgetOrScope ?? '',
        message: prefill.message ?? '',
        companyName: prefill.companyName ?? '',
      });
      this.prefilled.set(true);
    }
  }

  protected error(name: string): string | null {
    const control = this.form.get(name);
    if (
      name === 'companyName' &&
      control &&
      this.companyRequired() &&
      control.touched &&
      !String(control.value).trim() &&
      !control.errors
    ) {
      return 'Pri B2B a vydavateľskom dopyte uveďte názov spoločnosti.';
    }
    return controlError(control);
  }

  protected submit(): void {
    this.generalError.set(null);
    this.form.markAllAsTouched();
    const value = this.form.getRawValue();
    if (this.form.invalid || (this.companyRequired() && !value.companyName.trim())) return;

    this.state.set('submitting');
    this.api
      .submitInquiry({
        inquiry_type: value.inquiryType,
        company_name: value.companyName.trim(),
        contact_name: value.contactName.trim(),
        email: value.email.trim(),
        budget_or_scope: value.budgetOrScope.trim(),
        message: value.message.trim(),
        gdpr_consent: value.gdprConsent,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.set('success');
          this.form.reset();
          this.prefilled.set(false);
        },
        error: (err: unknown) => {
          this.state.set('error');
          this.generalError.set(applyServerErrors(this.form, err));
        },
      });
  }

  protected startOver(): void {
    this.state.set('idle');
  }
}
