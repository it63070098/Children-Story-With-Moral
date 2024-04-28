import styles from '../BookFav/BookFav.module.css';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import BookModal from '../BookModal/BookModal';
import { useLocation } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, query, where,addDoc, getDocs,setDoc, doc, onSnapshot  } from 'firebase/firestore'; 
import { useUserAuth } from '../../context/UserAuthContext'

const BookFav = () => {
  const { state } = useLocation();
  const {book} = state;
  // console.log(state)
  const { user } = useUserAuth();
  // console.log(user.uid);
  const userid = user.uid;
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bookContent, setBookContent] = useState([]);
  const [isBookInFavorites, setIsBookInFavorites] = useState(false);

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        const contentQuery = query(collection(firestore, `books/${state.id}/content`));
        const contentSnapshot = await getDocs(contentQuery);
        const contentData = contentSnapshot.docs.map(doc => doc.data());
        setBookContent(contentData);
      } catch (error) {
        console.error('Error fetching book content:', error);
      }
    };
    
    fetchBookContent();
  }, [state.id]);
  // console.log(state.id)
  const bookId = state.id;
 
  useEffect(() => {
    const checkBookInFavorites = async () => {
      try {
        const favoritesRef = collection(firestore, 'favorites');
        const querySnapshot = await getDocs(query(favoritesRef, where('uid', '==', userid)));
  
        if (!querySnapshot.empty) {
          const documentData = querySnapshot.docs[0].data();
          setIsBookInFavorites(documentData.bookId.includes(bookId));
  
       
          const unsubscribe = onSnapshot(doc(favoritesRef, querySnapshot.docs[0].id), (doc) => {
            const newData = doc.data();
            setIsBookInFavorites(newData.bookId.includes(bookId));
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error checking book in favorites:', error);
      }
    };
  
    checkBookInFavorites();
  }, [bookId, userid]);

  const handleAddToFavorites = (bookId, uid) => {
    // เรียกฟังก์ชันเพิ่มหนังสือลงในรายการโปรด
    addToFavorites(bookId, uid);
  };


  const handleAddToFavoriteClick = () => {
    const uid = userid; 
    handleAddToFavorites(bookId, uid);
  };
  const addToFavorites = async (bookId, uid) => {
    try {
      const favoritesRef = collection(firestore, 'favorites');
      const querySnapshot = await getDocs(query(favoritesRef, where('uid', '==', uid)));
      
      if (querySnapshot.empty) {
        await addDoc(collection(firestore, `favorites`), {
          uid:uid,
          bookId: [bookId]
        });
        console.log('added to favorites successfully!');
    } else {
      const docRef = querySnapshot.docs[0].ref;
            const documentData = querySnapshot.docs[0].data();
            
            if (!documentData.bookId.includes(bookId)) {
                documentData.bookId.push(bookId);
                await setDoc(docRef, { bookId: documentData.bookId }, { merge: true });
                console.log('Document updated in favorites successfully!');
            } else {
                const updatedBookIds = documentData.bookId.filter(id => id !== bookId);
                await setDoc(docRef, { bookId: updatedBookIds }, { merge: true });
                console.log('Book removed from favorites successfully!');
            }
    }
      
    } catch (error) {
      console.error('Error adding book to favorites:', error);
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
    setCurrentPage(0);
  };
  const handleModalClose = () => setShowModal(false);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, bookContent.length - 1));
  };
  

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const isHomePage = currentPage === 0;

  const [message, setMessage] = useState('');

   const sendSuggestion = async () => {
    try {
        await addDoc(collection(firestore, `books/${bookId}/feedback`), {
        message,
        userId: userid, 
        timestamp: new Date(), 
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending suggestion:', error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className={styles.bookDetails}>
        <div className={styles.leftSide}>
          <img className={styles.bookImage} src={state.cover} alt="Book Image" />
          <div className='d-flex justify-content-center align-items-center'>
            <button type="button" className="btn btn-info" onClick={handleModalOpen}>
                    <i className=""></i>&nbsp;เริ่มอ่านเลย!
            </button>
          </div>
        </div>
        <div className={`${styles.rightSide}`}>
          <h2>{state.title[0]}</h2>
          <h3>{state.title[1]}</h3>
          <div className='card p-3 mt-5 mb-3'>
            <div class="card-body">
                <p class="card-text">{state.synopsis}</p>
            </div>
          </div>
          <div className='d-flex justify-content-center align-items-center '>
                  {isBookInFavorites ? (
                    <button type="button" className="btn btn-outline-info" onClick={handleAddToFavoriteClick}>
                      <i className="fa-solid fa-heart"></i>&nbsp;ลบออกจากรายการโปรด
                    </button>
                  ) : (
                    <button type="button" className="btn btn-outline-info" onClick={handleAddToFavoriteClick}>
                      <i className="fa-regular fa-heart"></i>&nbsp;เพิ่มไปยังรายการโปรด
                    </button>
                )}
          </div>
          
          <hr></hr>
          
          <p>tags</p>
          <p class="badge rounded-pill bg-light text-black-50">{state.age_range}</p>
          <p class="badge rounded-pill bg-light text-black-50">{state.moral[1]}</p>
          <p class="badge rounded-pill bg-light text-black-50">{state.genre[1]}</p>
          <p class="mt-3">ข้อเสนอแนะ</p>
          <div class="input-group input-group-sm mb-3">
              <input
              type="text"
              className="form-control"
              placeholder="เขียนข้อเสนอแนะ"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={sendSuggestion}>ส่ง</button>
          </div>
        </div>
        
      </div>

      <BookModal
        showModal={showModal}
        handleModalClose={handleModalClose}
        handleModalOpen={handleModalOpen}
        currentPage={currentPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        bookContent={bookContent}
      />
      

    </div>
  );
};

export default BookFav;
