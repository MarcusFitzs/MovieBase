import { useState } from 'react';
import MovieCard from '../components/MovieCard';

import Grid from '@mui/material/Grid';

const thisUserID = localStorage.getItem('userID');

const Formtest = (props) => {
    const [prediction, setPrediction] = useState(null);    

    const onSubmit = async e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("target_user_id", thisUserID)
        formData.append("no_of_highest", document.getElementById("no_of_highest").value)
        formData.append("no_of_similar_users", document.getElementById("no_of_similar_users").value)
        formData.append("no_of_movies", document.getElementById("no_of_movies").value)

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
    };

    const formatTop = () => {
        let top = [];
        for (let i = 0; i <= document.getElementById("no_of_highest").value; i++) {
            top.push(<p>{prediction.data.Users_Top_Movies[0][i]}</p>);
        }
        return top;
    };

    const formatSim = () => {
        let sim = [];
        for (let i = 0; i <= document.getElementById("no_of_similar_users").value-1; i++) {
            sim.push(<p>User #{prediction.data.Similar_Users[i]}, seperated by a distance of {prediction.data.Sim_User_distances[i]}</p>);
        }
        return sim;
    };

    const formatRec = () => {
        let rec = [];
        let no_movies = document.getElementById("no_of_movies").value;
        
        for (let i = 1; i <= no_movies; i++) {
            rec.push(<p>{prediction.data.Recommendations[0][i]} - <a href={'https://www.imdb.com/title/' + prediction.data.Recommendations[0][i]}>IMDb link</a></p>);
        }
        return rec;
    };

    // const movieList = () => {
    //     let movieList = [];
    //     let no_movies = document.getElementById("no_of_movies").value;
    //     //let lll = "";
        
    //     for (let i = 1; i <= no_movies; i++) {
    //         //lll = prediction.data.Recommendations[0][i]
    //         movieList.push(prediction.data.Recommendations[0][i])
    //         // movieList.push(<MovieCard movie={{lll}}/>)
    //     }
    //     return movieList;
    // };

    let moviesList = []

    if (prediction) {
        console.log("TESTING " + prediction.data.Recommendations[0]);
        moviesList = prediction.data.Recommendations[0].map((Recommendation) => {
            return <Grid xs={6} md={4}> 
            {/* return  */}
                        <MovieCard 
                            // key={Recommendations} 
                            movie={Recommendation} 
                            authenticated={props.authenticated} 
                        /> 
                    </Grid>;
        });
    }
    
    

    return (
        <div classMovieName='App'>
            <form onSubmit={onSubmit}>
                <div className='custom-file'>
                    {/* <label for="target_user">target_user</label>
                    <input type="number" id="target_user" name="target_user" />
                    <br />
                    <br /> */}
                    <label for="no_of_highest">no_of_highest_rated_movies_by_target_user</label>
                    <input type="number" id="no_of_highest" name="no_of_highest" />
                    <br />
                    <br />
                    <label for="no_of_similar_users">no_of_similar_users</label>
                    <input type="number" id="no_of_similar_users" name="no_of_similar_users" />
                    <br />
                    <br />
                    <label for="no_of_movies">no_of_movies_to_recommend</label>
                    <input type="number" id="no_of_movies" name="no_of_movies" />
                </div> 
                <input
                    type='submit'
                    value='Submit'
                    className='btn btn-primary btm-block mt-4'
                />
            </form>
            <h1>Users Top Movies</h1>
            { prediction && formatTop() }
            <br />
            <h1>Users Most Similar to Target User</h1>
            { prediction && formatSim() }
            <br />
            <h1>Recommendations Based on Similar Users</h1>
            { prediction && formatRec() }

            {/* { prediction && movieList() } */}

            {/* <MovieCard movie={prediction && movieList()[0]}/> */}
            <Grid container spacing={2}> 
                { moviesList }
            </Grid>
        </div>
    );
};

export default Formtest;