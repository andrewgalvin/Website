import React, {useState} from 'react';
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
    Typography,
    Divider,
    Grid
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

    const toggleSlider = (slider, open) => () => {
        setState({...state, [slider]: open});
    }

    const classes = useStyles()

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
        <>
        
        <Box component="nav">
            <AppBar position="static" style={{background:"#293241"}}>
                <Toolbar>
                    <Typography variant="h5" >
                        <Link to="/" style={{textDecoration: 'none',color:"white"}} variant="inherit">
                            Portfolio
                        </Link>
                    </Typography>
                    <Grid container justify="flex-end">
                        <IconButton onClick={toggleSlider("right", true)}>
                            <MenuIcon style={{color:"#EE6C4D"}}>

                            </MenuIcon>
                        </IconButton>

                    </Grid>
                    <MobileRightMenuSlider 
                    anchor="right"
                    open={state.right}
                    onClose={toggleSlider("right", false)}>
                        {sideList("right")}
                        <Footer/>
                    </MobileRightMenuSlider>
                </Toolbar>
            </AppBar>
        </Box>
        </>
    )
}

export default Navbar;
