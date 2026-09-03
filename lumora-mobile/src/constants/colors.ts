// Mirrors ../../../lumora-design-system/tokens.json — kept in sync by hand,
// see that package's README for why there's no codegen doing this
// automatically. These are Tailwind CSS v4's own default zinc/red/amber
// shades (what lumora-academy already gets for free via Tailwind), not a
// separate palette invented for mobile.
export const Zinc = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
} as const;

export const Red = {
  600: '#dc2626',
} as const;

export const Amber = {
  100: '#fef3c7',
  200: '#fde68a',
  800: '#92400e',
  900: '#78350f',
} as const;

export const White = '#ffffff';
export const Black = '#000000';
