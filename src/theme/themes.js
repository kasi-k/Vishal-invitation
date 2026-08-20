// One palette: rose gold on blush ivory.
//
// The invitation used to offer four schemes behind a picker; it now commits to a
// single rose-gold template, so the picker is gone and these values are simply
// written onto the document once at mount.
export const THEME = {
  // grounds
  page:    '#fbf1ee',   // blush ivory
  wash:    '#f3e3de',
  surface: '#fffbf9',

  // ink
  deep:    '#5e2a33',   // deep rose, for headings
  text:    '#48222a',
  dim:     '#9a767b',
  line:    '#e6cac2',

  // the metal
  gold:    '#c1897d',   // rose gold, mid tone
  goldLt:  '#f2d3c8',
  goldDk:  '#8f5a57',
  accent:  '#b76e79',   // the classic rose-gold hue, used for emphasis

  // small painted details that keep their own colour
  leaf: '#7d8a6a', leafDk: '#5d6a4e',
  marigold: '#e0a48c', marigoldDk: '#c07d6c',
  clay: '#a9705c', clayLt: '#c48d78', clayDk: '#7d4f40',

  petal: ['#e6b6a6', '#b76e79', '#f2d3c8', '#8f5a57', '#d99e92'],
};
