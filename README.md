# NordVPN Linux (nordvpn-linux)

Be warned, this app will make connecting to NordVPN as easy as on windows and macos. It uses Electron and NordVPN-cli under the hood.

# How to use

This is just an initial setup, more will come later.

## Dependencies
NordVPN CLI: Install the nordvpn-cli for your distro. More info is on their website.

## Login
Login to nordvpn is still required to go through the terminal. You can use the built-in terminal or your favorite os-terminal. Type: nordvpn login (enter your details after hitting enter)

Once logged in, this app can take over. Logging in is only required once.

## Connect to a server
Click on a country to connect to a server. (You need to be logged in)

## Change settings
Open the popup menu by clicking on the bars on the topleft, change any setting you like. They are saved automatically.

# If you want to contribute

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
