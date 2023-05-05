import axios from '../config';

import { useState, useEffect } from 'react';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const AddToListBtn = (props) => {
    const thisUserID = localStorage.getItem('userID');

    const [ listID, setListID ] = useState(null);

    const options = [];

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

    useEffect(() => {
        axios.get(`/lists/user/${thisUserID}`)
            .then((response) => {
                console.log("first call response = " + response.data)
                setListID(response.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [thisUserID]);

    useEffect(() => {
        if (listID) {
            console.log("Checkpoint 999");
            let no_names = listID.length;
            
            for (let i = 0; i < no_names; i++) {
                options.push([listID[i].listName]);
                console.log("list Name = " + listID[i].listName);
            }
            console.log("Options = " + options);
        };
    }, [listID, options]);

    // const onAdd = () => {
    //     let test = "6425b055820c1b34772e90b6";
    //     axios.post('/ble', {
    //         listID: test,
    //         movieID: props.id
    //     })
    //     .then((response) => {
    //         console.log(response.data);
    //         //setErrorMessage("");
    //         //props.onAuthenticated(true, response.data.token);
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //         console.log(err.response.data);
    //         //setErrorMessage(err.response.data.message);
    //     });
    // };

    return (
        <>
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
                        {/* {optionIndex = options.indexOf(options[selectedIndex])}
                        {setOptionIndex(options.indexOf(options[selectedIndex]))} */}
                        {console.log("optionIndex = " + optionIndex)}
                    </MenuItem>
                    ))}
                </Menu>
            </div>
        </>                    
        // <Button 
        //     startIcon={<DeleteIcon />}
        //     variant='outlined'
        //     color='error'
        //     onClick={onAdd}
        // >
        //     Add list
        // </Button>
    );
};

export default AddToListBtn;