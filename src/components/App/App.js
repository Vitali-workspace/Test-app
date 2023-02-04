import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../../context/CurrentUserContext';

import './App.css';
import ProtectedRoute from '../Movies/ProtectedRoute/ProtectedRoute';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import Login from '../Login/Login';
import PageNotFoundError from '../PageNotFoundError/PageNotFoundError';
import Profile from '../Profile/Profile';
import Promo from '../Promo/Promo';
import AboutMe from '../Main/AboutMe/AboutMe';
import AboutProject from '../Main/AboutProject/AboutProject';
import Portfolio from '../Main/Portfolio/Portfolio';
import Techs from '../Main/Techs/Techs';
import Movies from '../Movies/Movies';
import Preloader from '../Movies/Preloader/Preloader';
import SavedMovies from '../Movies/SaveMovies/SavedMovies';
import requestMainApi from '../../utils/MainApi';


function App() {

  const [isAuthorized, setAuthorized] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState({});
  const [savedMovies, setSavedMovies] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isEnablePreloader, setEnablePreloader] = useState(false);

  const navigation = useNavigate();
  const token = localStorage.getItem('jwt');


  // эффект для авторизации
  useEffect(() => {
    if (token) {
      requestMainApi.getUserInfo(token)
        .then((userInfo) => {
          setAuthorized(true);
          setCurrentUser(userInfo);
        })
        .catch((err) => {
          console.log(`ошибка в авторизации: ${err}`);
        });
    }
  }, [isAuthorized, token])

  // получение фильмов пользователя при авторизации
  useEffect(() => {
    if (isAuthorized) {
      requestMainApi.getUserMovies(token)
        .then((userMoviesInfo) => {
          setSavedMovies(userMoviesInfo);
          setIsError(false);
        })
        .catch((err) => {
          setIsError(true);
          console.log(`ошибка в авторизации: ${err}`);
        })
    }
  }, [isAuthorized, token]);


  function handleRegistration(userInfo) {
    requestMainApi.registration(userInfo)
      .then(() => {
        handleLogin(userInfo);
      })
      .catch((err) => {
        console.log(`ошибка при регистрации: ${err}`);
      })
  }


  function handleLogin(userInfo) {
    requestMainApi.login(userInfo)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          setAuthorized(true);
          navigation('/movies');
        }
      })
      .catch((err) => {
        console.log(`ошибка при авторизации: ${err}`);
      });
  }


  function handleSignOut() {
    localStorage.clear();
    setCurrentUser({});
    setSavedMovies([]);
    setIsError(false);
    setEnablePreloader(false);
    setAuthorized(false);
    navigation('/');
  }


  function handleUpdateUser(userInfo) {
    requestMainApi.updateUserInfo(userInfo, token)
      .then((profileInfo) => {
        setCurrentUser(profileInfo);
        setIsError(false);
      })
      .catch((err) => {
        console.log(`ошибка при изменении профиля: ${err}`)
        if (err === 'произошла ошибка: 409') {
          setIsError(true);
        }
      });

  }


  function handleSaveMovie(film) {
    requestMainApi.saveMovie(film, token)
      .then((filmCard) => {
        setSavedMovies([filmCard, ...savedMovies]);
      })
      .catch((err) => console.log(`ошибка при сохранении фильма: ${err}`));
  }


  function handleRemoveMovie(film) {
    requestMainApi.removeMovie(film._id, token)
      .then(() => {
        const filmsList = savedMovies.filter((item) => item._id === film._id ? false : true);
        setSavedMovies(filmsList);
      })
      .catch((err) => console.log(`ошибка при удалении фильма: ${err}`));
  }


  return (
    <CurrentUserContext.Provider value={isCurrentUser}>
      <div className='page'>
        <div className='page__content'>
          <Routes>
            <Route
              exact
              path='/'
              element={
                <>
                  <Header loggedIn={isAuthorized} color={'blue'} />
                  <Promo />
                  <AboutProject />
                  <Techs />
                  <AboutMe />
                  <Portfolio />
                  <Footer />
                </>
              }
            />


            <Route
              path='/movies'
              element={
                <ProtectedRoute loggedIn={isAuthorized}>
                  <Preloader isEnable={isEnablePreloader}></Preloader>
                  <Header loggedIn={isAuthorized} color={'black'} />
                  <Movies
                    likeMovie={handleSaveMovie}
                    removeMovie={handleRemoveMovie}
                    statusPreloader={setEnablePreloader}
                    savedMoviesList={savedMovies} />
                  <Footer />
                </ProtectedRoute>
              }
            />

            <Route
              path='/saved-movies'
              element={
                <ProtectedRoute loggedIn={isAuthorized}>
                  <Header loggedIn={true} color={'black'} />
                  <SavedMovies
                    removeMovie={handleRemoveMovie}
                    statusPreloader={setEnablePreloader}
                    cardList={savedMovies} />
                  <Footer />
                </ProtectedRoute>
              }
            />


            <Route
              path='/profile'
              element={
                <ProtectedRoute loggedIn={isAuthorized}>
                  <Header loggedIn={true} color={'black'} />
                  <Profile
                    onSubmitProfile={handleUpdateUser}
                    onLogout={handleSignOut}
                    userInfo={isCurrentUser}
                    errorEmail={isError} />
                </ProtectedRoute>
              }
            />

            <Route
              path='/signin'
              element={
                isAuthorized
                  ? <Navigate to='/' />
                  : <Login onLogin={handleLogin} />
              }
            />

            <Route
              path='/signup'
              element={
                isAuthorized
                  ? <Navigate to='/signin' />
                  : <Register onRegister={handleRegistration} />
              }
            />

            <Route
              path='*'
              element={
                <PageNotFoundError />
              }
            />

          </Routes>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
