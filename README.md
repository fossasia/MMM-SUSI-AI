# Susi Magic Mirror Module

[![Build Status](https://travis-ci.org/fossasia/MMM-SUSI-AI.svg?branch=master)](https://travis-ci.org/fossasia/MMM-SUSI-AI)

SUSI.AI Module for Magic Mirror Project

This project aims at creating a Magic Mirror Module to provide intelligent answers via Susi directly on your Magic Mirror.

Magic Mirror Project: https://github.com/MichMich/MagicMirror

## Current Status

Currently, magic mirror module for Susi is in working state. You can invoke Susi via hotword 'Susi' and ask any query,
Susi will reply back with answer. Notably,

- Hotword Detection is working via Snowboy Hotword Detection
- Speech Recognition is Working via Microsoft Cognitive Services: Bing Speech API
- Text to Speech is working via Bing Text to Speech.
- Answer and Map Action Type by Susi API Working.
- Authentication with Face Recognition with MMM-Facial-Recognition module.

## Next Steps

- Add better visualization support in module
- Display data by various action types on Mirror Screen.

# How to install?

## Hardware Requirements
- A Raspberry Pi or similar development board.
- A screen with 2 way mirror.
- A USB Microphone.
- A Camera for Face Recognition (Optional). If you are using a webcam it has Microphone 
built in , so you do not need USB Microphone.
- Keyboard and Mouse. It is optional but recommended for initial setup.
You may also SSH into your development board.

## Software Requirements
- NodeJS (Recommended version 6+). Raspbian repositories have old NodeJS. Install using [nvm](https://github.com/creationix/nvm) 
- Node Package Manager (npm)
- Some additional dependencies. Install using
```
sudo apt install sox libsox-fmt-all libatlas-dev libatlas-base-dev
```

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

or if you want to use SUSI in authenticated mode with **Face Recognition**

- Install MMM-Facial-Recognition Module to your MagicMirror by following instructions on the
[offical Github page](https://github.com/paviro/MMM-Facial-Recognition)
- Train Face Recognition for 1 or more person. You need to have a SUSI account for each one of them.
Sign up at https://accounts.susi.ai
- In the config file (config.js), add the following lines. If there are multiple users, add more ```user``` object to
users array.

```
{
	module: "MMM-SUSI-AI",
	position: "top_bar",
	config: {
	    hotword: "Susi",
	    users: [
	    {
	        face_recognition_username: "NAME_FOR_THIS_USER_USED_IN_MMM-Facial-Recognition"
	        email: "YOUR_EMAIL",
	        password: "YOUR_SUSI_PASSWORD"
	    }
	    ]
	},
	classes: "default everyone"
}
```
- Save the config.
- Start the MagicMirror again by ```npm start```

Now, you can invoke Susi via "Susi" Hotword. Once Hotword Detected, your MagicMirror screen will blur.
Ask you query by voice after that, Susi will speak back the reply and Mirror Screen will go in original state.

# Additional/Optional Setup

If you want better experience with SUSI AI on your MagicMirror, disable the default 'Compliments' module.
To disable the 'Compliments Module', comment or remove the following lines in configuration file in config/config.js

```
{
			module: "compliments",
			position: "lower_third"
},
```


# Got any problems ?

While running if you get a log statement mentioning SnowBoy module not found, run
```npm run electron-rebuild```

Project is still in alpha, please report an issue if you experience any problems with logs/screenshots.



# Credits

The code structure of this module has been inspired and taken from [Awesome Alexa Module](https://github.com/dolanmiu/MMM-awesome-alexa) for Magic Mirror.


