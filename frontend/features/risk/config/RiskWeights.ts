export const RiskWeights = {
  OFF_SCREEN_ATTENTION: 18,
  BROWSER_FOCUS_LOST: 20,
  MULTIPLE_FACES_PRESENT: 35,
  DELAYED_RESPONSE: 10,
  EXTENDED_SILENCE: 8,
  LOW_AUDIO_LEVEL: 5,
  MICROPHONE_INTERRUPTION: 15,
} as const;

export type RiskWeightsKeys = keyof typeof RiskWeights;

export default RiskWeights;
