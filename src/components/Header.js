import React from 'react'
import {
    Typography,
    Avatar,
    Grid,
    Box,
    Button
} from "@material-ui/core"
import Typed from 'react-typed'
import {makeStyles} from "@material-ui/core"
import avatar from '../avatar.png'
import resume from '../files/Resume.pdf'

// CSS Styles
const useStyles = makeStyles(theme=>({
    avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        margin: theme.spacing(1)
    },
    title: {
        color: "#E0FBFC"
    },
    subtitle: {
        color:"#EE6C4D",
    },
    typedContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100vw",
        textAlign: "center",
        zIndex: 1
    },
    subtitle2: {
        color:"#E0FBFC",
    },
    button: {
        marginTop: "1rem",
        backgroundColor: "#1F2632",
        color: "#EE6C4D",
        "&:hover": {
            backgroundColor:"#293241"
        }
    },
    resumeBox: {
        position: "absolute",
        top: "75%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100vw",
        textAlign: "center",
        zIndex: 1
    },
    closeButton: {
        backgroundColor: "#1F2632",
        color: "#EE6C4D",
        "&:hover": {
            backgroundColor:"#293241"
        },
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "5vw",
        textAlign: "center",
        zIndex: 1
    }
}));

const Header = () => {
    const classes = useStyles();
    const [shown, setShown] = React.useState(false);

    return (
        <>
        {shown ? <><PDF src={resume}/> <Button onClick={() => setShown(!shown)} className={classes.closeButton} size="small" color="primary"  on>Close Resume</Button></>: null}
        <Box className={classes.typedContainer} >
            <Grid container justify="center">
                <Avatar className={classes.avatar} src={avatar} alt="Andrew Galvin"></Avatar>
            </Grid>
            <Typography className={classes.title} variant="h4">
                <Typed strings={["Andrew Galvin"]} typeSpeed={40}></Typed>
            </Typography>
            <br/>
            <Typography className={classes.subtitle} variant="h5">
                <Typed 
                strings={["Software Engineer", "Photographer"] }
                typeSpeed={40}
                backSpeed={40}
                loop
                />
            </Typography>
            <br/>
            <Typography className={classes.subtitle2} variant="h6">
                Python | Java | ReactJS | C | SQL | Assembly Language
            </Typography>
            <Button onClick={() => setShown(!shown)} className={classes.button} size="small" color="primary"  on>View Resume</Button>

        </Box>
        </>
    )
}

const PDF = (props) => {
    return <>
    <iframe src={resume} style={{
        position: "absolute",
        top: "15%",
        left: "25%",
        width: "50%",
        height: "75%",
        zIndex:"9999",
        border:"none"
    }} title="Resume" click/>
    </>

    
}

export default Header

