import gql from 'graphql-tag';

// Export QUERY_ME tag
export const QUERY_ME = gql `
{
    me {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            image
            description
            title
            link
        }
    }
}`
