
## Spoor - what you owe your team

   Spoor is a chrome extension that fetches all pending pull requests from github, failed jenkins build from a jenkins view, pending code reviews from crucible and all open assigned jiras and displays it in a chrome extension. It will have a label that displays the total count. The extension will have a link to each task in the pop-up window.
   
![alt tag](https://github.cerner.com/DR026404/Spoor/blob/master/Spoor-diagram.png)

## Dependencies

The UI is built using React, so you'll need to install Babel to compile the JSX into JavaScript:

    npm install -g babel-cli

The project also use `grunt` for the build process.

    npm install -g grunt-cli

Then install `npm` dependencies and other stuff:

    npm install

To build, run the following command:

    grunt

Build outputs to `build/`.

## Installation

* Go to Chrome extensions tool in Chrome
   * Click on Open Menu button in chrome, should look like three lines in the chrome tab
   * Click on more tools
   * Click on Extensions
   * Enable Developer mode by clicking the checkbox
* You could directly drag the build.crx which is already compiled into the extensions itself. Otherwise,
* Click on Load Unpacked Extension...
* Select the build folder that was generated.
* Your chrome extension should be shown on the chrome tab itself.
* Go to settings and add your cerner userId and jenkins build view like
   *  http://build.aeon.cerner.corp/view/physvc-messaging/
