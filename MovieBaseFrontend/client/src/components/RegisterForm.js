import { useState } from 'react';
import axios from '../config';

import { useNavigate } from "react-router-dom";

const RegisterForm = (props) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const styles = { color: "red", backgroundColor:"white" };

    const navigate = useNavigate();

    const handleForm = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //Send form data to server
    const submitForm = () => {
        console.log("Name: ", form.name);
        console.log("Email: ", form.email);
        console.log("Password: ", form.password);

        axios.post('/register', {
                name: form.name,
                email: form.email,
                password: form.password
            })
            .then((response) => {
                const users = response.data.user._id
                // console.log(response.data);
                setErrorMessage("");
                props.onAuthenticated(true, response.data.token);
                localStorage.setItem('userID', users);
                // console.log('user', user)
                const userID = localStorage.getItem('userID');
                console.log('y', userID)

            })
            .catch((err) => {
                console.error(err);
                console.log(err.response.data);
                setErrorMessage(err.response.data.message);
            });

            navigate('/')
    };


    //Login form
    return (
        <>
            Name: <input type="text" name="name" value={form.name} onChange={handleForm} />
            <br />
            Email: <input type="text" name="email" value={form.email} onChange={handleForm} />
            <br />
            Password: <input type="password" name="password" value={form.password} onChange={handleForm} />
            <button onClick={submitForm}>Submit</button>
            <p style={styles}>{errorMessage}</p>
        </>
    );
};

export default RegisterForm;