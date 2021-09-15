import { GraphQLClient } from 'graphql-request'

export const fetchGraphQlQuery = async (query, variables) => {
  const graphems = new GraphQLClient(process.env.URI)
  return await graphems.request(query, variables)
}
