import { crypto } from './crypto/crypto'
export { ChaidId } from './extensions/chain-id'
export { Seed } from './extensions/seed'
export { isPrivateKey, isPublicKey } from './crypto/util'
export { crypto } from './crypto/crypto'
export * from './crypto/interface'
export const {
  signBytes,
  keyPair,
  publicKey,
  privateKey,
  address,
  blake2b,
  keccak,
  sha256,
  sharedKey,
  seed,
  base64Encode,
  base64Decode,
  base58Encode,
  base58Decode,
  base16Encode,
  base16Decode,
  stringToBytes,
  bytesToString,
  randomSeed,
  randomBytes,
  verifySignature,
  verifyPublicKey,
  verifyAddress,
  messageDecrypt,
  messageEncrypt,
  aesDecrypt,
  aesEncrypt,
  split,
  concat,
} = crypto({ output: 'Bytes' })

