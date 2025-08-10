// src/scenes/typewriter.scene.tsx
import { makeScene2D, Txt, Rect, Layout } from "@motion-canvas/2d";
import { all, createRef, waitFor } from "@motion-canvas/core";

type TypewriterOptions = {
  cps?: number;
  jitter?: number;
  pausePunct?: number;
  cursorWhenDone?: "hide" | "solid" | "blink";
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function* typeText(
  text: Txt,
  cursor: Rect,
  fullText: string,
  {
    cps = 20,
    jitter = 0.12,
    pausePunct = 0.28,
    cursorWhenDone = "blink",
  }: TypewriterOptions = {}
) {
  const step = 1 / cps;

  // blink du curseur
  let blinking = true;
  const blink = function* () {
    while (blinking) {
      yield* cursor.opacity(1, 0.35);
      yield* cursor.opacity(0.2, 0.35);
    }
  };

  yield* all(
    blink(),
    (function* () {
      let out = "";
      for (let i = 0; i < fullText.length; i++) {
        const ch = fullText[i];
        out += ch;
        text.text(out);

        let d = step * rand(1 - jitter, 1 + jitter);
        if (/[.,!?…]/.test(ch)) d += pausePunct;
        if (ch === "\n") d += 0.15;

        yield* waitFor(d);
      }
    })()
  );

  // état final du curseur
  blinking = false;
  if (cursorWhenDone === "hide") {
    yield* cursor.opacity(0, 0.2);
  } else if (cursorWhenDone === "solid") {
    yield* cursor.opacity(1, 0.2);
  } else {
    while (true) {
      yield* cursor.opacity(1, 0.6);
      yield* cursor.opacity(0.2, 0.6);
    }
  }
}

export default makeScene2D(function* (view) {
  view.fill("#0b0f14");

  const text = createRef<Txt>();
  const cursor = createRef<Rect>();

  view.add(
    <Layout direction="row" alignItems="center" gap={6}>
      <Txt
        ref={text}
        width={1200}
        textAlign={"left"}
        fontSize={56}
        lineHeight={1.2}
        fontFamily={
          "JetBrains Mono, Fira Code, ui-monospace, Menlo, Consolas, monospace"
        }
        fill={"#e6edf3"}
        shadowColor={"#0008"}
        shadowBlur={18}
      />
      <Rect
        ref={cursor}
        width={() => Math.max(2, text().fontSize() * 0.08)}
        height={() => text().fontSize() * 0.9}
        fill={() => text().fill()}
        opacity={1}
      />
    </Layout>
  );

  const content =
    "Bienvenue dans Motion Canvas.\n" +
    "Texte affiché char par char…\n" +
    "Pause légère sur la ponctuation.";

  yield* typeText(text(), cursor(), content, {
    cps: 22,
    jitter: 0.12,
    pausePunct: 0.28,
    cursorWhenDone: "blink",
  });

  yield* waitFor(0.6);
});
