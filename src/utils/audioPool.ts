/**
 * AudioPool manages a set of Audio elements for a given source file.
 * It allows overlapping playback without cutting sounds prematurely.
 */
export interface AudioPool {
  /**
   * Play the next audio instance with a slight random playback rate variation.
   */
  play(): void;
}

/**
 * Create an AudioPool.
 *
 * @param source - Path to the audio file.
 * @param poolSize - Number of audio instances to keep in the pool.
 * @param rateVariation - Maximum random variation applied to playbackRate.
 */
export function createAudioPool(
  source: string,
  poolSize: number,
  rateVariation: number = 0,
): AudioPool {
  const pool = Array.from({length: poolSize}, () => new Audio(source));
  let index = 0;

  return {
    play(): void {
      const audio = pool[index];
      index = (index + 1) % pool.length;

      audio.pause();
      audio.currentTime = 0;
      const variation = 1 + (Math.random() * 2 - 1) * rateVariation;
      audio.playbackRate = variation;
      void audio.play();
    },
  };
}
