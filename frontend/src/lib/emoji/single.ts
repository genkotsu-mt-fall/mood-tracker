import { singleEmojiRe } from './pattern';

export function isSingleGraphemeIntl(input: string, locale = 'ja') {
  const s = input.trim();
  if (!s) return false;

  if (typeof Intl === 'undefined' || !('Segmenter' in Intl)) return false;

  const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
  const itr = segmenter.segment(s)[Symbol.iterator]();
  const first = itr.next();
  if (first.done) return false;

  const second = itr.next();
  return !!first.value && second.done;
}

export function isSingleEmojiIntl(input: string) {
  const s = input.trim();
  if (!s) return false;
  return singleEmojiRe.test(s) && isSingleGraphemeIntl(s);
}

export function firstGraphemeIntl(
  input: string,
  locale = 'ja',
  seg?: Intl.Segmenter,
) {
  const s = input.trim();
  if (!s) return '';

  const segmenter =
    (seg ?? (typeof Intl !== 'undefined' && 'Segmenter' in Intl))
      ? new Intl.Segmenter(locale, { granularity: 'grapheme' })
      : undefined;
  if (!segmenter) return '';

  const itr = segmenter.segment(s)[Symbol.iterator]();
  const first = itr.next();
  if (first.done) return '';

  const { index, segment } = first.value;
  return s.slice(index, index + segment.length);
}
