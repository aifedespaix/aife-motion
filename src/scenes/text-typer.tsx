import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {theme} from '../theme';

/**
 * TextTyper scene displaying text with a typewriter effect.
 */
export default makeScene2D(function* TextTyper(view) {
  const textRef = createRef<Txt>();
  const content = "J'ai codé un jeu";
  const totalDuration = 3;
  const step = totalDuration / content.length;

  view.add(
    <Rect
      layout
      width={'100%'}
      height={'100%'}
      fill={'#000'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Txt
        ref={textRef}
        text=""
        fontFamily={theme.font}
        fontSize={96}
        fill={'#fff'}
      />
    </Rect>,
  );

  let currentText = '';
  for (const char of content) {
    currentText += char;
    textRef().text(currentText);
    yield* waitFor(step);
  }
});
