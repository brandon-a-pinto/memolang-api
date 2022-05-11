import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    loadAll: [Deck!] @auth
  }

  type Deck {
    id: ID!
    title: String!
    language: String!
    ownerId: ID!
    flashcards: [Flashcard!]
  }

  type Flashcard {
    front: Front!
    back: Back!
  }

  type Front {
    content: String!
    howToRead: String
  }

  type Back {
    content: String!
    glossary: Glossary
  }

  type Glossary {
    words: [String!]!
    meanings: [String!]!
  }
`
