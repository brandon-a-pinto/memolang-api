import faker from '@faker-js/faker'

import { Hasher, HasherComparer, Encrypter, Decrypter } from '@/data/contracts'

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid()
  plaintext: string

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}

export class HasherComparerSpy implements HasherComparer {
  digest = faker.datatype.uuid()
  plaintext: string
  result = true

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.result
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: string
  ciphertext = faker.datatype.uuid()

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.ciphertext
  }
}

export class DecrypterSpy implements Decrypter {
  ciphertext: string
  plaintext = faker.datatype.uuid()

  async decrypt(ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext
    return this.plaintext
  }
}
