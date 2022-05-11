import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    login(email: String!, password: String!): Account!
  }

  extend type Mutation {
    signup(
      email: String!
      username: String!
      password: String!
      passwordConfirmation: String!
    ): Boolean!
  }

  type Account {
    accessToken: String!
  }
`
