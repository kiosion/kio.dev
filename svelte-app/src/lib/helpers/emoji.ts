import twemoji from 'twemoji';

export const parseEmoji = (element: HTMLElement) => {
  element && twemoji.parse(element),
    element?.querySelectorAll('img.emoji')?.forEach((emoji: Element) => {
      if (!(emoji as HTMLElement)?.style) {
        return;
      }
      (emoji as HTMLElement).setAttribute(
        'style',
        'display: inline-block;width: 1.1em;height: 1.1em;margin-right: 0.05em;vertical-align: -0.1em;'.replace(
          /\s+/g,
          ' '
        )
      );
    });
};
