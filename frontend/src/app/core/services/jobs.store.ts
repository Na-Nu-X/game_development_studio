import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';

import { JobOpening } from '../models/api.models';
import { StudioApiService } from './studio-api.service';

/**
 * App-wide store of active job openings. Shared by the navbar hiring badge,
 * the home careers banner and the careers page so the list is fetched once.
 */
@Injectable({ providedIn: 'root' })
export class JobsStore {
  private readonly api = inject(StudioApiService);

  private readonly resource = httpResource<JobOpening[]>(() => this.api.url('jobs/'), {
    defaultValue: [],
  });

  readonly jobs = computed(() => this.resource.value());
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;
  readonly count = computed(() => this.jobs().length);

  reload(): void {
    this.resource.reload();
  }
}
