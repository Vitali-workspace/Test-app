import './Footer.css';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__nav'>
          <ul className='footer__list'>
            <li><a className='footer__link' href='#'>Практикум</a></li>
            <li><a className='footer__link' href='#'>Github</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
