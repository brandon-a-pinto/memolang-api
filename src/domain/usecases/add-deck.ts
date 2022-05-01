export interface AddDeck {
  add: (params: AddDeck.Params) => Promise<AddDeck.Result>
}

export namespace AddDeck {
  export type Params = {
    title: string
    language: string
  }
  export type Result = void
}
