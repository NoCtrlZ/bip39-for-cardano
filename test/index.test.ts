/**
 * @jest-environment node
 */

import { entropyToMnemonic } from '../src/index';
import DEFAULT_WORDLIST from '../src/wordlist/mnemonic';

describe('Cardano Generate Mnemonic Test', () => {
  it('Test Init', () => {
    const seed = randomHex();
    const mnemonic = entropyToMnemonic(seed);
    const mnemonicWords = mnemonic.split(' ');

    expect(mnemonicWords.length).toBe(15);
    for (let i = 0; i < mnemonicWords.length; i++) {
      expect(!DEFAULT_WORDLIST.indexOf(mnemonicWords[i])).not.toBe(-1);
    }
  });
});

const randomHex = () => {
  const S = 'abcdefABCDEF0123456789';
  const N = 41;
  return Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join('');
};
