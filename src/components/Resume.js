import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Typography, Box} from "@material-ui/core";
import Navbar from "./Navbar";
import Particles from 'react-particles-js'


const useStyles = makeStyles(theme => ({
    mainContainer: {
        background: "#3D5A80"
    },
    timeLine: {
        position: "relative",
        padding: "1rem",
        margin: "0 auto",
        "&:before": {
            content: "''",
            position: "absolute",
            height: "100%",
            border: "1px solid #E0FBFC",
            right: "40px",
            top: 0
        },
        "&:after": {
            content: "''",
            display: "table",
            clear: "both"
        },
        [theme.breakpoints.up('md')]: {
            padding: "2rem",
            "&:before": {
                left: "calc(50% - 1px)",
                right: "auto"
            }
        }
    },
    timeLineItem: {
        padding: "1rem",
        borderBottom: "2px solid #A9D6E5",
        position: "relative",
        margin: "1rem 3rem 1rem 1rem",
        clear: "both",
        "&:after": {
            content: "''",
            position: "absolute"
        },
        "&:before": {
            content: "''",
            position: "absolute",
            right: "-0.625rem",
            top: "calc(50% - 5px)",
            borderStyle: "solid",
            borderColor: "#EE6C4D #EE6C4D transparent transparent",
            borderWidth: "0.625rem",
            transform: "rotate(45deg)"
        },
        [theme.breakpoints.up("md")]: {
            width: "44%",
            margin: "1rem",
            "&:nth-of-type(2n)": {
                float: "right",
                margin: "1rem",
                borderColor: "#A9D6E5"
            },
            "&:nth-of-type(2n):before": {
                right: "auto",
                left: "-0.625rem",
                borderColor: "transparent transparent #EE6C4D #EE6C4D"
            }
        }
    },
    timeLineYear: {
        textAlign: "center",
        maxWidth: "9.375rem",
        margin: "0 3rem 0 auto",
        fontsize: "1.8rem",
        background: "#5A7FAF",
        borderRadius: "10%",
        color: "white",
        lineHeight: 1,
        padding: "0.5rem 0 1rem",
        "&:before": {
            display: "none"
        },
        [theme.breakpoints.up("md")]: {
            textAlign: "center",
            margin: "0 auto",
            "&:nth-of-type(2n)": {
                float: "none",
                margin: "0 auto"
            },
            "&:nth-of-type(2n):before": {
                display: "none"
            }
        }
    },
    heading: {
        color: "#EE6C4D",
        padding: "3rem 0",
        textTransform: "uppercase"
    },
    subHeading: {
        color: "white",
        padding: "0",
        textTransform: "uppercase"
    }
}));

const Resume = () => {
    const classes = useStyles();
    return (
        <>
            <Navbar/>
            <Box className={
                    classes.mainContainer
                }
                component="header">
                <Typography className={
                        classes.heading
                    }
                    variant="h3"
                    align="center">Work Experience</Typography>
                <Box component="div"
                    className={
                        classes.timeLine
                }>
                    <Typography variant="h4"
                        className={
                            classes.timeLineYear + ' ' + classes.timeLineItem
                    }>2016</Typography>
                    <Box component="div" className={classes.timeLineItem}>
                        <Typography variant="h5" align="center" className={classes.subHeading}>
                            Photographer
                        </Typography>
                        <Typography variant="body1" align="center" style={{color: "#EE6C4D"}}>
                            Andrew Galvin Photography
                        </Typography>
                        <Typography variant="subtitle1" align="center" style={{color: "#A9D6E5"}}>
                            Description
                        </Typography>
                    </Box>
                    <Typography variant="h4"
                        className={
                            classes.timeLineYear + ' ' + classes.timeLineItem
                    }>2018</Typography>
                    <Box component="div" className={classes.timeLineItem}>
                        <Typography variant="h5" align="center" className={classes.subHeading}>
                            Merchandise Associate
                        </Typography>
                        <Typography variant="body1" align="center" style={{color: "#EE6C4D"}}>
                            Home Sense
                        </Typography>
                        <Typography variant="subtitle1" align="center" style={{color: "#A9D6E5"}}>
                            Description
                        </Typography>
                    </Box>
                    <Typography variant="h4"
                        className={
                            classes.timeLineYear + ' ' + classes.timeLineItem
                    }>2019</Typography>
                    <Box component="div" className={classes.timeLineItem}>
                        <Typography variant="h5" align="center" className={classes.subHeading}>
                            Summer Intern: Referrals Department
                        </Typography>
                        <Typography variant="body1" align="center" style={{color: "#EE6C4D"}}>
                            Harbor Health Services, Inc
                        </Typography>
                        <Typography variant="subtitle1" align="center" style={{color: "#A9D6E5"}}>
                            Description
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Resume;
