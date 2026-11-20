import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <div class="container">
        <p class="mono nf__code">404</p>
        <h1>Tento level ešte nie je postavený.</h1>
        <p class="lead">Stránka, ktorú hľadáte, neexistuje alebo bola presunutá.</p>
        <div class="nf__actions">
          <a routerLink="/" class="btn btn--primary">Späť na úvod</a>
          <a routerLink="/hry" class="btn btn--ghost">Naše hry</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .nf {
      min-height: 80svh;
      display: grid;
      align-items: center;
      padding-top: calc(var(--nav-height) + 4rem);
      padding-bottom: 4rem;
    }
    .nf__code {
      font-size: clamp(5rem, 18vw, 12rem);
      line-height: 1;
      color: var(--color-accent);
      letter-spacing: -0.06em;
    }
    .lead {
      margin-top: 1.5rem;
    }
    .nf__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 2rem;
    }
  `,
})
export class NotFoundPage {}
