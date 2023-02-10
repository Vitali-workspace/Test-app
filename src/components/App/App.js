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
import requestMainApi from '../../utils/MainApi';


function App() {

  const [isAuthorized, setAuthorized] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState({});

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
                  <Header loggedIn={isAuthorized} />
                  <Map />
                  <Footer />
                </>
              }
            />


            <Route
              path='/world'
              element={
                <ProtectedRoute loggedIn={isAuthorized}>
                  <Header loggedIn={isAuthorized} />
                  <Footer />
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
