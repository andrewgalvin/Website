import React, {useState} from "react";
import {makeStyles} from '@material-ui/core/styles'
import {TextField, Button, Grid, Box} from '@material-ui/core'
import Navbar from './Navbar'
import emailjs from 'emailjs-com';
import {
    Paper,
    Typography
  } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { ToastContainer, toast} from 'react-toastify';
import Particles from 'react-particles-js'

const useStyles = makeStyles(theme=>({
    form: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "absolute"
    },
    button: {
        marginTop: "1rem",
        color: "#EE6C4D",
        borderColor: "#EE6C4D"
    },
    subject:{
        "& .MuiInputBase-input":{
            height: "10em",
            
        },
        "& .MuiOutlinedInput-inputMarginDense":{
            padding: "0 0"
        }
    },
    particles:{
        position: "absolute",
    }
}));


const Contact = () => {
    const classes = useStyles();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");

    const onSubmit = e => {
        e.preventDefault();
        var name = firstName + " " + lastName
        if (firstName === ""){
            toast.error("Please enter your first name.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500
            });
        }
        else if (lastName === ""){
            toast.error("Please enter your last name.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500
            });
        }
        else if (email === ""){
            toast.error("Please enter your email.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500
            });
        }
        else if (subject === ""){
            toast.error("Please enter the subject.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500
            });
        }
        else if (message === ""){
            toast.error("Please enter your message.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2500
            });
        }
        else{
            emailjs.send("service_zen7pkn","template_dot2nfc",{
                name: name,
                email: email,
                message: message,
                subject: subject,
                companyName: companyName,
                }, "user_rqdP5rFOtwU0LAcueNtOr").then(function(response) {
                    toast.success("Your message was sent successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2500
                      });
                    // window.location.reload(false);
                 }, function(error) {
                    toast.error("Oh no! Your message was not sent, please try again.", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2500
                    });
                    // window.location.reload(false);
                 });
            setFirstName("");
            setLastName("");
            setEmail("");
            setCompanyName("");
            setMessage("");
        }
    }


    return (
        <>
         <Box component="div" style={{background: "#3D5A80", height: "100vh"}}>
            <Navbar/>
            <Particles canvasClassName={classes.particles}>
                params={{
                    particles:{
                        number:{
                            value: 45,
                            density: {
                                enable: true,
                                value_area: 900
                            }
                        },
                        size:{
                            value: 8,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 6,
                                size_min: 0.1,
                                sync: true
                            }
                        },
                        opacity: {
                            value:1,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: true
                            }
                        }
                    }
                }}
            </Particles>
            <Grid container justify="center">
                <Box component="form" className={classes.form}>
                    <Typography variant="h5" style={{color:"#FFFFFF"}} align="center" component="h2" gutterBottom >
                        Contact Me!
                    </Typography>
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        render={() => (
                            // <form onSubmit={handleSubmit}>
                            <Paper style={{ padding: 16 }}>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={6}>
                                <Field
                                    fullWidth
                                    name="firstName"
                                    component={TextField}
                                    type="text"
                                    label="First Name"
                                    onChange={(event) => {setFirstName(event.target.value);}}
                                    required={true}
                                />
                                </Grid>
                                <Grid item xs={6}>
                                <Field
                                    fullWidth
                                    name="lastName"
                                    component={TextField}
                                    type="text"
                                    label="Last Name"
                                    onChange={(event) => {setLastName(event.target.value);}}
                                    required
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <Field
                                    name="email"
                                    fullWidth
                                    component={TextField}
                                    type="email"
                                    label="Email"
                                    onChange={(event) => {setEmail(event.target.value);}}
                                    required
                                />
                                </Grid>

                                <Grid item xs={12}>
                                <Field
                                    fullWidth
                                    name="Subject"
                                    component={TextField}
                                    multiline
                                    label="Subject"
                                    onChange={(event) => {setSubject(event.target.value);}}
                                    required
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <Field
                                    fullWidth
                                    name="Message"
                                    component={TextField}
                                    multiline
                                    label="Message"
                                    onChange={(event) => {setMessage(event.target.value);}}
                                    required
                                />
                                </Grid>
                                <Grid item style={{ marginTop: 16 }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    // onClick={reset}
                                    disabled
                                >
                                    Reset
                                </Button>
                                </Grid>
                                <Grid item style={{ marginTop: 16 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={onSubmit}
                                >
                                    Submit
                                </Button>
                                </Grid>
                            </Grid>
                            </Paper>
                        // </form>
                        )}
                        />
                                </Box>
                                
                            </Grid>
                            <ToastContainer />  
                        </Box>
         
        </>
    )
}


const validate = values => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = 'Required';
    }
    if (!values.lastName) {
      errors.lastName = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    }
    return errors;
  };

export default Contact
