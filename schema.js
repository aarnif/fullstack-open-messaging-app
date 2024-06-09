const typeDefs = `
  scalar Date
  type User {
    id: ID!
    username: String!
    name: String
    about: String
    profilePicture: String
    status: String!
    createdAt: Date!
  }
  type Query {
    allUsers: [User!]!
  }
`;

export default typeDefs;
