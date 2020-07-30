# vote

## Run Build From Command Line
./node_modules/.bin/vue-cli-service build --mode dev   

## Serve with firebase
You might have to logout and login to get auth token to work again
```
firebase logout; firebase login
```

## build before serving
```
./node_modules/.bin/vue-cli-service build --mode dev  
```
Use dev so that you can use the vue dev utils locally

## Serve using firebase so the implicit firebase configuration stuff works
```
firebase serve --port=9000   
```

## Deploy app to firebase website
```
firebase deploy
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### In order to run the emulator (before testing)
```
firebase emulators:start --only firestore
```
The emulator uses firestore.rules file to fill out the rules
Also uses firestore.indexes.json for data (I think)
Also, has a slick ui interface

### In order to initialize the firebase before the emulator is run
```
firebase init
```
### In order to update firebase-tools
```
sudo npm i -g firebase-tools
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
