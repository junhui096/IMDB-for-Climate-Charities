# IsItGettingHotOrIsItJustMe Front-end

## Development

Install latest stable NodeJS
```
sudo apt-get update && sudo apt-get -y upgrade
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```

Start local server
```
npm start
```

Run unit tests
```
npm test
```

Build production package
```
npm run build
```

## Unit Tests

Run Mocha unit tests
```
npm run test
```


## GUI Acceptance Test by Selenium

Run Selenium test
```
python test/acceptance/guitests.py
```

Or
```
npm run guitest
```

Currently, we're hosting Firefox binaries for Linux and Windows. If failure on executing `geckodriver` check if there is a binary available for your OS. If not, try download specific build [here](https://github.com/mozilla/geckodriver/releases) and install in an executable path.
