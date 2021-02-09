// Require GraphQL from Apollo Server
const { gql } = require('apollo-server-express');

// Define typeDefs
const typeDefs = gql `
type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
}

type Auth {
    token: ID!
    user: User
}

input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String! password: String)
}
`