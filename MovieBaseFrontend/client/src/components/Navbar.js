import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 

const Navbar = (props) => {
    const navigate = useNavigate();

    const logout = () => {
        props.onAuthenticated(false);
        navigate('/');
    };

    //Dynamically set anchors for multiple buttons/drop downs
    const [anchorState, setAnchorState] = useState({
        btn1: null,
        btn2: null,
    });
    
    const handleClick = (e) => {
        setAnchorState({ [e.target.name]: e.currentTarget });
    };
    
    const handleClose = (e) => {
        setAnchorState({ [e.target.name]: null });
    };


    return (
        <Grid item xs={12}>
            <Button component={Link} to='/'>Home</Button>

            {/* Creating the buttons */}
            <Button
                id="basic-button-1"
                aria-controls={Boolean(anchorState.btn1) ? "basic-menu-1" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorState.btn1) ? "true" : undefined}
                onClick={handleClick}
                name="btn1"
            >
                Movies
            </Button>

            <Button
                id="basic-button-2"
                aria-controls={Boolean(anchorState.btn2) ? "basic-menu-2" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorState.btn2) ? "true" : undefined}
                onClick={handleClick}
                name="btn2"
            >
                Predictions
            </Button>

            <Button component={Link} to='/profile'>Profile</Button>

            {/* Creating the menus for each button */}
            <Menu
                id="basic-menu-1"
                anchorEl={anchorState.btn1}
                open={Boolean(anchorState.btn1)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button-1",
                }}
            >
                {/* Movie links */}
                <MenuItem component={Link} to="/movies" onClick={handleClose}>
                    All
                </MenuItem>
                <MenuItem component={Link} to="/movies/create" onClick={handleClose}>
                    Create
                </MenuItem>
            </Menu>
            <Menu
                id="basic-menu-2"
                anchorEl={anchorState.btn2}
                open={Boolean(anchorState.btn2)}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button-2",
                }}
            >
                {/* Actor links */}
                <MenuItem component={Link} to="/formtest" onClick={handleClose}>
                    FormTest
                </MenuItem>
                <MenuItem component={Link} to="/actors/create" onClick={handleClose}>
                    Create
                </MenuItem>
            </Menu>

            {/* Show logout button if logged in */}
            {(props.authenticated) ? (
                <Button variant='outlined' onClick={logout}>Logout</Button>
            ) : ""}
        </Grid>
    );
};

export default Navbar;