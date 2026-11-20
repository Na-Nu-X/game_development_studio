import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'hry',
    title: 'Naše hry',
    data: { description: 'Portfólio vydaných a pripravovaných hier štúdia – akčné RPG, sci-fi stratégie a príbehové adventúry pre PC a konzoly.' },
    loadComponent: () => import('./pages/games/games.page').then((m) => m.GamesPage),
  },
  {
    path: 'hry/:slug',
    title: 'Detail hry',
    loadComponent: () => import('./pages/game-detail/game-detail.page').then((m) => m.GameDetailPage),
  },
  {
    path: 'sluzby',
    title: 'Vývoj hier & Co-Development',
    data: { description: 'Full-cycle vývoj hier, co-development v Unreal Engine 5 a Unity, konzolové portovanie a 3D art pre vydavateľov a štúdiá.' },
    loadComponent: () => import('./pages/services/services.page').then((m) => m.ServicesPage),
  },
  {
    path: 'kariera',
    title: 'Kariéra',
    data: { description: 'Otvorené pozície v hernom vývoji v Bratislave a remote – programovanie, art, game dizajn a QA s transparentnou mzdou.' },
    loadComponent: () => import('./pages/careers/careers.page').then((m) => m.CareersPage),
  },
  {
    path: 'studio-a-kontakt',
    title: 'Štúdio & Kontakt',
    data: { description: 'Príbeh štúdia, vedenie, konzolové kompetencie a kontakt pre vydavateľov, B2B partnerov a médiá.' },
    loadComponent: () => import('./pages/studio-contact/studio-contact.page').then((m) => m.StudioContactPage),
  },
  {
    path: '**',
    title: 'Stránka nenájdená',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
