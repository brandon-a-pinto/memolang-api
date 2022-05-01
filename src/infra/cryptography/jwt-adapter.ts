import { sign, verify } from 'jsonwebtoken'

import { Decrypter, Encrypter } from '@/data/contracts'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(plaintext: string): Promise<string> {
    return sign({ id: plaintext }, this.secret)
  }

  async decrypt(ciphertext: string): Promise<string> {
    return verify(ciphertext, this.secret) as any
  }
}
