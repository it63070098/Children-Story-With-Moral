import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../../image/logo.svg"
import { Modal, Button,Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext';
import styles from "./AdminPage.module.css"
import { firestore } from '../../firebase';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminPage = () => {
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");
    const { logOut} = useUserAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(firestore, "users");
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedSynopsis, setUpdatedSynopsis] = useState("");
    const [content, setContent] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackData, setFeedbackData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [titles, setTitles] = useState(['', '']);
    const [ageRange2, setAgeRange2] = useState('');
    const [cover, setCover] = useState('');
    const [genres, setGenres] = useState(['', '']);
    const [morals, setMorals] = useState(['', '']);
    const [synopsis2, setSynopsis2] = useState('');
    const handleAddBook = async () => {
        try {
          const bookData = {
            title: titles,
            age_range: ageRange2,
            cover: cover,
            genre: genres,
            moral: morals,
            synopsis: synopsis2
          };
      
          const docRef = await addDoc(collection(firestore, 'books'), bookData);
          console.log('Document written with ID: ', docRef.id);
      
          setShowAddModal(false);
          setTitles(['', '']);
          setAgeRange2('');
          setCover('');
          setGenres(['', '']);
          setMorals(['', '']);
          setSynopsis2('');
          
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
        } catch(err) {
            console.log(err.message);
        }
      }

      const [books, setBooks] = useState([]);

      useEffect(() => {
        const fetchBooks = async () => {
          try {
            const querySnapshot = await getDocs(collection(firestore, 'books'));
            const booksData = [];
            querySnapshot.forEach(doc => {
              booksData.push({ id: doc.id, ...doc.data() });
            });
            setBooks(booksData);
          } catch (error) {
            console.error('Error fetching books:', error);
          }
        };
    
        fetchBooks();
      }, []);
    //   console.log(books)

      useEffect(() => {
        if (selectedBook) {
            const bookRef = doc(firestore, 'books', selectedBook.id);
            const contentRef = collection(bookRef, 'content');
            getDocs(contentRef).then((querySnapshot) => {
                const contentData = [];
                querySnapshot.forEach((doc) => {
                    contentData.push(doc.data());
                });
                setContent(contentData);
            }).catch((error) => {
                console.error('Error getting documents: ', error);
            });
        }
    }, [selectedBook]);
    console.log(content)
      
      const handleSave = async (updatedBookData) => {
        try {
          const { id, title, age_range, moral, synopsis, genre } = updatedBookData;
          const bookRef = doc(firestore, 'books', id);
          const updateData = {};
      
          // ตรวจสอบและเพิ่มข้อมูลที่ไม่ใช่ค่าว่าง
          if (title[0] !== "" && title[1] !== "") {
            updateData.title = title;
          }
          if (age_range !== "") {
            updateData.age_range = age_range;
          }
          if (moral[0] !== "" && moral[1] !== "") {
            updateData.moral = moral;
          }
          if (synopsis !== "") {
            updateData.synopsis = synopsis;
          }
          if (genre[0] !== "" && genre[1] !== "") {
            updateData.genre = genre;
          }
      
          // อัปเดตเฉพาะข้อมูลที่ไม่เป็นค่าว่าง
          await updateDoc(bookRef, updateData);
          console.log('Book updated successfully!');
          handleCloseModal();
        } catch (error) {
          console.error('Error updating book:', error);
        }
      };
      const handleFormSubmit = () => {
        handleSave({
          id: selectedBook.id,
          title: [titleEn, titleTh],
          age_range: ageRange,
          moral: [moralEn, moralTh],
          synopsis: synopsis,
          genre: [genreEn, genreTh]
        });
      };
        const handleUpdateModal = (book) => {
            setSelectedBook(book);
            setShowModal(true);
        };

        const handleCloseModal = () => {
            setSelectedBook(null);
            setShowModal(false);
            setTitleEn("");
            setTitleTh("");
            setAgeRange("");
            setMoralEn("");
            setMoralTh("");
            setSynopsis("");
            setGenreEn("");
            setGenreTh("");
            
        };

        const handleUpdate = () => {
            handleCloseModal();
        };
        const handleDelete = async (bookId) => {
            try {
              const bookRef = doc(firestore, 'books', bookId);
              // ลบหนังสือ
              await deleteDoc(bookRef);
              console.log('Document successfully deleted!');
              window.location.reload();
            } catch (error) {
              console.error('Error removing document: ', error);
            }
          };
        console.log(selectedBook)
        const [titleEn, setTitleEn] = useState(selectedBook ? selectedBook.title[0] : "");
        const [titleTh, setTitleTh] = useState(selectedBook ? selectedBook.title[1] : "");
        const [ageRange, setAgeRange] = useState(selectedBook ? selectedBook.age_range : "");
        const [moralEn, setMoralEn] = useState(selectedBook ? selectedBook.moral[0] : "");
        const [moralTh, setMoralTh] = useState(selectedBook ? selectedBook.moral[1] : "");
        const [synopsis, setSynopsis] = useState(selectedBook ? selectedBook.synopsis : "");
        const [genreEn, setGenreEn] = useState(selectedBook ? selectedBook.genre[0] : "");
        const [genreTh, setGenreTh] = useState(selectedBook ? selectedBook.genre[1] : "");
        
        const handleContentChange = (e, index, field) => {
            const updatedContent = [...content];
            updatedContent[index][field] = e.target.value;
            setContent(updatedContent);
        };
        
        const handlePageSubmit = (e, index) => {
            e.preventDefault();
            console.log(`Save content of page ${index + 1}`);
        };
        
        const handleViewFeedback = async (bookId) => {
            try {
              const bookDocRef = doc(firestore, 'books', bookId);
              const feedbackCollectionRef = collection(bookDocRef, 'feedback');
              const querySnapshot = await getDocs(feedbackCollectionRef);
              const feedbackData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setFeedbackData(feedbackData);
              setShowFeedbackModal(true); 
            } catch (error) {
              console.error('Error getting feedback:', error);
            }
          };
          console.log(feedbackData)

          const handleViewFeedback2 = async (bookId) => {
        try {
            const bookDocRef = doc(firestore, 'saved', bookId);
            const bookSnapshot = await getDoc(bookDocRef);
            if (bookSnapshot.exists()) {
                const bookData = bookSnapshot.data();
                const feedbackCollectionRef = collection(bookDocRef, 'feedback');
                const querySnapshot = await getDocs(feedbackCollectionRef);
                if (!querySnapshot.empty) { // เช็คว่ามีข้อมูล Feedback หรือไม่
                    const feedbackData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setFeedbackData(feedbackData);
                    setShowFeedbackModal(true);
                } else {
                    console.log("No feedback available for this book.");
                }
            } else {
                console.log("No such book exists!");
            }
    } catch (error) {
        console.error('Error getting feedback:', error);
    }
};

    return (
      <div className="App">
        <nav className={`${styles.navbarWrapper} center`}>
        <div className={`${styles.navbarInner} center`}>
          <div className={`${styles.navRight} center`}>
              <img src={logo} alt="logo" className={styles.brand} />
              <button className={styles.signup} onClick={handleLogout}>
                ออกจากระบบ
                  </button>
          </div>
        </div>
      </nav>

        <button type="button" class="btn btn-info m-4" onClick={() => setShowAddModal(true)}>Add</button>
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>Actions</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title[0]}</td>
              
              <td>
                <button class="btn btn-warning m-2" onClick={() => handleUpdateModal(book)}>Update</button>
                <button type="button" class="btn btn-danger"onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
              <td>
                    <button className="btn btn-info" variant="primary" onClick={() => handleViewFeedback(book.id)}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>

                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="xl">
                <Modal.Header closeButton>
                <Modal.Title>Add New Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                <Form.Group controlId="titleEng">
                        <Form.Label>Title(Eng)</Form.Label>
                        <Form.Control
                        type="text"
                        value={titles[0]}
                        onChange={(e) => setTitles([e.target.value, titles[1]])}
                        />
                    </Form.Group>
                    <Form.Group controlId="titleThai">
                        <Form.Label>Title(Thai)</Form.Label>
                        <Form.Control
                        type="text"
                        value={titles[1]}
                        onChange={(e) => setTitles([titles[0], e.target.value])}
                        />
                    </Form.Group>
                    <Form.Group controlId="ageRange2">
                        <Form.Label>Age Range</Form.Label>
                        <Form.Control
                        type="text"
                        value={ageRange2}
                        onChange={(e) => setAgeRange2(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="cover">
                        <Form.Label>Cover</Form.Label>
                        <Form.Control
                        type="text"
                        value={cover}
                        onChange={(e) => setCover(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="genreEng">
                        <Form.Label>Genre(Eng)</Form.Label>
                        <Form.Control
                        type="text"
                        value={genres[0]}
                        onChange={(e) => setGenres([e.target.value, genres[1]])}
                        />
                    </Form.Group>
                    <Form.Group controlId="genreThai">
                        <Form.Label>Genre(Thai)</Form.Label>
                        <Form.Control
                        type="text"
                        value={genres[1]}
                        onChange={(e) => setGenres([genres[0], e.target.value])}
                        />
                    </Form.Group>
                    <Form.Group controlId="moralEng">
                        <Form.Label>Moral(Eng)</Form.Label>
                        <Form.Control
                        type="text"
                        value={morals[0]}
                        onChange={(e) => setMorals([e.target.value, morals[1]])}
                        />
                    </Form.Group>
                    <Form.Group controlId="moralThai">
                        <Form.Label>Moral(Thai)</Form.Label>
                        <Form.Control
                        type="text"
                        value={morals[1]}
                        onChange={(e) => setMorals([morals[0], e.target.value])}
                        />
                    </Form.Group>
                    <Form.Group controlId="synopsis2">
                        <Form.Label>Synopsis</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows={3}
                        value={synopsis2}
                        onChange={(e) => setSynopsis2(e.target.value)}
                        />
                    </Form.Group>
                    {[...Array(10)].map((_, index) => (
                    <Form.Group controlId={`Page${index + 1}`} key={index}>
                    <Form.Label><h3>Page {index + 1}</h3></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={synopsis[`synopsis${index + 1}`]}
                    />
                    <div>
                        <label htmlFor={`eng_content_${index}`}>English Content:</label>
                        <textarea class="form-control" rows="3" id={`eng_content_${index}`} />
                    </div>
                    <div>
                        <label htmlFor={`thai_content_${index}`}>Thai Content:</label>
                        <textarea class="form-control" rows="3" id={`thai_content_${index}`}/>
                    </div>
                    <div>
                        <label  htmlFor={`url_${index}`}>URL:</label>
                        <input class="form-control" rows="3" type="text" id={`url_${index}`} />
                    </div>
                    </Form.Group>
                ))}
                    
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleAddBook}>
                    Add Book
                </Button>
                </Modal.Footer>
            </Modal>

         {/* Modal สำหรับแสดง Feedback */}
      <Modal size="xl" show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <table className="table">
                <thead>
                <tr>
                    <th>UserID</th>
                    <th>Message</th>
                </tr>
                </thead>
                <tbody>
                {feedbackData && feedbackData.map((feedback, index) => (
                    <tr key={index}>
                    <td>{feedback.id}</td>
                    <td>{feedback.message}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

          {/* modal แก้ไขข้อมูลหนังสือ */}
        {selectedBook && (
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{selectedBook.title[0]} Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="titleEn">
                    
                    <Form.Label>Title(Eng)<p className="text-black-50 mb-0">{selectedBook.title[0]}</p></Form.Label>
                    <Form.Control
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="titleTh">
                    <Form.Label>Title(Thai)<p className="text-black-50 mb-0">{selectedBook.title[1]}</p> </Form.Label>
                    <Form.Control
                    type="text"
                    value={titleTh}
                    onChange={(e) => setTitleTh(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="ageRange">
                    <Form.Label>Age Range<p className="text-black-50 mb-0">{selectedBook.age_range}</p> </Form.Label>
                    <Form.Control
                    type="text"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="moralEn">
                    <Form.Label>Moral(Eng)<p className="text-black-50 mb-0">{selectedBook.moral[0]}</p> </Form.Label>
                    <Form.Control
                    type="text"
                    value={moralEn}
                    onChange={(e) => setMoralEn(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="moralTh">
                    <Form.Label>Moral(Thai)<p className="text-black-50 mb-0">{selectedBook.moral[1]}</p> </Form.Label>
                    <Form.Control
                    type="text"
                    value={moralTh}
                    onChange={(e) => setMoralTh(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="synopsis">
                    <Form.Label>Synopsis<p className="text-black-50 mb-0">{selectedBook.synopsis}</p> </Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="genreEn">
                    <Form.Label>Genre(Eng)<p className="text-black-50 mb-0">{selectedBook.genre[0]}</p> </Form.Label>
                    <Form.Control
                    type="text"
                    value={genreEn}
                    onChange={(e) => setGenreEn(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="genreTh">
                    <Form.Label>Genre(Thai)<p className="text-black-50 mb-0">{selectedBook.genre[1]}</p> </Form.Label>
                    <Form.Control
                    type="text"
                    value={genreTh}
                    onChange={(e) => setGenreTh(e.target.value)}
                    />
                </Form.Group>
            </Form>
            

        {content && content.map((page, index) => (
            <div key={index}>
                <h2>Page {index + 1}</h2>
                <form onSubmit={(e) => handlePageSubmit(e, index)}>
                    <div>
                        <label htmlFor={`eng_content_${index}`}>English Content:</label>
                        <textarea class="form-control" rows="3" id={`eng_content_${index}`} value={page.eng_content} onChange={(e) => handleContentChange(e, index, 'eng_content')} />
                    </div>
                    <div>
                        <label htmlFor={`thai_content_${index}`}>Thai Content:</label>
                        <textarea class="form-control" rows="3" id={`thai_content_${index}`} value={page.thai_content} onChange={(e) => handleContentChange(e, index, 'thai_content')} />
                    </div>
                    <div>
                        <label  htmlFor={`url_${index}`}>URL:</label>
                        <input class="form-control" rows="3" type="text" id={`url_${index}`} value={page.url} onChange={(e) => handleContentChange(e, index, 'url')} />
                    </div>
                </form>
            </div>
        ))}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Close
                </Button>
                <Button variant="primary" onClick={handleFormSubmit}>
                Save Changes
                </Button>
            </Modal.Footer>
            </Modal>
        )}
      </div>
  );
};


export default AdminPage;