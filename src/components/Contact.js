import React from 'react'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {TextField, Typography, Button, Grid, Box} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import Navbar from './Navbar'


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
    return (
        <>
         <Box component="div" style={{background: "#3D5A80", height: "100vh"}}>
            <Navbar/>
            <Grid container justify="center">
                <Box component="form" className={classes.form}>
                    <Typography variant="h5" style={{color: "#EE6C4D", textAlign: "center", textTransform: "uppercase"}}>
                        Hire or contact me...
                    </Typography>
                    <InputField fullWidth={true} label="Name" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} />
                    <br/>
                    <InputField fullWidth={true} label="Email" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} />
                    <br/>
                    <InputField fullWidth={true} label="Company Name" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} />
                    <br/>
                    <InputField fullWidth={true} label="Subject" variant="outlined" margin="dense" size="medium" inputProps={{style:{color: "#E0FBFC"}}} className={classes.subject}/>
                    <br/>
                    <Button variant="outlined" fullWidth={true} endIcon={<SendIcon/>} className={classes.button}>
                        Contact Me
                    </Button>
                </Box>
            </Grid>
         </Box>
        </>
    )
}

export default Contact
