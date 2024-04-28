import styles from "./ShowAllBooks.module.css";
import { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import { collection, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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

const ShowAllBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(collection(firestore, "books"));
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    
    fetchBooks();
  }, []);
  // console.log(books);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    navigate(`/bookdetails/${book.id}`, { state: book });
  };

  useEffect(() => {
    console.log(selectedBook);
  }, [selectedBook]);
  



  return (
    <div className={`${styles.featuresWrapperr}`}>
      <MDBCol className="gy-5 g-0">
      <MDBRow className='g-0'>
      <MDBCol className="gy-5">
      <MDBRow className="g-0">
        <h2>วัยก่อนอนุบาล</h2>
      </MDBRow>
            <MDBRow className="g-0">
            {books.filter(book => book.age_range === "ก่อนอนุบาล").slice(0, 4).map((book) => (
            <MDBCol className="g-4" md="6" sm="12" xl="3" key={book.id} onClick={() => handleBookClick(book)}>
              <MDBCard style={{ background: '#EAFFE0' }} className='h-100'>
                <MDBCardImage
                  src={book.cover}
                  alt='Book Cover'
                  position='top'
                  className='img-fluid img-small'
                />
                <MDBCardBody>
                  <MDBCardTitle>{book.title[0]}</MDBCardTitle>
                  <MDBCardText>{book.title[1]}</MDBCardText>
                </MDBCardBody>
                <MDBCardFooter>
                <small>{book.genre[1]}, {book.moral[1]}</small>
              </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          ))}
          </MDBRow>
          </MDBCol>
      </MDBRow>
    
    
      
    <MDBRow className='g-0'>
          <MDBCol className="gy-5">
      <MDBRow className="g-0" >
      <h2>วัยอนุบาล</h2>
      </MDBRow>  
      <MDBRow className="g-0">
            {books.filter(book => book.age_range === "อนุบาล").slice(0, 4).map((book) => (
            <MDBCol className="g-4" md="6" sm="12" xl="3" key={book.id} onClick={() => handleBookClick(book)}>
              <MDBCard style={{ background: '#FEF2FF' }} className='h-100'>
                <MDBCardImage
                  src={book.cover}
                  alt='Book Cover'
                  position='top'
                  className='img-fluid img-small'
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
          </MDBCol>
      </MDBRow>
      
      
    <MDBRow className='g-0'>
    <MDBCol className="gy-5">
      <MDBRow className="g-0">
        <h2>วัยประถม</h2>
      </MDBRow>
      <MDBRow className="g-0">
            {books.filter(book => book.age_range === "ประถม").slice(0, 4).map((book) => (
            <MDBCol className="g-4" md="6" sm="12" xl="3" key={book.id} onClick={() => handleBookClick(book)}>
              <MDBCard style={{background:'#FFE9E9'}} className='h-100'>
                <MDBCardImage
                  src={book.cover}
                  alt='Book Cover'
                  position='top'
                  className='img-fluid img-small'
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
          </MDBCol>
      </MDBRow>
      </MDBCol>
      
    </div>
  );
};

export default ShowAllBooks;
