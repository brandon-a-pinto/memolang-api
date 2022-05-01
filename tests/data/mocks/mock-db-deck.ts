import { AddDeckRepository } from '@/data/contracts'

export class AddDeckRepositoryMock implements AddDeckRepository {
  params: AddDeckRepository.Params

  async add(data: AddDeckRepository.Params): Promise<AddDeckRepository.Result> {
    this.params = data
  }
}
