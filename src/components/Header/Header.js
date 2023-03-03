import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

import './Header.css';


function Header({ loggedIn }) {

  const [openSlaider, setSlaider] = useState(false);

  const navigation = useNavigate();

  function handleAccountBtn() {
    navigation('/profile');
  }

  return (
    <section className={`header header_color`}>
      <div className='header__container'>
        <NavLink to='/'>
          <div className='header__logo'></div>
        </NavLink>
      </div>
    </section>
  );
}

export default Header;