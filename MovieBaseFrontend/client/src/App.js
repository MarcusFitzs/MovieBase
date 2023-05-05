import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';

// import pages
import Home from './pages/Home';
import Register from './pages/Register'

import Formtest from './pages/formtest';
import MoviesIndex from './pages/movies/Index';
import MoviesShow from './pages/movies/Show';
import ProfileIndex from './pages/profile/Index';

// import MoviesIndex from './pages/movies/Index';

import PageNotFound from './pages/PageNotFound';

//import components
import Navbar from './components/Navbar';

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);
    let protectedMovies;

    useEffect(() => {
        if(localStorage.getItem('token')) {
            setAuthenticated(true);
        }
    }, []);

    const onAuthenticated = (auth, token) => {
        setAuthenticated(auth);

        if(auth){
            localStorage.setItem('token', token);
            
        }
        else {
            localStorage.removeItem('token');
        }
    };

    //Paths only accessible if logged in
    if(authenticated){
        protectedMovies = (
            <>
                <Route path="/formtest" element={<Formtest />} />
            </>
        );
    }

    //All paths, calling the protected paths at the end
    return (
        <Router>
            <Container maxWidth="md">
                {/* <Grid container spacing={0} > */}
                    <Navbar onAuthenticated={onAuthenticated} authenticated={authenticated}/>
                    <Routes>
                        <Route path="/" element={<Home onAuthenticated={onAuthenticated} authenticated={authenticated} />} />
                        <Route path="/register" element={<Register onAuthenticated={onAuthenticated} authenticated={authenticated} />} />
                        <Route path="/movies" element={<MoviesIndex authenticated={authenticated} />} />
                        <Route path="/movies/:id" element={<MoviesShow authenticated={authenticated} />} />

                        <Route path="/profile" element={<ProfileIndex authenticated={authenticated} />} />

                        {protectedMovies}

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                {/* </Grid> */}
            </Container>    
        </Router>
    );
};

export default App;