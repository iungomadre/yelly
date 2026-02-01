type IntroPanelProps = {
  onStart: () => void;
};

export function IntroPanel({ onStart }: IntroPanelProps) {
  return (
    <div className="intro-panel">
      <div className="intro-panel__card">
        <h2 className="intro-panel__title">Yelly</h2>
        <p className="intro-panel__text">
          This app uses your camera to detect when you're looking at the screen.
          If you look away for a few seconds, it will play a sound and enter
          "chaos mode" until you look back.
        </p>
        <p className="intro-panel__text">
          No video or face data is sent anywhere—everything runs in your
          browser. You'll be asked for camera permission when you start.
        </p>
        <button type="button" className="intro-panel__button" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}
