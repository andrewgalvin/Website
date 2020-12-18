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
import project1 from '../images/html-css-javascript-lg.jpg';
import project2 from '../images/javascript-fullstack.jpg';
import project3 from '../images/react-redux.jpg'
import project4 from '../images/mern-stack.jpg'


const useStyles = makeStyles(theme=>({
    mainContainer:{
        background: "#3D5A80",
        height: "100%"
    },
    cardContainer:{
        maxWidth: 345,
        margin: "3rem",
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
                            alt="Project 1"
                            height="140"
                            image={project1}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Project 1
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
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
                            alt="Project 2"
                            height="140"
                            image={project2}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Project 2
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Live Demo
                                </Button>
                            </CardActions>
                        </CardActionArea>
                    </Card>
                </Grid>
                {/* Project 3 */}
                <Grid item xs={12} sm={9} md={6}>
                    <Card className={classes.cardContainer}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Project 3"
                            height="140"
                            image={project3}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Project 3
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
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
                            alt="Project 4"
                            height="140"
                            image={project4}
                            />
                            <CardContent>
                                <Typography
                                    gutterButtom variant="h5"
                                >
                                    Project 4
                                </Typography>
                                <Typography
                                    gutterButtom variant="body2" color="textSecondary" component="p"
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Live Demo
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