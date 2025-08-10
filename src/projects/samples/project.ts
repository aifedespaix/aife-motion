import { makeProject } from "@motion-canvas/core";

import example from "./scenes/example?scene";
import { makeScene2D } from "@motion-canvas/2d";

export default makeProject({
  scenes: [example],
});
