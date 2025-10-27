// import emojiRegex from 'emoji-regex';

// export function isSingleGraphemeIntl(input: string, locale = 'ja') {
//   const s = input.trim();
//   if (!s) return false;

//   if (typeof Intl === 'undefined' || !('Segmenter' in Intl)) return false;

//   const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
//   const itr = segmenter.segment(s)[Symbol.iterator]();
//   const first = itr.next();
//   if (first.done) return false;

//   const second = itr.next();
//   return !!first.value && second.done;
// }

// export function isSingleEmojiIntl(input: string) {
//   const s = input.trim();
//   if (!s) return false;

//   if (!isSingleGraphemeIntl(s)) return false;

//   const regex = emojiRegex();
//   const matches = [...s.matchAll(regex)];
//   if (matches.length !== 1) return false;
//   const only = matches[0][0];
//   return only === s;
// }

// export function firstGraphemeIntl(
//   input: string,
//   locale = 'ja',
//   seg?: Intl.Segmenter,
// ) {
//   const s = input.trim();
//   if (!s) return '';

//   const segmenter =
//     (seg ?? (typeof Intl !== 'undefined' && 'Segmenter' in Intl))
//       ? new Intl.Segmenter(locale, { granularity: 'grapheme' })
//       : undefined;
//   if (!segmenter) return '';

//   const itr = segmenter.segment(s)[Symbol.iterator]();
//   const first = itr.next();
//   if (first.done) return '';

//   const { index, segment } = first.value;
//   return s.slice(index, index + segment.length);
// }
