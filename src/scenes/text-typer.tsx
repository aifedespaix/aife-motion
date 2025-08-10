import { Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { theme } from "../theme";
import { createAudioPool } from "../utils/audioPool";

/**
 * TextTyper scene displaying text with a typewriter effect and sound.
 */
export default makeScene2D(function* TextTyper(view) {
  const textRef = createRef<Txt>();
  const content = "J'ai codé un jeu";
  const totalDuration = 3;
  const step = totalDuration / content.length;

  const typePool = createAudioPool("/sfx/typing/type.wav", 8, 0.05);
  const spacePool = createAudioPool("/sfx/typing/space.wav", 4, 0.05);

  view.add(
    <Rect
      layout
      width={"100%"}
      height={"100%"}
      fill={"#000"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Txt
        ref={textRef}
        text=""
        fontFamily={theme.font}
        fontSize={96}
        fill={"#fff"}
      />
    </Rect>
  );

  let currentText = "";
  for (const char of content) {
    currentText += char;
    textRef().text(currentText);

    if (char === " ") {
      spacePool.play();
    } else {
      typePool.play();
    }

    yield* waitFor(step);
  }
});
