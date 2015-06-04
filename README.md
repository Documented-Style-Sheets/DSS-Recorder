# DSS Recorder
A Chrome Extension to record and save interactivity to be played back.

### Development environment
The source for the extension lives in the `src` folder. 
**DO NOT EDIT THE ROOT BACKGROUND.JS AND CONTENT.JS FILES. THEY WILL BE OVERWRITTEN.**
To get it running locally:

* `git clone https://github.com/DSSWG/DSS-Recorder.git`
* `cd DSS-Recorder`
* `npm install`
* `gulp`
* In Chrome, navigate to `chrome://extensions` and ensure "Developer Mode" (top right) is checked
* Click "Load unpacked extension" and select the cloned folder

Livereload should ensure the background script is reloaded every time you save a file. You will however have to refresh the page you're visiting.
