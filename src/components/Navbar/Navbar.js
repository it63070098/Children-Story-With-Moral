import React, { useState, useEffect } from 'react';
import logo from "../../image/logo.svg"
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext'

export default function App() {
  const [openNavText, setOpenNavText] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
    const handleLogout = async () => {
      try {
          await logOut();
          navigate('/');
      } catch(err) {
          console.log(err.message);
      }
    }

  return (
    <MDBNavbar sticky expand='md' light style={{ backgroundColor: '#82D7D2' }}>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/home'>
          <img
            src={logo}
            height='30'
            alt=''
            loading='lazy'
          />
        </MDBNavbarBrand>
        <MDBNavbarToggler
          type='button'
          data-target='#navbarText'
          aria-controls='navbarText'
          aria-expanded={openNavText}
          aria-label='Toggle navigation'
          onClick={() => setOpenNavText(!openNavText)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNavText}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink href='/home'>
                หน้าหลัก
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/savedbook'>นิทานของฉัน</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/favorites'>รายการโปรด</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
          {!isSmallScreen && (
            <MDBDropdown>
              <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                บัญชีผู้ใช้
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link href='/profile'>บัญชีผู้ใช้</MDBDropdownItem>
                <MDBDropdownItem link onClick={handleLogout}>ออกจากระบบ</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          )}
          {isSmallScreen && (
            <MDBNavbarNav>
              <MDBNavbarItem>
                <MDBNavbarLink href='/profile'>บัญชีผู้ใช้</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href='#'>ออกจากระบบ</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          )}
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
