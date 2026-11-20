import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { SITE_CONFIG } from '../../core/config/site.config';
import { JobDepartment, JobOpening } from '../../core/models/api.models';
import { DEPARTMENT_LABELS } from '../../core/models/labels';
import { JobsStore } from '../../core/services/jobs.store';
import { formatEur, plural } from '../../core/utils/format';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { StateComponent } from '../../shared/components/state/state.component';
import { JobApplicationModalComponent } from './job-application-modal/job-application-modal.component';

@Component({
  selector: 'app-careers-page',
  imports: [IconComponent, StateComponent, JobApplicationModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './careers.page.html',
  styleUrl: './careers.page.scss',
})
export class CareersPage {
  protected readonly store = inject(JobsStore);
  protected readonly site = SITE_CONFIG;

  /** `?pozicia=<id>` pre-expands a job (used by links from the home page). */
  readonly pozicia = input<string | undefined>();

  protected readonly departments = Object.entries(DEPARTMENT_LABELS) as [JobDepartment, string][];
  protected readonly department = signal<JobDepartment | null>(null);
  protected readonly expandedId = signal<number | null>(null);
  protected readonly applyingTo = signal<JobOpening | null>(null);

  protected readonly filteredJobs = computed(() => {
    const department = this.department();
    const jobs = this.store.jobs();
    return department ? jobs.filter((job) => job.department === department) : jobs;
  });

  protected readonly countsByDepartment = computed(() => {
    const counts: Partial<Record<JobDepartment, number>> = {};
    for (const job of this.store.jobs()) counts[job.department] = (counts[job.department] ?? 0) + 1;
    return counts;
  });

  protected readonly formatEur = formatEur;

  constructor() {
    effect(() => {
      const id = Number(this.pozicia());
      if (id && this.store.jobs().some((job) => job.id === id)) {
        this.expandedId.set(id);
        queueMicrotask(() =>
          document.getElementById(`job-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
      }
    });
  }

  protected positionsLabel(count: number): string {
    return `${count} ${plural(count, ['otvorená pozícia', 'otvorené pozície', 'otvorených pozícií'])}`;
  }

  protected toggle(id: number): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }
}
