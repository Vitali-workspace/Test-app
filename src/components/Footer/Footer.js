import './Footer.css';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__container'>
        <p className='footer__text'>Учебный проект Яндекс.Практикум х BeatFilm.</p>
        <div className='footer__nav'>
          <p className='footer__copyright'> {new Date().getFullYear()} </p>
          <ul className='footer__list'>
            <li><a className='footer__link' href='https://practicum.yandex.ru/'>Яндекс.Практикум</a></li>
            <li><a className='footer__link' href='https://github.com/Vitali-workspace'>Github</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
