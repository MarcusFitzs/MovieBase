import RegisterForm from "../components/RegisterForm";
import Grid from '@mui/material/Grid';

const Home = (props) => {
    return (
        <>
            <h1>Register</h1>
            <Grid container spacing={2}>
            {(!props.authenticated) ? (
                <RegisterForm onAuthenticated={props.onAuthenticated} />
            ) : (
                <p>You shouldn't be here...</p>
            )}
            </Grid>
            
        </>
    );
};

export default Home;