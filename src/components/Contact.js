import React, {useState} from "react";
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {TextField, Typography, Button, Grid, Box} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import Navbar from './Navbar'
import emailjs from 'emailjs-com';

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


const InputField = withStyles({
    root:{
        "& label.Mui-focused":{
            color: "#EE6C4D",
        },
        "& label":{
            color: "#E0FBFC"
        },
        "& .MuiOutlinedInput-root":{
            "& fieldset":{
                borderColor: "#E0FBFC",

            },
            "&:hover fieldset":{
                borderColor: "#E0FBFC",

            },
            "& .Mui-focused fieldset": {
                borderColor: "#E0FBFC",

            }
        }
    }
})(TextField);


const Contact = () => {
    const classes = useStyles();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [message, setMessage] = useState("");

    const onSubmit = e => {
        e.preventDefault();
        emailjs.send("service_zen7pkn","template_dot2nfc",{
            name: name,
            email: email,
            message: message,
            companyname: companyName,
            companyName: companyName,
            }, "user_rqdP5rFOtwU0LAcueNtOr").then(function(response) {
                alert("Your message has been submitted successfully!");
                window.location.reload(false);
             }, function(error) {
                alert("Oh no! Your message was not sent, please try again.");
                window.location.reload(false);
             });
        setName("");
        setEmail("");
        setCompanyName("");
        setMessage("");
    }
    return (
        <>
         <Box component="div" style={{background: "#3D5A80", height: "100vh"}}>
            <Navbar/>
            <Grid container justify="center">
                <Box component="form" className={classes.form}>
                    <Typography variant="h5" style={{color: "#EE6C4D", textAlign: "center", textTransform: "uppercase"}}>
                        Contact me!
                    </Typography>
                    <InputField fullWidth={true} label="Name" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} onChange={(event) => {setName(event.target.value);}}  />
                    <br/>
                    <InputField fullWidth={true} label="Email" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} onChange={(event) => {setEmail(event.target.value);}}/>
                    <br/>
                    <InputField fullWidth={true} label="Company Name" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} onChange={(event) => {setCompanyName(event.target.value);}}/>
                    <br/>
                    <InputField multiline fullWidth={true} rows={4} label="Message" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} onChange={(event) => {setMessage(event.target.value);}}/>
                    <br/>
                    <Button type="submit" onClick={onSubmit} variant="outlined" fullWidth={true} endIcon={<SendIcon/>} className={classes.button}>
                        Contact Me
                    </Button>
                </Box>
            </Grid>
         </Box>
         
        </>
    )
}


export default Contact
