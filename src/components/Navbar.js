import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MobileRightMenuSlider from "@material-ui/core/Drawer"
import {
    AppBar,
    Toolbar,
    ListItem,
    IconButton,
    ListItemText,
    ListItemIcon,
    Avatar,
    Box,
    List,
    Divider,
    Container
} from "@material-ui/core"
import {
    AssignmentInd,
    Home,
    Apps,
    ContactMail
} from "@material-ui/icons"
import MenuIcon from '@material-ui/icons/Menu';
import avatar from "../avatar.png"
import Footer from "./Footer"


// Create CSS Styles
const useStyles = makeStyles(theme=>({
    menuSliderContainer: {
        width: 250,
        background: "#3D5A80",
        height: "100%"
    },
    avatar: {
        display: "block",
        margin: "0.5rem auto",
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    listItem: {
        color: "#E0FBFC"
    },
    linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `#EE6C4D`
  },
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`
  },
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`
  }
}));

const menuItems = [
    {
        listIcon: <Home/>,
        listText: "Home",
        listPath: "/"
    },
    {
        listIcon: <AssignmentInd/>,
        listText: "Resume",
        listPath: "/resume"
    },
    {
        listIcon: <Apps/>,
        listText: "Portfolio",
        listPath: "/portfolio"
    },
    {
        listIcon: <ContactMail/>,
        listText: "Contact",
        listPath: "/contact-me"
    }
]

const Navbar = () => {
    const [state, setState] = useState({
        right: false
    })

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        function handleResize() {
          setWindowWidth(window.innerWidth)
        }
    
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }, [])

    const toggleSlider = (slider, open) => () => {
        setState({...state, [slider]: open});
    }

    const classes = useStyles()

    const navLinks = [
        { title: `portfolio`, path: `/portfolio` },
        { title: `resume`, path: `/resume` },
        { title: `contact`, path: `/contact-me` },
      ];

    const sideList = slider => (
        <Box 
        className={classes.menuSliderContainer}
        component="div"
        onClick={toggleSlider("right",false)}
        >
            <Avatar className={classes.avatar} src={avatar} alt="Andrew Galvin"></Avatar>
            <Divider/>
            <List>
                {menuItems.map((lsItem, key)=>(
                    <ListItem button key={key} component={Link} to={lsItem.listPath}>
                    <ListItemIcon className={classes.listItem}>{lsItem.listIcon}</ListItemIcon>
                    <ListItemText className={classes.listItem} primary={lsItem.listText} />
                    </ListItem>
                ))}
            </List>
        </Box>
    )
    
    return (
        <Box component="nav">
            <AppBar position="static" style={{background:"#293241"}}>
                <Toolbar>
                    <Container maxWidth="md" className={classes.navbarDisplayFlex}>
                        <IconButton component={Link} to="/" edge="start" color="inherit" aria-label="home">
                            <Home fontSize="large" style={{color:"#EE6C4D"}}/>
                        </IconButton>

                        {windowWidth<600 ? 
                            <IconButton onClick={toggleSlider("right", true)}>
                                    <MenuIcon style={{color:"#EE6C4D"}}/>
                            </IconButton> : 
                                <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
                                    {navLinks.map(({ title, path }) => (
                                        // <a key={title} className={classes.linkText}>
                                            <ListItem button component={Link} to={path}>
                                            <ListItemText className={classes.linkText}primary={title} />
                                            </ListItem>
                                        // </a>
                                    ))}
                                </List>
                        }

                        <MobileRightMenuSlider 
                            anchor="right"
                            open={state.right}
                            onClose={toggleSlider("right", false)}>
                                {sideList("right")}
                            <Footer/>
                        </MobileRightMenuSlider>
                    </Container>
                </Toolbar>
            </AppBar>
        </Box>
        // <>
        
        // <Box component="nav">
        //     <AppBar position="static" style={{background:"#293241"}}>
        //         <Toolbar>
        //             <Container style= {{
        //                 display: 'flex',
        //                 justifyContenr: 'space-between'
        //             }}>
        //                 <IconButton aria-label="home" component={Link} to="/">
        //                     <HomeIcon style={{color:"#EE6C4D"}}/>
        //                 </IconButton>
        //                 <List
        //                     component="nav"
        //                     aria-labelledby="main navigation"
        //                     style={{
        //                         display: "flex",
        //                         justifyContent: "space-between"
        //                     }}
        //                 >
        //                     {navLinks.map(({ title, path }) => (
        //                     <a href={path} key={title} className={classes.linkText}>
        //                         <ListItem button>
        //                         <ListItemText primary={title} />
        //                         </ListItem>
        //                     </a>
        //                     ))}
        //                 </List>
                        // <Grid container justify="flex-end">
                        //     <IconButton onClick={toggleSlider("right", true)}>
                        //         <MenuIcon style={{color:"#EE6C4D"}}/>
                        //     </IconButton>
                        // </Grid>
                        // <MobileRightMenuSlider 
                        // anchor="right"
                        // open={state.right}
                        // onClose={toggleSlider("right", false)}>
                        //     {sideList("right")}
                        //     <Footer/>
                        // </MobileRightMenuSlider>
        //             </Container>
                    
        //         </Toolbar>
        //     </AppBar>
        // </Box>
        // </>
    )
}

export default Navbar;
