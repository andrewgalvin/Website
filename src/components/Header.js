import React, { useState, useRef } from 'react'
import {
    Typography,
    Avatar,
    Grid,
    Box
} from "@material-ui/core"
import Typed from 'react-typed'
import {makeStyles} from "@material-ui/core"
import avatar from '../avatar.png'
import { useSpring, animated } from 'react-spring';

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
    column: {
        display: "flex",
        flex: "1 1 auto",
        padding: "10px",
        width: "100%",
        justifyContent:"center"
    },
    card: {
        display: "flex",
        flexDirection: "column",
        padding: "40px",
        backgroundColor: "#98C1D9",
        boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.3)",
        transition: "box-shadow 0.5s",
        willChange: "transform",
        margin:"10px",
        width:"15%",
        height:"50%",
        color:"#FFFFFF",
        borderRadius: "10px"
    }
}));

function Card({ children }) {
    // We add this ref to card element and use in onMouseMove event ...
    // ... to get element's offset and dimensions.
    const ref = useRef();
    const classes = useStyles()
    // Keep track of whether card is hovered so we can increment ...
    // ... zIndex to ensure it shows up above other cards when animation causes overlap.
    const [isHovered, setHovered] = useState(false);
  
    const [animatedProps, setAnimatedProps] = useSpring(() => {
      return {
        // Array containing [rotateX, rotateY, and scale] values.
        // We store under a single key (xys) instead of separate keys ...
        // ... so that we can use animatedProps.xys.interpolate() to ...
        // ... easily generate the css transform value below.
        xys: [0, 0, 1],
        // Setup physics
        config: { mass: 10, tension: 400, friction: 40, precision: 0.00001 }
      };
    });
  
    return (
      <animated.div
        ref={ref}
        className={classes.card}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={({ clientX, clientY }) => {
          // Get mouse x position within card
          const x =
            clientX -
            (ref.current.offsetLeft -
              (window.scrollX || window.pageXOffset || document.body.scrollLeft));
  
          // Get mouse y position within card
          const y =
            clientY -
            (ref.current.offsetTop -
              (window.scrollY || window.pageYOffset || document.body.scrollTop));
  
          // Set animated values based on mouse position and card dimensions
          const dampen = 50; // Lower the number the less rotation
          const xys = [
            -(y - ref.current.clientHeight / 2) / dampen, // rotateX
            (x - ref.current.clientWidth / 2) / dampen, // rotateY
            1.07 // Scale
          ];
  
          // Update values to animate to
          setAnimatedProps({ xys: xys });
        }}
        onMouseLeave={() => {
          setHovered(false);
          // Set xys back to original
          setAnimatedProps({ xys: [0, 0, 1] });
        }}
        style={{
          // If hovered we want it to overlap other cards when it scales up
          zIndex: isHovered ? 2 : 1,
          // Interpolate function to handle css changes
          transform: animatedProps.xys.interpolate(
            (x, y, s) =>
              `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
          )
        }}
      >
        {children}
      </animated.div>
    );
  }

var languages = [
    "Python",
    "Java",
    "ReactJS",
    "C",
    "SQL",
    "Assembly"
]

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
            <br/>
            <br/>
            <br/>
            <Typography className={classes.subtitle2} variant="h6">
                Programming Languages
            </Typography>
            <div className={classes.column}>
                {languages.map(item => (
                    <Card>
                        <Typography className={classes.subtitle2} variant="h6">{item}</Typography>
                    </Card>
                ))}
            </div>
            
        </Box>
    )
}

export default Header

