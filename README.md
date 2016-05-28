# Baseball Player Tracker Chrome Extension

This is a chrome extension that keeps track of player at bats.  Users can add players and be notified when players are at bat, on deck, or in hole.  UI is built with React.JS and Redux.

Uses mlb api.
>The accounts, descriptions, data and presentation in the referring page (the "Materials") are proprietary content of MLB Advanced Media, L.P ("MLBAM"). Only individual, non-commercial, non-bulk use of the Materials is permitted and any other use of the Materials is prohibited without prior written authorization from MLBAM. Authorized users of the Materials are prohibited from using the Materials in any commercial manner other than as expressly authorized by MLBAM.

## Extension Usage

Add players and set notification preference.
There are three perferences. At Bat, On Deck, and In Hole.
Only at bat and on deck is turned on by default.
There is also a persistent toggle button.  When this is turned on, the notifications will not close until user manually closes or clicks to watch mlb.tv.
Clicking on 'watch on mlb.tv' in the notification will open mlb.tv in a new tab.  To acutally watch player at bats on mlb.tv, user requires a paid subscription.

## Building the extension

run `npm run build`.

The output will be in  `/dist` directory.
The directory needs to be a `.zip` file.

## Development

run `webpack` or `webpack --watch`.

### Note on Usage

* Notifications do not fire when playing a video in fullscreen.

## Tests

run `npm test`.

## NOTES

* Add runtime error for chrome.storage.sync.
* Need to get extension icons.