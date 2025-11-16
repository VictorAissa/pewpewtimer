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
The default randomized ratio is 0.5, but you can change it in the settings.

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
-   Microphone access through audio APIs could not be supported on the device and some recording features may not work

---

# PEW PEW TIMER

Un timer PAR simple et gratuit avec enregistrement des temps de tir pour l'entraînement au tir.  
Cette application est optimisée pour les appareils mobiles et doit être installée en tant que PWA.

## Lancement

Une fois le projet récupéré, télécharge les dépendances :

```bash
# NPM
npm i

# Yarn
yarn
```

Lance le serveur de développement :

```bash
# NPM
npm run dev

# Yarn
yarn run dev
```

### Version en ligne

https://pewpewtimer.vercel.app

**Android** (Chrome/Edge/Samsung Internet) :

-   Appuie sur le menu trois points (⋮) en haut à droite
-   Sélectionne "Ajouter à l'écran d'accueil" ou "Installer l'application"

**iOS** (Safari) :

-   Appuie sur le bouton Partager (carré avec flèche vers le haut) en bas de l'écran
-   Descends et appuie sur "Sur l'écran d'accueil"

## Fonctionnement

Il y a 2 modes accessibles depuis la barre de navigation en bas : PAR timer et enregistrement des tirs, plus un modal de réglages.

### PAR Timer

Choisis les durées pour le timer, le délai entre chaque répétition, et le nombre de répétitions en secondes. Le système accepte une décimale sauf pour les répétitions.  
Lance le timer en cliquant sur le bouton **Start**. Le système fournit des indications textuelles et des couleurs pour t'informer de l'étape en cours, ainsi que deux bips différents au début et à la fin du timer PAR.  
Le bouton **Stop** réinitialise tout.

**Randomize**  
Tu peux rendre aléatoire une partie du temps choisi pour la phase de délai en cliquant sur le bouton **Randomize**.  
Le ratio d'aléatoirisation par défaut est de 0.5, mais tu peux le modifier dans les réglages.

### Enregistrement

Choisis la durée du délai unique avant l'enregistrement des tirs. Tu peux également l'aléatoiriser.  
Le système enregistrera les temps de tir à partir du bip de fin du timer jusqu'à ce que tu appuies sur le bouton stop :

-   temps du premier tir
-   splits des autres tirs (+ temps total)
-   temps total jusqu'au dernier tir une fois l'enregistreur arrêté + nombre de tirs

Les données enregistrées resteront affichées jusqu'à ce que tu démarres un nouvel enregistrement en appuyant sur **Start**

### Réglages

Tu peux choisir le seuil de niveau audio à partir duquel le système enregistrera les événements, de 0 à 100. Une valeur de 80 (valeur par défaut) est suffisante pour enregistrer un tir sans enregistrer les événements bruyants ambiants. Tu peux essayer de le réduire au niveau approprié pour enregistrer les tirs à blanc.  
Tu peux modifier le ratio d'aléatoirisation pour faire varier les valeurs aléatoires de 0 (aucune variation) à 100 (variations extrêmes).

## Dépannage

-   Sur iOS, les barres de niveau dans les réglages sont un peu buguées : tu dois double-taper sur le niveau souhaité sur la barre pour le définir
-   Parfois l'accès au microphone via les APIs audio n'est pas supporté sur l'appareil et les fonctionnalités d'enregistrement peuvent ne pas fonctionner
