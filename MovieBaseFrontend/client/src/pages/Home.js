import LoginForm from "../components/LoginForm";

import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

import Grid from '@mui/material/Grid';

import axios from '../config';

const Home = (props) => {
    const [prediction, setPrediction] = useState(null);  
    const [prediction2, setPrediction2] = useState(null); 
    const [prediction3, setPrediction3] = useState(null); 
    const thisUserID = localStorage.getItem('userID');
    let token = localStorage.getItem('token');

    let no_of_movies = 5;

    useEffect(() => {
        // e.preventDefault();

        const formData = new FormData();
        formData.append("target_user_id", thisUserID)
        formData.append("no_of_highest", 15)
        formData.append("no_of_similar_users", 5)
        formData.append("no_of_movies", no_of_movies)

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log("checkpoint1");
            console.log(data.data);
            setPrediction(data);
        });
    }, [thisUserID, no_of_movies]);

    // let rec = []

    useEffect(() => {
        let rec = [];
        if (prediction) {
            for (let i = 0; i < prediction.data.Recommendations[0].length; i++) {
                axios.get(`/movies/rec/${prediction.data.Recommendations[0][i]}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    rec.push(response.data)
                })
                .then(() => {
                    setPrediction2(rec)
                    console.log("pred2 = " + rec)
                })
                .catch((err) => {
                    console.error(err);
                    console.log(err.response.data.message);
                });
            }
            // setPrediction2(rec)
            // console.log("pred7 = " + prediction2)
            // setPrediction(null)
        }
    }, [prediction, token]);

    // let moviesList = [];

    useEffect(() => {
        if (prediction2?.length > no_of_movies) {
            setPrediction3(prediction2)
            console.log("prediction3 " + prediction3);
        }
    }, [prediction2, no_of_movies, prediction3]);

    // console.log("TESTING " + prediction.data.Recommendations[0]);
    // console.log("Checkpoint3 " + prediction2[0][0].tconst);

    const moviesList = prediction3?.map((Recommendation) => {
        console.log("Checkpoint4 " + Recommendation[0].tconst);
        console.log(prediction2);
        return (
            <Grid xs={6} md={4}> 
                    <MovieCard 
                        key={Recommendation[0]._id} 
                        movie={Recommendation[0]} 
                        authenticated={props.authenticated} 
                    /> 
                </Grid>
        );
    });
    // }

    return (
        <>
            <h1>Your Top Recommendations1</h1>
            <Grid container spacing={2}>
            {(!props.authenticated) ? (
                <LoginForm onAuthenticated={props.onAuthenticated} />
            ) : (
                // <p>You are logged in</p>
                <Grid container spacing={2}> 
                    { moviesList } 
                </Grid>
            )}
            </Grid>
            
        </>
    );
};

export default Home;