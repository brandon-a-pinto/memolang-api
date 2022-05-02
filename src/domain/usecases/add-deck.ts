export interface AddDeck {
  add: (params: AddDeck.Params) => Promise<AddDeck.Result>
}

export namespace AddDeck {
  export type Params = {
    ownerId: string
    title: string
    language: string
  }
  export type Result = void
}
