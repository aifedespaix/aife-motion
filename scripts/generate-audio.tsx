import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import audioconcat from "audioconcat";

// ------------------- CONFIG -------------------
const content = "J'ai codé un jeu";
const totalDuration = 3; // secondes
const step = totalDuration / content.length;

const typePath = path.resolve("./public/sfx/typing/type.wav");
const spacePath = path.resolve("./public/sfx/typing/space.wav");
const tempDir = path.resolve("./temp_sfx");
const outputFile = path.resolve("./public/audio/typer_mix.wav");
// ------------------------------------------------

// Création dossier temporaire
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const tempFiles: string[] = [];
let currentTime = 0;

content.split("").forEach((char, i) => {
  const sfxFile = char === " " ? spacePath : typePath;
  const tempFile = path.join(tempDir, `sfx_${i}.wav`);

  // Ajout d'un silence avant le son
  const ffmpegCmd = [
    // Silence
    `ffmpeg -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t ${currentTime.toFixed(
      3
    )} silence.wav`,
    // Concat silence + son
    `ffmpeg -y -i "concat:silence.wav|${sfxFile}" -c copy "${tempFile}"`,
  ].join(" && ");

  execSync(ffmpegCmd, { stdio: "inherit" });
  tempFiles.push(tempFile);

  currentTime = step; // après la première frappe, délai fixe
});

// Concaténation finale
audioconcat(tempFiles)
  .concat(outputFile)
  .on("start", (cmd: string) => console.log("FFmpeg:", cmd))
  .on("error", (err: Error) => console.error("❌ Erreur concat:", err))
  .on("end", () => {
    console.log("✅ Fichier audio généré :", outputFile);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
