import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import { Link } from 'react-router-dom'
import Register from "./components/Register/Register.jsx";
import BookDetails from "./components/BookFav/BookFav.js"; 
import Savedbook from './components/Savedbook/Savedbook.js';
import BookDetail from './components/BookDetail/ิBookDetail.js';
import AdminPage from './components/AdminPage/AdminPage.js';
import Favorites from './components/Favorites/Favorites.js';
import MyBook from './components/MyBook/MyBook.js'
import Profile from './components/Profile/Profile.js';
function App() {

  return (
    <>
      <div className='App'>
          <Routes>
            <Route path="/adminpage" element={<AdminPage />} />
            <Route path="/savedbook" element={<Savedbook />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/mybook" element={<MyBook />} /> 
            <Route path="/bookdetails/:id" element={<BookDetails />} /> 
            <Route path="/bookdetail/:id" element={<BookDetail />} /> 
            <Route path="*" element={
              <>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                  <div className="container">
                    <Link className="" to={'/sign-in'}>
                      <img className='nav-img' src="" alt="Logo" />
                    </Link>
                  </div>
                </nav>
                <Register />
              </>
            } />
          </Routes>
      </div>
    </>
  )
}

export default App
