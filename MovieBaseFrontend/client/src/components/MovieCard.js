import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

import { styled } from '@mui/material/styles';

import AddToListBtn from './AddToListBtn';

import axios from '../config';

const MovieCard = (props) => {
    const [value, setValue] = useState(null);
    const [currentRating, setCurrentRating] = useState(null);
    const [ID, setID] = useState(null);

    const thisUserID = localStorage.getItem('userID');

    console.log("moviecard getting id = " + props.movie._id)

    useEffect(() => {
        axios.get(`/userRatings/${thisUserID}/${props.movie._id}`)
            .then((response) => {
                setValue(response.data[0].rating);
                setID(response.data[0]._id)
                setCurrentRating(1)
            })
            .catch((err) => {
                console.error(err);
                console.log(err.response.data.message);
            });
    }, [thisUserID, props.movie._id]);

    useEffect(() => {
        if(value && !currentRating){
            onRate();
            onSubmit();
        } 
        else if (value && currentRating) {
            onEdit();
        }
    }, [value, currentRating]);

    const onEdit = () => { 
        console.log("onEdit value = " + value)
        
        axios.put(`/userRatings/${ID}`, {
            userID: thisUserID,
            movieID: props.movie._id,
            rating: value
        })
        .then((response) => {
            console.log(response.data);
            //setErrorMessage("");
            //props.onAuthenticated(true, response.data.token);
        })
        .catch((err) => {
            console.error(err);
            console.log(err.response.data);
            //setErrorMessage(err.response.data.message);
        });
    };

    const onRate = () => { 
        console.log("onRate value = " + value)
        
        axios.post('/userRatings', {
            userID: thisUserID,
            movieID: props.movie._id,
            rating: value
        })
        .then((response) => {
            console.log(response.data);
            //setErrorMessage("");
            //props.onAuthenticated(true, response.data.token);
        })
        .catch((err) => {
            console.error(err);
            console.log(err.response.data);
            //setErrorMessage(err.response.data.message);
        });
    };

    const onSubmit = () => {
        console.log("onSubmit value = " + value)

        const formData = new FormData();
        formData.append("tconst", props.movie.tconst)
        formData.append("this_user_id", thisUserID)
        formData.append("primaryTitle", props.movie.primaryTitle)
        formData.append("rating", value * 2)

        fetch('http://localhost:5000/rate', {
            method: 'POST',
            body: formData
        });
        // .then(res => res.json())
        // .then(data => {
        //     console.log("checkpoint1");
        //     console.log(data.data);
        //     setPrediction(data);
        // });
    };

    
    const RatedStyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#447BCC',
        },
        '& .MuiRating-iconHover': {
            color: '#2563BE',
        },
    });

    const UnratedStyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: '#faaf00',
        },
        '& .MuiRating-iconHover': {
            color: '#2563BE',
        },
    });
    

    const starRating = () => {
        console.log("value = " + value)
        if (!value) {
            return (
                <Stack spacing={1}>
                    <UnratedStyledRating 
                        name="half-rating" 
                        defaultValue={2} 
                        precision={0.5} 
                        value={value || props.movie.averageRating/2}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                            // onRate();
                            // onSubmit();
                            // onEdit();
                        }}
                    />
                </Stack>
            );
        } else {
            return (
                <Stack spacing={1}>
                    <RatedStyledRating 
                        name="half-rating" 
                        defaultValue={2} 
                        precision={0.5} 
                        value={value || props.movie.averageRating/2}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                            onRate();
                            onSubmit();
                        }}
                    />
                </Stack>
            );
        }
    };

    let title = <p>{props.movie.primaryTitle} </p>;
    let mID = <p>{props.movie.tconst}</p>

    return (
        <Card id="movieCard" sx={{ minWidth: 220, maxWidth: 220}}>
            <CardActionArea href={`/movies/${props.movie._id}`}>
                <CardMedia
                    component="img"
                    image={`http://img.omdbapi.com/?i=${props.movie.tconst}&apikey=e729aa7f`}
                    width="220"
                    height="326"
                />
                <CardContent>
                    <Typography id="cardTitle" gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography id="cardExtra" variant="body2" color="text.secondary">
                        <a href={`https://www.imdb.com/title/${props.movie.tconst}`}>{mID}</a>
                    </Typography>
                </CardContent>
            </CardActionArea>
            
            <CardActions>
                {starRating()}
                <AddToListBtn id={props.movie._id} resource='movies' callback={props.callback} />
            </CardActions>
        </Card>
      );
};

export default MovieCard;