# Player Tracker Chrome Extension

This is a chrome extension that keeps track of player at bats.  User can add players and be notified when the player is at bat, on deck, or in hole.  UI is built with React.JS and Redux.

>The accounts, descriptions, data and presentation in the referring page (the "Materials") are proprietary content of MLB Advanced Media, L.P ("MLBAM"). Only individual, non-commercial, non-bulk use of the Materials is permitted and any other use of the Materials is prohibited without prior written authorization from MLBAM. Authorized users of the Materials are prohibited from using the Materials in any commercial manner other than as expressly authorized by MLBAM.

## Building the extension

`npm run build`

Need to zip the `/dist` directory

Currently, the extension is not minified.

## Development

`webpack` or `webpack --watch`

## How it works

Every hour, the extension checks all game times to determine if there is a game starting
in the next hour.  If there is at least one game, the extension updates every minute to
find players at bat, on deck or in hole.

## Tests

`npm test`

## NOTES

Add runtime error for chrome.storage.sync