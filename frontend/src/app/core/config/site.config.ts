/**
 * White-label configuration.
 *
 * Every piece of studio branding and business information shown on the site
 * lives here. To rebrand the site for a new client, edit this file (and the
 * colour tokens in `src/styles/_theme.scss`) – no component changes needed.
 */

export interface SocialLink {
  readonly label: string;
  readonly url: string;
  readonly handle: string;
}

export interface TrustMetric {
  readonly value: string;
  readonly label: string;
  readonly detail: string;
}

export interface PlatformBadge {
  readonly platform: string;
  readonly program: string;
}

export interface LeadershipMember {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
}

export interface PressQuote {
  readonly quote: string;
  readonly source: string;
}

export interface SiteConfig {
  readonly studioName: string;
  readonly legalName: string;
  readonly wordmark: { readonly primary: string; readonly secondary: string };
  readonly tagline: string;
  readonly description: string;
  readonly foundedYear: number;
  readonly contact: {
    readonly businessEmail: string;
    readonly pressEmail: string;
    readonly careersEmail: string;
    readonly phone: string;
    readonly phoneHref: string;
  };
  readonly address: {
    readonly street: string;
    readonly city: string;
    readonly postalCode: string;
    readonly country: string;
    readonly mapUrl: string;
  };
  readonly billing: {
    readonly ico: string;
    readonly dic: string;
    readonly icDph: string;
    readonly registry: string;
  };
  readonly platformBadges: readonly PlatformBadge[];
  readonly engines: readonly string[];
  readonly socials: readonly SocialLink[];
  readonly trustMetrics: readonly TrustMetric[];
  readonly leadership: readonly LeadershipMember[];
  readonly events: readonly string[];
  readonly pressQuotes: readonly PressQuote[];
  readonly careerPerks: readonly { readonly title: string; readonly text: string }[];
}

export const SITE_CONFIG: SiteConfig = {
  studioName: 'Nocturne Forge',
  legalName: 'Nocturne Forge s.r.o.',
  wordmark: { primary: 'NOCTURNE', secondary: 'FORGE' },
  tagline: 'Kováčska dielňa temných svetov.',
  description:
    'Nezávislé herné štúdio z Bratislavy. Tvoríme vlastné atmosférické hry v Unreal Engine 5 a Unity a ako ' +
    'technologický partner pomáhame vydavateľom a štúdiám s co-developmentom a konzolovým portovaním.',
  foundedYear: 2016,
  contact: {
    businessEmail: 'biz@nocturneforge.sk',
    pressEmail: 'press@nocturneforge.sk',
    careersEmail: 'kariera@nocturneforge.sk',
    phone: '+421 2 3300 4817',
    phoneHref: '+421233004817',
  },
  address: {
    street: 'Mlynské nivy 48',
    city: 'Bratislava',
    postalCode: '821 09',
    country: 'Slovensko',
    mapUrl: 'https://www.openstreetmap.org/search?query=Mlynsk%C3%A9%20nivy%2048%20Bratislava',
  },
  billing: {
    ico: '53 918 274',
    dic: '2121518842',
    icDph: 'SK2121518842',
    registry: 'Obchodný register Mestského súdu Bratislava III, oddiel Sro, vložka č. 156482/B',
  },
  platformBadges: [
    { platform: 'PC', program: 'Steamworks Partner' },
    { platform: 'PlayStation', program: 'PlayStation Partners' },
    { platform: 'Xbox', program: 'ID@Xbox' },
    { platform: 'Nintendo', program: 'Nintendo Developer Portal' },
  ],
  engines: ['Unreal Engine 5', 'Unity', 'Vlastný C++ Engine'],
  socials: [
    { label: 'Steam', url: 'https://store.steampowered.com/', handle: 'Nocturne Forge' },
    { label: 'Discord', url: 'https://discord.com/', handle: 'discord.gg/nocturne' },
    { label: 'YouTube', url: 'https://www.youtube.com/', handle: '@nocturneforge' },
    { label: 'X', url: 'https://x.com/', handle: '@nocturneforge' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/', handle: 'Nocturne Forge' },
  ],
  trustMetrics: [
    { value: '4', label: 'vydané a pripravované tituly', detail: 'PC, PS5, Xbox a Switch' },
    { value: '1,2 mil.', label: 'predaných kópií a wishlistov', detail: 'naprieč všetkými platformami' },
    { value: '14', label: 'medzinárodných ocenení', detail: 'a nominácií od roku 2019' },
    { value: '38', label: 'vývojárov v tíme', detail: '70 % seniorných špecialistov' },
  ],
  leadership: [
    {
      name: 'Martin Kováč',
      role: 'Creative Director & spoluzakladateľ',
      bio: 'Pätnásť rokov tvorí svety, ktoré sa hráčom vracajú v snoch. Autor herného dizajnu Tichej Moreny.',
    },
    {
      name: 'Lucia Hrušková',
      role: 'Technical Director',
      bio: 'Bývalá engine programátorka AAA štúdia, zodpovedá za náš C++ engine a všetky konzolové porty.',
    },
    {
      name: 'Tomáš Baláž',
      role: 'Head of Production & Co-Dev',
      bio: 'Riadi co-development partnerstvá a dbá na to, aby každý milestone prišiel načas a hrateľný.',
    },
  ],
  events: ['Gamescom', 'Game Access', 'Slovak Games Conference', 'Digital Dragons', 'Steam Next Fest', 'GDC'],
  pressQuotes: [
    {
      quote: 'Ashen Meridian dokazuje, že stredoeurópske štúdiá dnes vizuálne nezaostávajú za nikým.',
      source: 'Pixel Courier – recenzia',
    },
    {
      quote: 'Tichá Morena je jedna z najkrajších a najsmutnejších hier roka. Zimu z nej budete cítiť ešte dlho.',
      source: 'Hráčsky denník – recenzia',
    },
  ],
  careerPerks: [
    { title: 'Podiel na tržbách z vydaných hier', text: 'Každý člen tímu dostáva podiel z čistých tržieb našich vlastných titulov.' },
    { title: 'Hardvér bez kompromisov', text: 'RTX pracovná stanica, dva monitory a prístup ku všetkým konzolovým dev kitom.' },
    { title: 'Relokačný bonus', text: 'Až 3 000 € a pomoc s bývaním pri presťahovaní do Bratislavy.' },
    { title: 'Tvorivý čas', text: '5 dní ročne navyše na vlastné prototypy, game jamy a experimenty.' },
    { title: 'Vzdelávanie & konferencie', text: '1 200 € ročne na kurzy, knihy a cesty na GDC, Gamescom či Digital Dragons.' },
    { title: 'Hybridná práca', text: 'Ateliér v centre Bratislavy, flexibilný čas a home office podľa dohody.' },
  ],
};
