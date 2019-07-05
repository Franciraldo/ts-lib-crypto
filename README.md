﻿# ts-lib-crypto [![npm version](https://badge.fury.io/js/%40waves%2Fwaves-crypto.svg)](https://www.npmjs.com/package/@waves/waves-crypto)

[lib-name]: waves-crypto

The waves protocol is a set of rules named consensus by which nodes reach an agreement on the network, and format which nodes use to communicate with each other. It based on several well described hash and crypto algorithms and has predefined set of entries to operate on network. This library contains all algorithm implementations like signature verification and protocol entries like address used in waves protocol. Also it contains utility methods and format converters to help 3rd party developers.

# Agenda

- **[Import styles](#import-styles)**
- **[Inputs](#inputs)**
- **[Outputs](#outputs)**
 - **[Seed generation](#seed-generation)**
	 - [randomSeed](#randomseed)
	 - [seedWordsList](#seedwordslist)
 - **[Keys and address](#keys-and-address)**
	 - [publicKey](#publickey)
	 - [privateKey](#privatekey)
	 - [keyPair](#keypair)
	 - [address](#address)
 - **[Signatures](#signatures)**
	 - [signBytes](#signbytes)
	 - [verifySignature](#verifySignature)
- **[Hashing](#hashing)**
	 - [blake2b](#blake2b)
	 - [keccak](#keccak)
	 - [sha256](#sha256)
 - **[Random](#random)**
	 - [randomBytes](#randomBytes)
	 - [random](#random)
 - **[Base encoding\decoding](#base-encodingdecoding)**
	 - [base16](#base-encodingdecoding)
	 - [base58](#base-encodingdecoding)
	 - [base64](#base-encodingdecoding)
 - **Messaging**
	 - sharedKey
	 - messageDecrypt
	 - messageEncrypt
 - **Encryption**
	 - aesEncrypt
	 - aesDecrypt
 - **Utils**
	 - split
	 - concat
	 - stringToBytes
	 - bytesToString

# Import styles
The is several ways of doing things when using **ts-lib-crypto**.
You can import functions strait-forward:
```ts
import { address } from  '@waves/waves-crypto'
address('my secret seed') // 3PAP3wkgbGjdd1FuBLn9ajXvo6edBMCa115
```
Or you can use a crypto constructor function:
```ts
import { crypto } from  '@waves/waves-crypto'
const { address } = crypto()
address('my secret seed') // 3PAP3wkgbGjdd1FuBLn9ajXvo6edBMCa115
```
The second approach gives you more flexibility, using this approach you are able to embed the **seed** and use all seed-dependant functions without **seed** parameter:
```ts
import { crypto } from  '@waves/waves-crypto'
const { address } = crypto({seed: 'my secret seed'})
address() // 3PAP3wkgbGjdd1FuBLn9ajXvo6edBMCa115
```

# Inputs 
**ts-lib-crypto** is even more flexible. Any function argument that represents binary data or seed could be passed in several ways. Let's take a look on the following example:
```ts
import { address } from  '@waves/waves-crypto'
const  seedString  =  'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
const  seedBytesAsArray  = [117, 110, 99, 108, 101, 32, 112, 117, 115, 104, 32, 104, 117, 109, 97, 110, 32, 98, 117, 115, 32, 101, 99, 104, 111, 32, 100, 114, 97, 115, 116, 105, 99, 32, 103, 97, 114, 100, 101, 110, 32, 106, 111, 107, 101, 32, 115, 97, 110, 100, 32, 119, 97, 114, 102, 97, 114, 101, 32, 115, 101, 110, 116, 101, 110, 99, 101, 32, 102, 111, 115, 115, 105, 108, 32, 116, 105, 116, 108, 101, 32, 99, 111, 108, 111, 114, 32, 99, 111, 109, 98, 105, 110, 101]
const  seedBytesAsUintArray  =  Uint8Array.from(seedBytesAsArray)
address(seedString) // 3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36
address(seedBytesAsArray) // 3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36
address(seedBytesAsUintArray) // 3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36
```
As you can see **seed** parameter is treated the same way for **number[]** or **Uint8Array**.
When you pass binary data is could be represented as  **number[]** or **Uint8Array** or even **base58**:
```ts
import { address, randomSeed, sha256 } from '@waves/waves-crypto'
const seed = randomSeed() // uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine
const addressBase58 = address(seed) // 3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36
sha256(addressBase58) // DMPenguwWdLdZ7tesiZY6grw7mjKU2Dob1cn9Uq9TKfp
```
Here we got **sha256** hash from address bytes represented as **base58** *(3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36)*. 
Be aware that **sha256** value is not based on "*3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36*" string itself, this value was treated as a **binary data** and **base58Decode** was applied.

# Outputs
As you've noticed from the previous section *address()* output is **base58** string like:
```ts
// 3PAP3wkgbGjdd1FuBLn9ajXvo6edBMCa115
```
 By default functions from the following list output **base58** string as a result,
 no matter what import-style you choose:
```
keyPair
publicKey
privateKey
address
sharedKey
signBytes
```

If you prefer **binary** output, you can alter this behaviour and make those functions to return **UInt8Array** instead.

When using inline import style:
```ts
// You can use [/bytes] module when importing functions to set output to UInt8Array
import { address } from  '@waves/waves-crypto/bytes'
address('uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine')
// => Uint8Array [1,87,55,118,79,89,6,115,207,200,130,220,32,33,101,69,108,108,53,48,167,127,203,18,143,121]
```
When using crypto constructor function:
```ts
import { crypto } from  '@waves/waves-crypto'
const { address } = crypto({ output: 'Bytes' })
address('uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine')
// => Uint8Array [1,87,55,118,79,89,6,115,207,200,130,220,32,33,101,69,108,108,53,48,167,127,203,18,143,121]
```

# Seed generation

The seed is a set of words or bytes that private and public keys are generated from. The usual Waves seed looks like:
```
uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine
```
There are couple ways to generate seed: 
```ts
const handWrittenSeedString = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
const handWrittenSeedBytes = [117, 110, 99, 108, 101, 32, 112, 117, 115, 104, 32, 104, 117, 109, 97, 110, 32, 98, 117, 115, 32, 101, 99, 104, 111, 32, 100, 114, 97, 115, 116, 105, 99, 32, 103, 97, 114, 100, 101, 110, 32, 106, 111, 107, 101, 32, 115, 97, 110, 100, 32, 119, 97, 114, 102, 97, 114, 101, 32, 115, 101, 110, 116, 101, 110, 99, 101, 32, 102, 111, 115, 115, 105, 108, 32, 116, 105, 116, 108, 101, 32, 99, 111, 108, 111, 114, 32, 99, 111, 109, 98, 105, 110, 101]
```
Or if you need seed with nonce:
```ts
import { seedWithNonce, randomSeed, address } from '@waves/waves-crypto'

const nonce = 1
const seedphrase = randomSeed() // uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine
const seed = seedWithNonce(seedphrase, nonce)

//Now you can use seed as usual
address(seed)
```
Seed could be any **string** or **number[]** or **Uint8Array** or **ISeedWithNonce**.

There is also a way to generate seed-phrase using **ts-lib-crypto** described in the next section.

### randomSeed
```ts
import { randomSeed } from '@waves/waves-crypto'

randomSeed() //uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine
```
You can also specify seed-phrase size:
```ts
randomSeed(3) //uncle push human
```
The default seed size is 15 words.

### seedWordsList
If you want to get all the valid seed words that official waves-client generates seed-phrase from, use **seedWordsList** the 2048 word array.
```ts
import { seedWordsList } from '@waves/waves-crypto'
console.log(seedWordsList) // [ 'abandon','ability','able', ... 2045 more items ]
```
# Keys and address

### publicKey
You could get public key either from raw seed-phrase or seed with nonce:
```ts
import { publicKey, seedWithNonce } from '@waves/waves-crypto'
const  seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
publicKey(seed) // 4KxUVD9NtyRJjU3BCvPgJSttoJX7cb3DMdDTNucLN121
publicKey(seedWithNonce(seed, 0)) // 4KxUVD9NtyRJjU3BCvPgJSttoJX7cb3DMdDTNucLN121
```
### privateKey
Same with private key:
```ts
import { privateKey, seedWithNonce } from '@waves/waves-crypto'
const  seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
privateKey(seed)
privateKey(seedWithNonce(seed, 99))
```
### keyPair
You could also obtain a keyPair:
```ts
import { keyPair } from '@waves/waves-crypto'
const  seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
keyPair(seed)
// => { 
//      publicKey:  '4KxUVD9NtyRJjU3BCvPgJSttoJX7cb3DMdDTNucLN121',
//      privateKey: '6zFSymZAoaua3gtJPbAUwM584tRETdKYdEG9BeEnZaGW'
//    }
```
### address
You can create an address for *Mainnet*:
```ts
import { address } from '@waves/waves-crypto'
const  seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
address(seed) // 3P9KR33QyXwfTXv8kKtNGZYtgKk3RXSUk36
```
or *Testnet*:
```ts
address(seed, 'T') // 3MwJc5iX7QQGq5ciVFdNK7B5KSEGbUCVxDw
```
alternatively You could use **TEST_NET_CHAIN_ID** constant instead of **T** literal like this:
```ts
import { address, TEST_NET_CHAIN_ID } from '@waves/waves-crypto'
const  seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
address(seed, TEST_NET_CHAIN_ID) // 3MwJc5iX7QQGq5ciVFdNK7B5KSEGbUCVxDw
```
There are several more useful constants, you can check them in [\[constants\]](/#constants) section.
# Signatures
#### signBytes
To sign arbitrary bytes or usually transaction bytes you should use the **signBytes** function.
Here is sign with seed example:
```ts
import { signBytes } from '@waves/waves-crypto'
const bytes = [117, 110, 99, 108, 101]
const seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
signBytes(seed, bytes) // 5ZpULwrnUYoxQZcw26km6tgGbj1y23ywYB4A9bLCpax6PUdrhkCmmoLBP6C1G5yiMJ7drqN9jNxPym6f8vrPsWnm
```
Also you can use private key to sign bytes:
```ts
import { signBytes, privateKey } from '@waves/waves-crypto'
const bytes = [117, 110, 99, 108, 101]
const seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
const key = privateKey(seed)
signBytes({ privateKey: key }, bytes)
```
Remember that you can use **base58** strings when it's about binary data, so you can represent bytes as **base58** too:
```ts
signBytes({ privateKey:  key }, 'Fk1sjwdPSwZ4bPwvpCGPH6')
```
You can learn more about it in the [outputs](#outputs) section.
#### verifySignature
Verifying signature is a way to proof what particular bytes was signed with a particular private key or seed which correspond to public key that we are checking against:
```ts
import { signBytes, verifySignature, keyPair } from '@waves/waves-crypto'
//Signature roundtrip
const bytes = [117, 110, 99, 108, 101]
const seed = 'uncle push human bus echo drastic garden joke sand warfare sentence fossil title color combine'
const keys = keyPair(seed)
const signature = signBytes(keys, bytes)
verifySignature(keys.publicKey, bytes, signature) // true
```
# Hashing
There are three hashing algorithms available in **ts-lib-crypto**.
#### blake2b
```ts
import { blake2b } from '@waves/waves-crypto'
const bytesArray = [117, 110, 99, 108, 101]
const bytesUint = Uint8Array.from([117, 110, 99, 108, 101])
const bytesBase58 = 'EFRr9cp'
blake2b(bytesArray)  // 9DqBU9wZAR85PyrUSJpwaU9DggM8veyMxRMvFe1q6atu
blake2b(bytesUint)   // 9DqBU9wZAR85PyrUSJpwaU9DggM8veyMxRMvFe1q6atu
blake2b(bytesBase58) // 9DqBU9wZAR85PyrUSJpwaU9DggM8veyMxRMvFe1q6atu

```
#### keccak
```ts
import { keccak } from '@waves/waves-crypto'
const bytesArray = [117, 110, 99, 108, 101]
const bytesUint = Uint8Array.from([117, 110, 99, 108, 101])
const bytesBase58 = 'EFRr9cp'
keccak(bytesArray)  // 5cqz9N2PPjDkSBSwga8AttKzQEHfn8aQ95rcZZmabLA7
keccak(bytesUint)   // 5cqz9N2PPjDkSBSwga8AttKzQEHfn8aQ95rcZZmabLA7
keccak(bytesBase58) // 5cqz9N2PPjDkSBSwga8AttKzQEHfn8aQ95rcZZmabLA7
```
#### sha256
```ts
import { sha256 } from '@waves/waves-crypto'
const bytesArray = [117, 110, 99, 108, 101]
const bytesUint = Uint8Array.from([117, 110, 99, 108, 101])
const bytesBase58 = 'EFRr9cp'
sha256(bytesArray)  // 4JPydqbhxhZF7kpuGA2tJWkXDmevJYfig45gqdV1UF9E
sha256(bytesUint)   // 4JPydqbhxhZF7kpuGA2tJWkXDmevJYfig45gqdV1UF9E
sha256(bytesBase58) // 4JPydqbhxhZF7kpuGA2tJWkXDmevJYfig45gqdV1UF9E
```
# Random
There is several ways to get random values in **ts-lib-crypto**.
To get an **Uint8Array** of random values simply use:
#### randomBytes
```ts
import { randomBytes } from '@waves/waves-crypto'
randomBytes(3) // Uint8Array [ 120, 46, 179 ]             
```
If you want more control over the values format you could use:
#### random
```ts
import { random } from '@waves/waves-crypto'

const length = 3     
random(length, 'Array8')       // [ 19, 172, 130 ]   
random(length, 'Array16')      // [ 61736, 48261, 38395 ] 
random(length, 'Array32')      // [ 406628961, 307686833, 2604847943 ]       
random(length, 'Buffer')       // <Buffer db ff fb>       
random(length, 'Uint8Array')   // Uint8Array [ 137, 85, 212 ]   
random(length, 'Uint16Array')  // Uint16Array [ 35881, 51653, 55967 ]  
random(length, 'Uint32Array')  // Uint32Array [ 698646076, 2957331816, 2073997581 ]    
```
# Base encoding\decoding


```ts
import { base16Encode, base16Decode, base58Encode, base58Decode, base64Encode, base64Decode, randomBytes } from '@waves/waves-crypto'

const bytes = randomBytes(32)

// Base16 same as Hex
const base16String = base16Encode(bytes) // 2059ec5d9ed640b75722ec6a2ff76890e523ea4624887549db761d678ba8f899
const bytesFromBase16 = base16Decode(base16String)

// Base58
const base58String = base58Encode(bytes) // 3BHaM9Q5HhUobQ5oZAqjdkE9HRpmqMx4XLq3GXTMD5tU
const bytesFromBase58 = base58Decode(base58String)

// Base64
const base64String = base64Encode(bytes) // IFnsXZ7WQLdXIuxqL/dokOUj6kYkiHVJ23YdZ4uo+Jk=
const bytesFromBase64 = base64Decode(base64String)
```
# Messaging
	 - sharedKey
	 - messageDecrypt
	 - messageEncrypt
# Encryption
	 - aesEncrypt
	 - aesDecrypt
# Utils
#### split
#### concat
#### stringToBytes
#### bytesToString
