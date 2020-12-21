import DEFAULT_WORDLIST from './wordlist/mnemonic';
import createHash from 'create-hash';

const INVALID_ENTROPY = 'Invalid entropy';
const WORDLIST_REQUIRED =
  'A wordlist is required but a default could not be found.\n' +
  'Please explicitly pass a 2048 word array explicitly.';

export function entropyToMnemonic(
  entropy: Buffer | string,
  wordlist?: string[]
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
  const words = chunks.map((binary: string): string => {
    const index = binaryToByte(binary);
    return wordlist![index];
  });

  return words.join(' ');
}

function deriveChecksumBits(entropyBuffer: Buffer): string {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = createHash('sha256').update(entropyBuffer).digest();

  return bytesToBinary(Array.from(hash)).slice(0, CS);
}

const binaryToByte = (bin: string): number => parseInt(bin, 2);

const bytesToBinary = (bytes: number[]): string =>
  bytes.map((x: number): string => lpad(x.toString(2), '0', 8)).join('');

const lpad = (str: string, padString: string, length: number): string => {
  while (str.length < length) str = padString + str;
  return str;
};
