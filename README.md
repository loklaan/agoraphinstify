# Agoraphinstify

Web mashup that combines Maps, Crowdsourced Photos and Music to give the illest of chills to a suffering Agoraphobe.

[![Issues in Progress](https://badge.waffle.io/loklaan/agoraphinstify.svg?label=in progress&title=In Progress)](http://waffle.io/loklaan/agoraphinstify)
[![Build Status](https://travis-ci.org/loklaan/agoraphinstify.svg?branch=master)](https://travis-ci.org/loklaan/agoraphinstify)
[![Code Climate](https://codeclimate.com/github/loklaan/agoraphinstify/badges/gpa.svg)](https://codeclimate.com/github/loklaan/agoraphinstify)
[![Test Coverage](https://codeclimate.com/github/loklaan/agoraphinstify/badges/coverage.svg)](https://codeclimate.com/github/loklaan/agoraphinstify)

## Installation
Install with `npm`:

```shell
$ npm install
```

## Usage
Start a local server using `npm`:

```shell
$ npm start
```

## Development
Run unit and e2e tests with `npm`:

```shell
$ npm test
$ npm run test-e2e
```

Tests are written with BDD Jasmine framework. `jasmine-node` runs server side unit tests, `karma` runs client side unit tests on available browsers and `protractor` runs end to end tests with WebDriver.

Replace API keys in the `config.js` with your own, if required.

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright 2014 Lochlan Bunn