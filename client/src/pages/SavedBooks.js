// import React from react
import React from "react";

// import page elements from react bootstrap
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

// import useQuery and useMutation methods from @apollo/react-hooks
import { useQuery, useMutation } from "@apollo/react-hooks";

// import addtional libraries for book processing
import { REMOVE_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { removeBookId } from "../utils/localStorage";

// import { getMe, deleteBook } from '../utils/API';

// import auth util
import Auth from "../utils/auth";

// import removeBookId
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // delclare new data object and fill it with user info returned from QUERY_ME
  const { loading, data } = useQuery(QUERY_ME);

  // set removeBook = the REMOVE_BOOK mutation
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // prevent rendering before 'data' exists
  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
