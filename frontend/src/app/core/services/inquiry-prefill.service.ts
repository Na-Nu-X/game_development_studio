import { Injectable, signal } from '@angular/core';

import { InquiryType } from '../models/api.models';

export interface InquiryPrefill {
  inquiryType: InquiryType;
  budgetOrScope?: string;
  message?: string;
  companyName?: string;
}

/**
 * Hand-off channel between CTAs (scope estimator, press kit trigger, …) and
 * the inquiry form on the contact page.
 */
@Injectable({ providedIn: 'root' })
export class InquiryPrefillService {
  private readonly pending = signal<InquiryPrefill | null>(null);

  set(prefill: InquiryPrefill): void {
    this.pending.set(prefill);
  }

  /** Returns the pending prefill (if any) and clears it. */
  consume(): InquiryPrefill | null {
    const value = this.pending();
    this.pending.set(null);
    return value;
  }
}
