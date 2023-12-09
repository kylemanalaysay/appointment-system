import React, { useRef, useEffect, useContext } from 'react'
import { Container, Row, Button } from 'reactstrap'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import logo from '../../assets/images/logo.jpg'
import './header.css'

const nav__links = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/services',
    display: 'Services'
  },
  {
    path: '/contact',
    display: 'Contact'
  },

];

const Header = () => {

  const headerRef = useRef(null)
  const { existingUser, dispatch } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const profilePath = existingUser?.isAdmin ? '/admin/profile/me' : '/users/profile/me';

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.bodyscrolltop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header')
      } else {
        headerRef.current.classList.remove('sticky__header')
      }
    })
  }

  useEffect(() => {
    stickyHeaderFunc()
    return window.removeEventListener('scroll', stickyHeaderFunc)
  })

  return (

    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-item-center justify-content-between">
            {/* ================== logo ==================*/}
            <div className='logo'>
              <img src={logo} alt="" />
            </div>
            {/* ================== logo end ==================*/}

            {/* ================== menu start ==================*/}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {
                  nav__links.map((item, index) => (
                    <li className="nav__item" key={index}>
                      <NavLink to={item.path} className={navClass =>
                        navClass.isActive ? "active__link" : ""}
                      >
                        {item.display}</NavLink>
                    </li>
                  ))
                }
              </ul>
            </div>
            {/* ================== menu end ==================*/}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {existingUser ? (
                  <>
                    <Button className="btn secondary__btn btn-text" onClick={() => navigate(profilePath)}>
                      {existingUser.firstName}
                    </Button>
                    <Button className="btn secondary__btn btn-text" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to='/login' className="btn-text">Login</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to='/register' className="btn-text">Register</Link>
                    </Button>
                  </>
                )}
              </div>

              <span className='mobile__menu'>
                <i class="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
}

export default Header
