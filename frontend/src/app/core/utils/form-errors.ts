import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormGroup } from '@angular/forms';

import { ApiValidationErrors } from '../models/api.models';

/** Maps Angular validator errors to Slovak user-facing messages. */
export function controlError(control: AbstractControl | null): string | null {
  if (!control || !control.errors || !(control.touched || control.dirty)) return null;
  const errors = control.errors;
  if (errors['server']) return errors['server'] as string;
  if (errors['required']) return 'Toto pole je povinné.';
  if (errors['requiredTrue']) return 'Na odoslanie je potrebný váš súhlas.';
  if (errors['email']) return 'Zadajte platnú e-mailovú adresu.';
  if (errors['minlength']) {
    return `Zadajte aspoň ${(errors['minlength'] as { requiredLength: number }).requiredLength} znakov.`;
  }
  if (errors['maxlength']) {
    return `Maximálny počet znakov je ${(errors['maxlength'] as { requiredLength: number }).requiredLength}.`;
  }
  if (errors['pattern']) return 'Hodnota nemá správny formát.';
  return 'Skontrolujte prosím zadanú hodnotu.';
}

/**
 * Applies DRF field errors to the matching form controls.
 * Returns a general message for non-field / network errors.
 */
export function applyServerErrors(form: FormGroup, error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Nepodarilo sa spojiť so serverom. Skontrolujte pripojenie a skúste to znova.';
    }
    if (error.status === 429) {
      return 'Odoslali ste príliš veľa požiadaviek. Skúste to prosím o chvíľu.';
    }
    if (error.status === 400 && error.error && typeof error.error === 'object') {
      const body = error.error as ApiValidationErrors;
      let general = '';
      for (const [field, messages] of Object.entries(body)) {
        const message = Array.isArray(messages) ? messages.join(' ') : String(messages);
        const control = form.get(toCamel(field));
        if (control) {
          control.setErrors({ server: message });
          control.markAsTouched();
        } else {
          general += `${message} `;
        }
      }
      return general.trim() || 'Formulár obsahuje chyby. Skontrolujte prosím označené polia.';
    }
  }
  return 'Pri odosielaní nastala neočakávaná chyba. Skúste to prosím neskôr.';
}

function toCamel(field: string): string {
  return field.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

/** Lenient http(s) URL pattern for portfolio links. */
export const HTTP_URL_PATTERN = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
