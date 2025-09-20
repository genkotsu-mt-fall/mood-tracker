import emojiRegEx from 'emoji-regex';

export const singleEmojiRe = new RegExp(`^(${emojiRegEx().source})$`, 'u');
