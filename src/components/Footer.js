import React from 'react'
import {makeStyles} from '@material-ui/styles'
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core'
import GitHub from '@material-ui/icons/GitHub'
import LinkedIn from '@material-ui/icons/LinkedIn'
import PhotoCamera from '@material-ui/icons/PhotoCamera'

const useStyles = makeStyles({
    root: {
        "& .MuiBottomNavigationAction-root":{
            minWidth: 0,
            maxWidth: 250
        },
        "& .MuiSvgIcon-root": {
            fill: "#E0FBFC",
            "&:hover":{
                fill: "#3D5A80",
                fontSize: "1.8rem"
            }
        }
    }
})

const Footer = () => {
    const classes = useStyles();
    return (
            <BottomNavigation width="auto" style={{background:"#293241"}}>
                <BottomNavigationAction
                    className={classes.root}
                    style={{padding:0}}
                    icon={<GitHub/>}
                    target = "_blank"
                    href = "https://github.com/andrewgalvin"
                />
                <BottomNavigationAction
                    className={classes.root}
                    style={{padding:0}}
                    icon={<LinkedIn/>}
                    target = "_blank"
                    href = "https://www.linkedin.com/in/andrew-galvin-0000001/"
                />
                <BottomNavigationAction
                    className={classes.root}
                    style={{padding:0}}
                    icon={<PhotoCamera/>}
                    target = "_blank"
                    href = "https://www.andrewgalvin.net"
                />
            </BottomNavigation>
    )
}

export default Footer
