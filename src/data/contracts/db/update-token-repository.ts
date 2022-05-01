export interface UpdateTokenRepository {
  updateToken: (
    id: string,
    token: string
  ) => Promise<UpdateTokenRepository.Result>
}

export namespace UpdateTokenRepository {
  export type Result = void
}
