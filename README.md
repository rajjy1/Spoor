
## Spoor - what you owe your team

   Spoor is a chrome extension that fetches all pending pull requests from github, failed jenkins build from a jenkins view, pending code reviews from crucible and all open assigned jiras and displays it in a chrome extension. It will have a label that displays the total count. The extension will have a link to each task in the pop-up window.

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

