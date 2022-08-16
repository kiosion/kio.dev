import twemoji from 'twemoji';

export const parseEmoji = (element: HTMLElement) => {
  if (!element) {
    return;
  }

  twemoji.parse(element);
  element.querySelectorAll('img.emoji').forEach((emoji: Element) => {
    if (!emoji?.style) {
      return;
    }
    emoji.style.display = 'inline-block';
    emoji.style.width = '1.1em';
    emoji.style.height = '1.1em';
    emoji.style.marginRight = '0.05em';
    emoji.style.verticalAlign = '-0.1em';
  });
};
