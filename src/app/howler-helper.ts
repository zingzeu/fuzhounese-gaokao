export function getHowlProps(isIOS: boolean) {
  if (isIOS) {
    return {
      // Use HTML5 <audio> to bypass silent mode on iOS.
      // Howler defaults to Web Audio, which will be muted in silent mode.
      html5: true,
      mute: false,
      useWebAudio: false,
      webAudio: false,
      volume: 1,
    };
  } else {
    return {};
  }
}
