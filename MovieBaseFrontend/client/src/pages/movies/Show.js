// import { useParams, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from '../../config';
import { useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard'

import Grid from '@mui/material/Grid';;

const Movie = (props) => {
    const { id } = useParams();
    // const navigate = useNavigate();
    const [ movie, setMovie] = useState(null);
    const [ IMDb, setIMDb] = useState(null);
    const [ recs, setRecs] = useState(null);
    const [ similars, setSimilars] = useState(null); 

    let token = localStorage.getItem('token');

    // const deleteCallback = (id) => {
    //     navigate('/movies');
    // };

    useEffect(() => {
        axios.get(`/movies/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response.data);
                setMovie(response.data);
            })
            .catch((err) => {
                console.error(err);
                console.log(err.response.data.message);
            });
    }, [token, id]);

    useEffect(() => {
        if (movie) {
            // fetch(`https://imdb-api.com/en/API/Title/k_zvyi75fh/${movie.tconst}`, {
            fetch(`https://catfact.ninja/fact`, {
                method: 'GET',
            })
            .then(res => res.json())
            .then(data => {
                console.log("17" + data);
                setIMDb(data);
            });
        }
    }, [movie]);

    useEffect(() => {
        // e.preventDefault();
        if (movie) {
            const formData = new FormData();
            formData.append("tconst", movie.tconst)

            fetch('http://localhost:5000/similar', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                console.log("checkpoint1 = " + data[Object.keys(data)[0]]);
                console.log(data);
                setRecs(data);
            });
        }
    }, [movie]);

    useEffect(() => {
        // e.preventDefault();
        let recHolder = [];
        if (recs) {
            for (let i = 0; i < 5; i++) {
                console.log("recs checkpoint #" + i + " = " + recs[Object.keys(recs)[i]])
                axios.get(`/movies/rec/${recs[Object.keys(recs)[i]]}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    recHolder.push(response.data)
                    // setSimilars(similars, [response.data]);
                    // console.log("Checkpoint99 = " + similars)
                })
                .then(() => {
                    setSimilars(recHolder)
                    console.log("Checkpoint99 = " + similars)
                })
                .catch((err) => {
                    console.error(err);
                    console.log(err.response.data.message);
                });
            }
        }
    }, [recs]);

    let similarsList = [];

    if (similars) {
        if (similars.length >= 4) {
            similarsList = similars.map((movie) => {
                return  <Grid xs={6} md={4}> 
                            <MovieCard 
                                key={movie._id} 
                                movie={movie} 
                                authenticated={props.authenticated} 
                            /> 
                        </Grid>;
            });
        }
    }

    if (similars) {
        console.log("movie = " + movie._id)
        console.log("similars = " + similars[0][0]._id)
        console.log("similars Length = " + similars.length)
    }

    if(!movie) return "Loading...";

    return (
        <>
            {/* <MovieCard movie={movie} callback={deleteCallback}/> */}
            <MovieCard movie={movie}/>
            <h1>IMDb ID</h1>
            { IMDb?.id }
            <h1>Title</h1>
            { IMDb?.title }
            <h1>Poster</h1>
            <img src={ IMDb?.image } alt="poster" width="343" height="508"></img>
            <h1>Release Date</h1>
            { IMDb?.releaseDate }
            <h1>Runtime</h1>
            { IMDb?.runtimeStr }
            <h1>Plot Summary</h1>
            { IMDb?.plot }
            <h1>Awards</h1>
            { IMDb?.awards }
            <h1>Director(s)</h1>
            { IMDb?.directors }
            <h1>Writer(s)</h1>
            { IMDb?.writers }
            <h1>Main Cast</h1>
            { IMDb?.stars }
            <h1>Production Companies</h1>
            { IMDb?.companies }
            <h1>Language(s)</h1>
            { IMDb?.languages }
            <h1>Age Rating</h1>
            { IMDb?.contentRating }
            <h1>IMDb Rating</h1>
            { IMDb?.imDbRating }
            <h1>IMDb Number of Ratings</h1>
            { IMDb?.imDbRatingVotes }
            <h1>Box Office Gross</h1>
            { IMDb?.boxOffice?.cumulativeWorldwideGross }
            <h1>Similar Movies</h1>
            { similarsList }
        </>
    );
};

export default Movie;