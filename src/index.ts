import DEFAULT_WORDLIST from './wordlist/mnemonic'

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED =
  'A wordlist is required but a default could not be found.\n' +
  'Please explicitly pass a 2048 word array explicitly.';

  export function entropyToMnemonic(
    entropy: Buffer | string,
    wordlist?: string[],
    ): string {
        if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
        }
        wordlist = wordlist || DEFAULT_WORDLIST;
        if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
        }

        // 128 <= ENT <= 256
        if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
        }
        if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
        }
        if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
        }

        const entropyBits = bytesToBinary(Array.from(entropy));
        const checksumBits = deriveChecksumBits(entropy);

        const bits = entropyBits + checksumBits;
        const chunks = bits.match(/(.{1,11})/g)!;
        const words = chunks.map(
        (binary: string): string => {
            const index = binaryToByte(binary);
            return wordlist![index];
        },
        );

        return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ');
}
