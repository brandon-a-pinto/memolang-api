import { hash, compare } from 'bcrypt'

import { Hasher } from '@/data/contracts'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(plaintext: string): Promise<string> {
    return hash(plaintext, this.salt)
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return compare(plaintext, digest)
  }
}
