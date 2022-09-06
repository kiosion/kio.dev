import { goto } from '$app/navigation';

export const handleScrollNav = (
  event: WheelEvent,
  element: HTMLElement,
  { down = '', up = '' }
) => {
  if (!event) {
    return;
  }

  // console.log('element: ', element);
  // const element = <HTMLElement>event.currentTarget;
  const { height } = element.getBoundingClientRect();

  // console.log('scroll: ', element.scrollHeight - element.offsetTop);
  // console.log('scrollTop: ', element.scrollTop);
  // console.log('boundHeight: ', height);

  if (event.deltaY > 11) {
    if (element && element.scrollHeight - element.scrollTop === height) {
      if (down !== '') {
        event.preventDefault();
        goto(down);
      }
    }
  }
  // else if (event.deltaY < -11) {
  //   up !== '' && goto(up);
  // }
};
