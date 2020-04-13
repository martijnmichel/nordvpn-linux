# NordVPN Linux (nordvpn-linux)

Be warned, this app will make connecting to NordVPN as easy as on windows and macos. It uses Electron and NordVPN-cli under the hood.

![NordVPN Linux](/screens/Screenshot_20200413_110815.png?raw=true "Optional Title")
![NordVPN Linux](/screens/Screenshot_20200413_110856?raw=true "Optional Title")

# How to use

This is just an initial setup, more will come later.

## Dependencies
NordVPN CLI: Install the nordvpn-cli for your distro. More info is on their website.

## Install
Double-click on your downloaded .AppImage or .snap binary.

## Login
The app will prompt your nordvpn credentials when opening the app or trying to connect to a server while youre not logged in. Credentials are saved automagically.

## Connect to a server
Click on a country to connect to a server. You will be prompted for your credentials if youre not logged in.

## Change settings
Open the popup menu by clicking on the bars on the topleft, change any setting you like. They are saved automatically.

# If you want to contribute

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m electron
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build -m electron
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
