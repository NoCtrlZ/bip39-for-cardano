# Cardano Mnemonic Generator
![npm version](https://badge.fury.io/js/cardano-mnemonic.svg)  
This is cardano mnemonic generator.
## Installation

```
$ npm i --save cardano-mnemonic
```

## Usage

```javascript
import { entropyToMnemonic } from 'cardano-mnemonic'

const generateMnemonic = () => {
    const randomString = "kio03290cw9ec9";
    const mnemonic = entropyToMnemonic(randomString);
}
```

## Test
```
$ npm run test
```
