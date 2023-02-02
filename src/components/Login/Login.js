import { Link, NavLink } from 'react-router-dom';

import useFormValidator from '../../hooks/useFormValidator';

import './Login.css';


function Login({ onLogin }) {

  const { isErrors, isValues, isValid, handleChangeInput } = useFormValidator();

  function submitForm(evt) {
    if (isValid) {
      evt.preventDefault();
      onLogin({
        'email': isValues.email,
        'password': isValues.password,
      });
    }
  }

  return (
    <section className='login'>
      <form className='login__container' onSubmit={submitForm}>
        <NavLink to='/'>
          <div className='login__logo'></div>
        </NavLink>
        <h1 className='login__title'>Рады видеть!</h1>
        <fieldset className='login__fieldset'>
          <p className='login__text-input'>E-mail</p>
          <input
            className='login__input'
            type='email'
            name='email'
            value={isValues.email || ''}
            onChange={handleChangeInput}
            required
          />
          <span className='login__error'>{isErrors.email ? 'Некорректный email' : ''}</span>

          <p className='login__text-input'>Пароль</p>
          <input
            className='login__input'
            type='password'
            name='password'
            value={isValues.password || ''}
            onChange={handleChangeInput}
            required
            minLength={5}
          />
          <span className='login__error login__error_position'>
            {isErrors.password ? 'Некорректный пароль' : ''}
          </span>
        </fieldset>

        <button className='login__button' type='submit' disabled={isValid ? false : true}>Войти</button>
        <p className='login__text'>
          Ещё не зарегистрированы?
          <Link className='login__link' to='/signup'> Регистрация</Link>
        </p>

      </form>

    </section>
  );
}

export default Login;