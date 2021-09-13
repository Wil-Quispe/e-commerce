import { GraphQLClient } from 'graphql-request'

export const fetchGraphQlQuery = async (query, variables) => {
  const graphems = new GraphQLClient('https://e-back.vercel.app/')
  return await graphems.request(query, variables)
}
