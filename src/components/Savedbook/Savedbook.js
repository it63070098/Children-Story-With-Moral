import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { firestore } from '../../firebase';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";

const Savedbook = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const q = query(collection(firestore, 'saved'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const books = [];
        querySnapshot.forEach((doc) => {
          const book = doc.data();
          book.id = doc.id;
          books.push(book);
        });
        setFavoriteBooks(books);
      } catch (error) {
        console.error('Error fetching favorite books: ', error);
      }
    };

    if (user) {
      fetchFavoriteBooks();
    }
  }, [user]);
  
  const handleBookClick = (book) => {
    setSelectedBook(book);
    console.log(selectedBook)
    navigate(`/bookdetail/${book.id}`, { state: book });
  };

  return (
    <div>
      <Navbar />
      <MDBRow className="g-0">
        <h1>นิทานของฉัน</h1>
      </MDBRow>
      <MDBRow className='g-0'>
      {favoriteBooks.map((book) => (
          <MDBCol className="g-4" md="6" sm="12" xl="3" key={book.id}  onClick={() => handleBookClick(book)}>
            <MDBCard className="h-100">
              <MDBCardImage className='img-fluid img-small' src={book.coverImageUrl} alt='book cover' position='top' />
              <MDBCardBody>
                  <MDBCardTitle>{book.title}</MDBCardTitle>
                  <MDBCardText>{book.title_thai}</MDBCardText>
                <MDBCardFooter>
                  
                </MDBCardFooter>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
          </MDBRow>
    </div>
  );
};


export default Savedbook;