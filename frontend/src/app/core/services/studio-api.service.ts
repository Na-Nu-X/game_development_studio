import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  BusinessInquiryPayload,
  JobApplicationPayload,
} from '../models/api.models';

/** Thin typed wrapper for write operations against the Django REST API. */
@Injectable({ providedIn: 'root' })
export class StudioApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }

  submitApplication(payload: JobApplicationPayload): Observable<unknown> {
    return this.http.post(this.url('applications/'), payload);
  }

  submitInquiry(payload: BusinessInquiryPayload): Observable<unknown> {
    return this.http.post(this.url('inquiries/'), payload);
  }

  static params(values: Record<string, string | boolean | null | undefined>): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(values)) {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return params;
  }
}
