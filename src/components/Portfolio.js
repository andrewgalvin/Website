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
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import project1 from '../images/checkoutlogs.png';
import project2 from '../images/tool.gif';
import project3 from '../images/tickets.png'
import project4 from '../images/connect4.png'
import project5 from '../images/fooji.png'
import project6 from '../images/profilemanager.png'


const useStyles = makeStyles(theme=>({
    mainContainer:{
        background: "#3D5A80",
        height: "100%"
    },
    cardContainer:{
        height: 300,
        width: 350,
        margin: "1rem", // eslint-disable-next-line
        margin: "5rem auto",
        boxShadow: "5px 10px 10px #293241"
    }
}))


const Portfolio = () => {
    const classes = useStyles();

    function handleClick () {
        toast.error("Please contact me to see a demo!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500
          });
      }
        
    return (
        <>
        <Box component="div" className={classes.mainContainer}>
            <Navbar/>
            <Grid container justify="center" spacing={1} >
                {/* Project 1 */}
                <Grid container item xs={5} spacing={10}>
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
                                    Website to monitor checkout logs and Shopify sites bot protection
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" target = "_blank" href = "https://www.nokiny.com"> 
                                    Live Demo
                                </Button>
                                <Button size="small" color="primary" target = "_blank" href = "https://github.com/andrewgalvin/checkout-logs" on>
                                    View Source
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 2 */}
                <Grid container item xs={5} spacing={10}>
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
                                <Button size="small" color="primary" onClick={handleClick}>
                                    Live Demo
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 6 */}
                <Grid container item xs={5} spacing={10}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Profile Manager"
                            height="140"
                            image={project6}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Sneaker Profile Manager
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Create and convert profiles for most sneaker bots
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" target = "_blank" href = "https://github.com/andrewgalvin/DiscordProfileConverter">
                                    View Source
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 3 */}
                <Grid container item xs={5} spacing={10}>
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
                            <CardActions>
                                <Button size="small" color="primary" target = "_blank" href = "https://www.youtube.com/watch?v=WghDFZ097Ys" on>
                                    Live Demo
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 4 */}
                <Grid container item xs={5} spacing={10}>
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
                {/* Project 5 */}
                <Grid container item xs={5} spacing={10}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Fooji Monitor"
                            height="140"
                            image={project5}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Fooji Twitter Monitor
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Monitors tweets for Fooji giveaways and one click tweet to enter
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" target = "_blank" href = "https://twitter.com/WithoutRemorse/status/1386756971559280641">
                                    Example Tweet
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        <ToastContainer />  
        </>
    )
}

export default Portfolio
