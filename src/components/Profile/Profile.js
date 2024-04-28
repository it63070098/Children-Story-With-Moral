import Navbar from '../Navbar/Navbar';
import { firestore } from '../../firebase';
import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom'
// import { collection, query, where,addDoc, getDocs,setDoc, doc, onSnapshot,getDoc  } from 'firebase/firestore';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBContainer
} from 'mdb-react-ui-kit';

const Profile = () => {
  const { logOut} = useUserAuth();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  // console.log(user.email);
  const handleLogout = async () => {
    try {
        await logOut();
        navigate('/');
    } catch(err) {
        console.log(err.message);
    }
  }
  return (
    <div> 
      <Navbar />
      <MDBContainer className="p-4">
        <MDBRow className='d-flex justify-content-center g-0'>
        <MDBCol sm='10'>
          <MDBCard>
          <MDBCardHeader tag='h3'>บัญชีผู้ใช้</MDBCardHeader>

            <MDBCardBody>
              <MDBCardText>
                <p>อีเมล: {user.email}</p>
              </MDBCardText>
              <MDBBtn color='danger' onClick={handleLogout}>ออกจากระบบ</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        </MDBRow>
    </MDBContainer>  
    
    </div>
  );
};


export default Profile;