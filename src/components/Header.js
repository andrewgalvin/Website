import React from 'react'
import {
    Typography,
    Avatar,
    Grid,
    Box
} from "@material-ui/core"
import Typed from 'react-typed'
import {makeStyles} from "@material-ui/core"
import avatar from '../avatar.png'
import { TextFormatOutlined } from '@material-ui/icons'

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
        marinBottom:"3rem"
    },
    typedContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100vw",
        textAlign: "center",
        zIndex: 1
    }
}));

const Header = () => {
    const classes = useStyles();

    return (
        <Box className={classes.typedContainer}>
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
        </Box>
    )
}

export default Header
