import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {
    Box,
    Grid,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography
} from '@material-ui/core'
import Navbar from './Navbar';
import project1 from '../images/checkoutlogs.png';
import project2 from '../images/tool.gif';
import project3 from '../images/tickets.png'
import project4 from '../images/connect4.png'


const useStyles = makeStyles(theme=>({
    mainContainer:{
        background: "#3D5A80",
        height: "100%"
    },
    cardContainer:{
        maxWidth: 345,
        margin: "3rem", // eslint-disable-next-line
        margin: "5rem auto"
    }
}))


const Portfolio = () => {
    const classes = useStyles();

    return (
        <>
        <Box component="div" className={classes.mainContainer}>
            <Navbar/>
            <Grid container justify="center" >
                {/* Project 1 */}
                <Grid item xs={12} sm={9} md={6}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Bot Checkout Logs"
                            height="140"
                            image={project1}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Sneaker Bot Checkout Logs
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Website to monitor checkout logs as well as Shopify sites
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" target = "_blank" href = "https://nokiny.com"> 
                                    Live Demo
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 2 */}
                <Grid item xs={12} sm={9} md={6}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Supreme Tool"
                            height="140"
                            image={project2}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Supreme Tool
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Tool with auth API to add items to cart in milliseconds
                                </Typography>
                            </CardContent>
                            {/* <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Live Demo
                                </Button>
                            </CardActions> */}
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 3 */}
                <Grid item xs={12} sm={9} md={6}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Discord Ticket Tool"
                            height="140"
                            image={project3}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Discord Ticket Tool
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Decision tree automated ticket tool and logging
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary" >
                                    Live Demo
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 4 */}
                <Grid item xs={12} sm={9} md={6}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Connect 4"
                            height="140"
                            image={project4}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Connect 4
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Connect 4 using Java and Scenebuilder
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" target = "_blank" href = "https://github.com/andrewgalvin/Connect4">
                                    View Source
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        </>
    )
}

export default Portfolio
