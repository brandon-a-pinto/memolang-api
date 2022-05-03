export interface CheckDeckByOwnerIdRepository {
  checkByOwnerId: (ownerId: string, deckId: string) => Promise<boolean>
}
