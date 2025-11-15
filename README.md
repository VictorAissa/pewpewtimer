# PEW PEW TIMER

A simple and free PAR timer and shot time recorder for shooting training.  
This application is optimized for mobile devices and should be installed as a PWA.

## Launch

Once you have obtained the project, download the dependencies :

```bash
# NPM
npm i

# Yarn
yarn
```

Run the development server:

```bash
# NPM
npm run dev

# Yarn
yarn run dev
```

### Online version

https://pewpewtimer.vercel.app

**Android** (Chrome/Edge/Samsung Internet):

-   Tap the three-dot menu (⋮) in the top-right corner
-   Select "Add to Home screen" or "Install app"

**iOS** (Safari):

-   Tap the Share button (square with arrow pointing up) at the -bottom of the screen
-   Scroll down and tap "Add to Home Screen"

## Operation

There are 2 modes accessibles from the bottom navbar : PAR time and recording shots, plus a setting modal.

### PAR time

Choose the durations for the PAR time, delay in between, and the number of repetitions in seconds. The system accepts one decimal place except for repetitions.  
Launch the timer by clicking the **Start** button. The system provides text and color indications to inform you of which stage the shooter is in, as well as two different beeps at the beginning and end of the PAR time.  
**Stop** button reset everything.

**Randomize**  
You can randomize a part of the choosen time for the delay stage by clicking the **Randomize** button.
The default randomized ratio is 0.5, but you can change it in the `.env` file.

### Recording

Choose the duration for the unique delay before shots recording. You can randomize this one as well.  
The system will record shots time from the beep at the end of the timer until you press the stop button :

-   time of the first shot
-   splits of the others shots (+ total time)
-   total time until the last shot once the recorder is stopped + number of shots

The recorded data will stay displayed until you start a new record by pressing **Start**

### Settings

You can choose the audio level threshold from which the system will record events from 0 to 100. A value of 80 (default value) is sufficient to record a shot without recording ambient noisy event, you can try to reduce it to the appropriate level to register dry shots.  
You can modify the randomising ratio to make the random values variying from 0 (no variation) to 100 (extreme variations).

## Troubleshotting

-   On iOS (Safari), the settings level bars are a bit buggy: you should double tap the desired level on the bar to set it
-   Sometimes microphone access through audio APIs is not supported on the device and some features may not work
