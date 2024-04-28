import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { firestore } from '../../firebase';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, query, where,addDoc, getDocs,setDoc, doc, onSnapshot,getDoc  } from 'firebase/firestore'; 
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

const Favorites = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  const { user } = useUserAuth();
  // console.log(user.uid);
  
  // const userid = user.uid;
  useEffect(() => {
  const fetchFavoriteBooks = async () => {
    try {
      const favoritesRef = collection(firestore, 'favorites');
      const querySnapshot = await getDocs(query(favoritesRef, where('uid', '==', user.uid)));

      if (!querySnapshot.empty) {
        const favoriteBooksData = querySnapshot.docs[0].data().bookId;
        const booksData = [];
        
        for (const bookId of favoriteBooksData) {
          const bookDocRef = doc(firestore, 'books', bookId);
          const bookDocSnapshot = await getDoc(bookDocRef);
          
          if (bookDocSnapshot.exists()) {
            const bookData = bookDocSnapshot.data();
            booksData.push(bookData);
          }
        }
        
        setFavoriteBooks(booksData);
  
      }
    } catch (error) {
      console.error('Error fetching favorite books:', error);
    }
  };

  if (user) {
    fetchFavoriteBooks();
  }
}, [user]);

console.log(favoriteBooks)
  const handleBookClick = (book) => {
    setSelectedBook(book);
    navigate(`/bookdetails/${book.id}`, { state: book });
    console.log(selectedBook)
  };

  // useEffect(() => {
  //   console.log(selectedBook);
  // }, [selectedBook]);

  return (
    <div>
      <Navbar />
      


      <MDBRow className="g-0">
        <h1>รายการโปรด</h1>
      </MDBRow>
            <MDBRow className='g-0'>
            {favoriteBooks.map((book) => (
            <MDBCol className="g-4" md="6" sm="12" xl="3" key={book.bookId} onClick={() => handleBookClick(book)}>
              <MDBCard className='h-100'>
                <MDBCardImage
                  src={book.cover}
                  alt='Book Cover'
                  position='top'
                  className='img-fluid img-small'
                  // style={{ width: '50%', height: 'auto' }}
                />
                <MDBCardBody>
                  <MDBCardTitle>{book.title[0]}</MDBCardTitle>
                  <MDBCardText>{book.title[1]}</MDBCardText>
                </MDBCardBody>
                <MDBCardFooter>
                <small className=''>{book.genre[1]}, {book.moral[1]}</small>
              </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          ))}
          </MDBRow>
    
    </div>
  );
};


export default Favorites;