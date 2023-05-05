import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from '../config';

import { useState, useEffect } from 'react';

const AddToListBtn = (props) => {
    const [ listID, setListID ] = useState(null);

    const thisUserID = localStorage.getItem('userID');

    useEffect(() => {
        axios.get(`/lists/user/${thisUserID}`)
            .then((response) => {
                // console.log("first call response = " + response.data[0]._id)
                setListID(response.data[0]._id);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [thisUserID]);

    // console.log("listID? = " + listID);

    const onAdd = () => {
        axios.post('/ble', {
            listID: listID,
            movieID: props.id
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((err) => {
            console.error(err);
            console.log(err.response.data);
        });
    };

    return (
        <Button 
            // startIcon={<DeleteIcon />}
            // variant='outlined'
            color='error'
            onClick={onAdd}
        >
            <FavoriteIcon></FavoriteIcon>
        </Button>
    );
};

export default AddToListBtn;