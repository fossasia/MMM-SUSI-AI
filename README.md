# Susi Magic Mirror Module

SUSI.AI Module for Magic Mirror Project

This project aims at creating a Magic Mirror Module to provide intelligent answers via Susi directly on your Magic Mirror.

Magic Mirror Project: https://github.com/MichMich/MagicMirror

## Current Status

Currently, magic mirror module for Susi is in working state. You can invoke Susi via hotword 'Susi' and ask any query,
Susi will reply back with answer. Notably,

- Hotword Detection is working via Snowboy Hotword Detection
- Speech Recognition i Working via Microsoft. Cognitive Services: Bing Speech API
- Text to Speech is working via Flite TTS.
- Answer Action Type by Susi API Working.

## Next Steps

- Add visualization support in module
- Display data by various action types on Mirror Screen.

# How to install?

## Install Magic Mirror
- ```git clone https://github.com/MichMich/MagicMirror ```
- ```cd MagicMirror```
- ```npm install & npm start```
- If you wish to start in development mode, run ```npm start dev```

This will start Magic Mirror with basic modules on your screen.

## Install Susi Module
- Go to modules directory in Magic Mirror project folder and clone Susi MagicMirror repository
``` git clone https://github.com/fossasia/MMM-SUSI-AI.git```
- Go to susi_magic mirror directory, run ```npm install```
- Also run, ```npm run electron-rebuild```
- Run ./install-flite.sh to install Flite TTS Voices.

## Add Susi Module to MagicMirror
- Edit config/config.js in the MagicMirror directory
- Add following to modules JSON array to enable Susi Module,
```
{
	module: "MMM-SUSI-AI",
	position: "top_bar",
	config: {
	    hotword: "Susi"
	}
}
```
- Start the MagicMirror again by ```npm start```

Now, you can invoke Susi via "Susi" Hotword. Once Hotword Detected, your MagicMirror screen will blur.
Ask you query by voice after that, Susi will speak back the reply and Mirror Screen will go in original state.

# Got any problems ?

While running if you get a log statement mentioning SnowBoy module not found, run
```npm run electron-rebuild```

Project is still in alpha, please report an issue if you experience any problems with logs/screenshots.



# Credits

The code structure of this module has been inspired and taken from [Awesome Alexa Module](https://github.com/dolanmiu/MMM-awesome-alexa) for Magic Mirror.


