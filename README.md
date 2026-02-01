# Yelly

Focus on whatever you're doing. Or suffer

The app runs in the browser window and calls you back to pay attention to your screen

Runs locally in your web browser, no data (including video stream) is sent anywhere.

Play it here: https://iungomadre.github.io/yelly/

## Motivation

Created as a side project for a friend, mostly for fun. Wanted to learn `Tensorflow.js` and audio/video API of a browser. Is it ambitious? No. It is fun? I sure hope so

## Features

- **Live camera** – Uses your webcam
- **Gaze detection** – Detects when you're looking at the screen
- **Reaction** – If you look away for ~3 seconds, asks you to come back nicely
- **Resets automatically** – Looking back at the screen makes `Yelly` calm down

## Tech Stack

- [Preact](https://preactjs.com/) – UI
- [Vite](https://vitejs.dev/) – Build and dev server
- [TensorFlow.js](https://www.tensorflow.org/js) + [Face Landmarks Detection](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection) – Face mesh and gaze (MediaPipe Face Mesh)

## Installation

```bash
git clone <repo-url>
cd yelly
npm install
```

## Usage

**Development**

```bash
npm run dev
```

Then open the URL shown in the terminal (e.g. `http://localhost:5173`). Allow camera access when prompted.

**Production build**

```bash
npm run build
npm run preview
```

## License

[WTFPL](http://www.wtfpl.net/)

