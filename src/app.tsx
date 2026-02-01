import { useState } from "preact/hooks";
import { IntroPanel } from "./IntroPanel";
import { MainContent } from "./MainContent";

export function App() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return <IntroPanel onStart={() => setHasStarted(true)} />;
  }

  return <MainContent />;
}
