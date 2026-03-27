export const ICON_POOL = [
  { id: "heart", fr: "Coeur", en: "Heart" },
  { id: "star", fr: "Etoile", en: "Star" },
  { id: "sun", fr: "Soleil", en: "Sun" },
  { id: "moon", fr: "Lune", en: "Moon" },
  { id: "cloud", fr: "Nuage", en: "Cloud" },
  { id: "leaf", fr: "Feuille", en: "Leaf" },
  { id: "flower-2", fr: "Fleur", en: "Flower" },
  { id: "music", fr: "Musique", en: "Music" },
  { id: "bell", fr: "Cloche", en: "Bell" },
  { id: "home", fr: "Maison", en: "House" },
  { id: "key-round", fr: "Clef", en: "Key" },
  { id: "camera", fr: "Appareil photo", en: "Camera" },
  { id: "gift", fr: "Cadeau", en: "Gift" },
  { id: "umbrella", fr: "Parapluie", en: "Umbrella" },
  { id: "scissors", fr: "Ciseaux", en: "Scissors" },
  { id: "flame", fr: "Flamme", en: "Flame" },
  { id: "zap", fr: "Eclair", en: "Lightning" },
  { id: "anchor", fr: "Ancre", en: "Anchor" },
] as const;

export type IconEntry = (typeof ICON_POOL)[number];

export const CHALLENGE_TTL_MS = 120_000;
export const TOKEN_TTL_MS = 300_000;
export const MIN_FORM_TIME_MS = 2_000;
export const GRID_SIZE = 9;
export const MAX_ATTEMPTS = 3;
