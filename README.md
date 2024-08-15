# PEW PEW TIMER

A simple and free PAR timer for shooting drills.

## Launch

Once you have obtained the project, download the dependencies :

```bash
npm i
```

or

```bash
yarn
```

Run the development server:

```bash
npm run dev
```

or

```bash
yarn run dev
```

## Operation
Choose the durations for the PAR time, delay in between, and the number of repetitions in seconds. The system accepts one decimal place.  
Launch the timer by clicking the **Start** button. The system provides text and color indications to inform you of which stage the shooter is in, as well as two different beeps at the beginning and end of the PAR time.  
**Stop** button reset everything.

### Randomize
You can randomize a part of the choosen time for the delay stage by clicking the **Randomize** button.
The default randomized ratio is 0.5, but you can change it in the `.env` file.

### Online version
https://pewpewtimer.vercel.app