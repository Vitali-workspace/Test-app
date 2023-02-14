import { useEffect, useState, useContext } from 'react';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import useFormValidator from '../../hooks/useFormValidator';
import './Profile.css';


function Profile({ onSubmitProfile, onLogout, userInfo, errorEmail }) {

  const [editProfile, setEditProfile] = useState(false);
  const [isSuccessMessage, setSuccessMessage] = useState('');

  const { isErrors, isValues, isValid, handleChangeInput, setIsValid } = useFormValidator();
  const user = useContext(CurrentUserContext);

  useEffect(() => {
    isValues.name = user.name;
    isValues.email = user.email;
  }, []);

  useEffect(() => {
    if (user.name === isValues.name && user.email === isValues.email) {
      setIsValid(false);
    }
  }, [setIsValid, isValues, user]);

  function handleEditOn() { setEditProfile(true) }
  function handleEditOff() { setEditProfile(false) }


  function submitForm(evt) {
    if (isValid) {
      evt.preventDefault();
      onSubmitProfile({
        'name': isValues.name,
        'email': isValues.email
      });

      if (errorEmail) {
        setSuccessMessage('Эта почта была уже занята');

      } else {
        setSuccessMessage('Данные пользователя обновлены');
        handleEditOff();
      }

      // время отчистки сообщения
      setTimeout(() => { setSuccessMessage('') }, 6000);
    }

  }

  return (
    <section className='profile'>
      <div className='profile__container'>
        <form className='profile__form' onSubmit={isValid ? submitForm : undefined} name='profile-form'>
          <h1 className='profile__title'>Привет, {userInfo.name}!</h1>

          <fieldset className='profile__fieldset'>
            <p className='profile__text-input'>Имя</p>
            <input
              className='profile__input'
              type='text'
              name='name'
              value={isValues.name || ''}
              placeholder={userInfo.name}
              onChange={handleChangeInput}
              required
              minLength={3}
              pattern='^[A-Za-zА-Яа-яЁё /s -]+$'
              disabled={editProfile ? false : true}
            />

            <p className='profile__text-input profile__text-input_position'>E-mail</p>
            <input
              className='profile__input profile__input-email'
              type='email'
              name='email'
              value={isValues.email || ''}
              placeholder={userInfo.email}
              onChange={handleChangeInput}
              required
              pattern='[^@\s]+@[^@\s]+\.[^@\s]+'
              disabled={editProfile ? false : true}
            />
            <span className='profile__error'>
              {isErrors.email || isErrors.name
                ? 'Некорректные данные, поля должны отличаться от исходных. Имя не должно содержать цифр и быть короче 3 символов.'
                : ''}
            </span>
          </fieldset>

          <p className={errorEmail ? 'profile__message profile__message-email' : 'profile__message'}>{isSuccessMessage}</p>

          {editProfile ? (
            <button
              className='profile__button profile__button-edit'
              type='submit'
              disabled={isValid ? false : true}
            >Сохранить</button>
          ) : (
            <button
              className='profile__button profile__button-edit'
              type='button'
              onClick={handleEditOn}
            >Редактировать</button>
          )}

        </form>

        <button
          className='profile__button profile__button-logout'
          type='button'
          onClick={onLogout}
        >Выйти из аккаунта</button>
      </div>
    </section>
  );
}

export default Profile;