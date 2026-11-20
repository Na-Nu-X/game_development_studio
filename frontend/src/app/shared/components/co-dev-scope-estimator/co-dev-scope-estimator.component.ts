import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { InquiryPrefillService } from '../../../core/services/inquiry-prefill.service';
import { formatEur, plural } from '../../../core/utils/format';
import { IconComponent } from '../icon/icon.component';
import {
  BASE_MONTHLY_RATE_EUR,
  DURATIONS,
  DurationMonths,
  ENGINES,
  EngineId,
  PROJECT_TYPES,
  ProjectTypeId,
  TEAM_SIZE,
  composeTeam,
  roleLabel,
  roundTo,
} from './estimator.model';

@Component({
  selector: 'app-co-dev-scope-estimator',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './co-dev-scope-estimator.component.html',
  styleUrl: './co-dev-scope-estimator.component.scss',
})
export class CoDevScopeEstimatorComponent {
  private readonly router = inject(Router);
  private readonly prefill = inject(InquiryPrefillService);

  protected readonly projectTypes = PROJECT_TYPES;
  protected readonly engines = ENGINES;
  protected readonly durations = DURATIONS;
  protected readonly teamLimits = TEAM_SIZE;

  // --- Configuration state --------------------------------------------------
  protected readonly projectType = signal<ProjectTypeId>('codev');
  protected readonly engine = signal<EngineId>('ue5');
  protected readonly teamSize = signal<number>(TEAM_SIZE.default);
  protected readonly duration = signal<DurationMonths>(6);

  // --- Derived estimate ----------------------------------------------------
  private readonly selectedType = computed(() => PROJECT_TYPES.find((t) => t.id === this.projectType())!);
  private readonly selectedEngine = computed(() => ENGINES.find((e) => e.id === this.engine())!);
  private readonly discount = computed(() => DURATIONS.find((d) => d.months === this.duration())!.discount);

  protected readonly monthlyCost = computed(() =>
    roundTo(
      this.teamSize() *
        BASE_MONTHLY_RATE_EUR *
        this.selectedType().rateMultiplier *
        this.selectedEngine().rateMultiplier *
        (1 - this.discount()),
      100,
    ),
  );
  protected readonly totalCost = computed(() => this.monthlyCost() * this.duration());

  protected readonly team = computed(() =>
    composeTeam(this.selectedType().roles, this.teamSize()).map(({ role, count }) => ({
      count,
      label: roleLabel(role, this.engine()),
    })),
  );
  protected readonly teamSummary = computed(() => this.team().map((m) => `${m.count}× ${m.label}`).join(', '));

  protected readonly onboarding = computed(() => (this.teamSize() <= 6 ? 'do 2 týždňov' : 'do 3 týždňov'));
  protected readonly discountLabel = computed(() =>
    this.discount() > 0 ? `zľava ${Math.round(this.discount() * 100)} % za dlhodobú spoluprácu` : 'bez dlhodobej zľavy',
  );
  protected readonly sliderProgress = computed(
    () => ((this.teamSize() - TEAM_SIZE.min) / (TEAM_SIZE.max - TEAM_SIZE.min)) * 100,
  );

  protected readonly formatEur = formatEur;

  protected monthsLabel(months: number): string {
    return `${months} ${plural(months, ['mesiac', 'mesiace', 'mesiacov'])}`;
  }

  protected specialistsLabel(count: number): string {
    return `${count} ${plural(count, ['špecialista', 'špecialisti', 'špecialistov'])}`;
  }

  protected onTeamSizeInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.teamSize.set(Math.min(TEAM_SIZE.max, Math.max(TEAM_SIZE.min, value)));
  }

  protected requestConsultation(): void {
    const type = this.selectedType();
    const engine = this.selectedEngine();
    const scope =
      `${type.label} · ${engine.label} · ${this.specialistsLabel(this.teamSize())} · ${this.monthsLabel(this.duration())} · ` +
      `orientačne ${formatEur(this.monthlyCost())} / mesiac (${formatEur(this.totalCost())} spolu)`;

    this.prefill.set({
      inquiryType: 'co_development',
      budgetOrScope: scope,
      message:
        `Dobrý deň,\n\nmáme záujem o nezáväznú konzultáciu k spolupráci typu „${type.label}“ v technológii ${engine.label}. ` +
        `Predbežne uvažujeme o dedikovanom tíme (${this.teamSummary()}) na ${this.monthsLabel(this.duration())}.\n\n` +
        `Stručne o našom projekte:\n`,
    });
    void this.router.navigate(['/studio-a-kontakt'], { fragment: 'kontakt-formular' });
  }
}
