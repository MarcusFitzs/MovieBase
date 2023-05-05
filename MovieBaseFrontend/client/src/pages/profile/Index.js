import axios from '../../config';
import { useState, useEffect } from 'react';

// import Grid from '@mui/material/Grid';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const thisUserID = localStorage.getItem('userID');

const Index = (props) => {
    const [ listID, setListID ] = useState(null);
    const [ listcontent, setListContent ] = useState(null);
    const [ ratings, setRatings ] = useState(null);

    const [form, setForm] = useState({
        listName: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const styles = { color: "red", backgroundColor:"white" };

    const options = [
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        setOptionIndex(options.indexOf(options[selectedIndex]));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [ optionIndex, setOptionIndex ] = useState(1);

    // let optionIndex = -1;

    useEffect(() => {
        axios.get(`/lists/user/${thisUserID}`)
            .then((response) => {
                console.log("List call response = " + response.data)
                setListID(response.data);
            })
            .catch((err) => {
                console.error(err);
            });
        
        axios.get(`/userRatings/user/${thisUserID}`)
            .then((response) => {
                console.log("Ratings call response = " + response.data)
                setRatings(response.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [thisUserID]);
    
    useEffect(() => {
        if (listID) {
            // let no_lists = listID.length;

            // for (let i = 0; i < no_lists; i++) {
            //     // console.log("listID2 = " + listID[i]._id);
            // }

            console.log("optionIndex = " + optionIndex);
            
            axios
                .get(`/listcontent/user/${listID[0]?._id}`)
                // .get(`/listcontent/user/${listID[optionIndex]._id}`)
                .then((response) => {
                    console.log("second call response = " + response.data);
                    setListContent(response.data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [listID, optionIndex]);

    const listNames = () => {
        let names = [];
        let no_names = listID.length;
        
        for (let i = 0; i < no_names; i++) {
            names.push(<p>{listID[i].listName}</p>);
            options.push(listID[i].listName);
            // console.log("list Name = " + listID[i].listName);
        }
        return names;
    };

    const theList = () => {
        let rec = [];
        let no_movies = listcontent.length;
        
        for (let i = 0; i < no_movies; i++) {
            rec.push(<p>{listcontent[i].movieID.primaryTitle}</p>);
            // console.log("Movie title " + [i+1] + ": " + listcontent[i].movieID.primaryTitle);
        }
        return rec;
    };

    const ratingList = () => {
        let list = [];
        let no_movies = ratings.length;
        
        for (let i = 0; i < no_movies; i++) {
            list.push(<p>{ratings[i].movieID.primaryTitle} - {ratings[i].rating}</p>);
            // console.log("Movie title " + [i+1] + ": " + listcontent[i].movieID.primaryTitle);
        }
        return list;
    };

    const handleForm = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitForm = () => {
        axios.post('/lists', {
                userID: thisUserID,
                listName: form.listName
            })
            .then((response) => {
                console.log("Post new list = " + response.data);
                setErrorMessage("");
                // props.onAuthenticated(true, response.data.token);
            })
            .catch((err) => {
                console.error(err);
                console.log(err.response.data);
                setErrorMessage(err.response.data.message);
            });
    };

    return (
        <>
            <h2>UserID</h2>c
            {thisUserID}
            <h2>Lists</h2>
            { listID && listNames() }
            {/* <form> */}
                Create new list: <input type="text" name="listName" value={form.listName} onChange={handleForm} />
                <button onClick={submitForm}>Submit</button>
                <p style={styles}>{errorMessage}</p>
            {/* </form> */}
            <h2>List Content</h2>
            <div>
                <List
                    component="nav"
                    aria-label="Device settings"
                    sx={{ bgcolor: 'background.paper' }}
                >
                    <ListItem
                    button
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickListItem}
                    >
                    <ListItemText
                        primary="Select List"
                        secondary={options[selectedIndex]}
                    />
                    </ListItem>
                </List>
                <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                    }}
                >
                    {options.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                        >
                            {option}
                            {console.log("options = " + options)}
                            {/* {optionIndex = options.indexOf(options[selectedIndex])} */}
                            {/* {setOptionIndex(options.indexOf(options[selectedIndex]))} */}
                            {console.log("optionIndex = " + optionIndex)}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
            <h2>Favourites</h2>
            { listcontent && theList() }
            <hr />
            <h2>Rated movies</h2>
            { ratings && ratingList() }
        </>
    );
};

export default Index;