import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import Navbar from "./Navbar";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Work from '@material-ui/icons/Work'
import School from '@material-ui/icons/School'
import Star from '@material-ui/icons/Star'


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
    },
    particles:{
        position: "absolute",
    }
}));

// const Resume = () => {
//     const classes = useStyles();
//     return (
//         <>
//             <Navbar/>
//             <Box className={
//                     classes.mainContainer
//                 }
//                 component="header">
//                 <Typography className={
//                         classes.heading
//                     }
//                     variant="h3"
//                     align="center">Work Experience</Typography>
//                 <Box component="div"
//                     className={
//                         classes.timeLine
//                 }>
//                     <Typography variant="h4"
//                         className={
//                             classes.timeLineYear + ' ' + classes.timeLineItem
//                     }>2016</Typography>
//                     <Box component="div" className={classes.timeLineItem}>
//                         <Typography variant="h5" align="center" className={classes.subHeading}>
//                             Photographer
//                         </Typography>
//                         <Typography variant="body1" align="center" style={{color: "#EE6C4D"}}>
//                             Andrew Galvin Photography
//                         </Typography>
//                         <Typography variant="subtitle1" align="center" style={{color: "#A9D6E5"}}>
//                             Description
//                         </Typography>
//                     </Box>
//                     <Typography variant="h4"
//                         className={
//                             classes.timeLineYear + ' ' + classes.timeLineItem
//                     }>2018</Typography>
//                     <Box component="div" className={classes.timeLineItem}>
//                         <Typography variant="h5" align="center" className={classes.subHeading}>
//                             Merchandise Associate
//                         </Typography>
//                         <Typography variant="body1" align="center" style={{color: "#EE6C4D"}}>
//                             Home Sense
//                         </Typography>
//                         <Typography variant="subtitle1" align="center" style={{color: "#A9D6E5"}}>
//                             Description
//                         </Typography>
//                     </Box>
//                     <Typography variant="h4"
//                         className={
//                             classes.timeLineYear + ' ' + classes.timeLineItem
//                     }>2019</Typography>
//                     <Box component="div" className={classes.timeLineItem}>
//                         <Typography variant="h5" align="center" className={classes.subHeading}>
//                             Summer Intern: Referrals Department
//                         </Typography>
//                         <Typography variant="body1" align="center" style={{color: "#EE6C4D"}}>
//                             Harbor Health Services, Inc
//                         </Typography>
//                         <Typography variant="subtitle1" align="center" style={{color: "#A9D6E5"}}>
//                             Description
//                         </Typography>
//                     </Box>
//                 </Box>
//             </Box>
//         </>
//     )
// }

const Resume = () => {
    const classes = useStyles()
    return (
        <Box className={classes.mainContainer}>
            <Navbar/>
            <VerticalTimeline >
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: '#98C1D9', color: 'black' }}
                contentArrowStyle={{ borderRight: '7px solid  #98C1D9' }}
                iconStyle={{ background: '#98C1D9', color: '#fff' }}
                icon={<Work />}
            >
                <h3 className="vertical-timeline-element-title">IT Support Specialist | Braintree, MA</h3>
                <h4 className="vertical-timeline-element-subtitle">Jan 2021 - Apr 2021</h4>
                <p>
                [INSERT DESCRIPTION HERE]
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--education"
                iconStyle={{ background: '#98C1D9', color: '#fff' }}
                icon={<School />}
            >
                <h3 className="vertical-timeline-element-title">Bachelor of Computer Science</h3>
                <h4 className="vertical-timeline-element-subtitle">Expected Gruaduation: Aug 2022</h4>
                <p>
                Wentworth Institute of Technology 
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                icon={<Work />}
            >
                <h3 className="vertical-timeline-element-title">Merchandise Associate | Braintree, MA</h3>
                <h4 className="vertical-timeline-element-subtitle">May 2018 - Jan 2-21</h4>
                <p>
                [INSERT DESCRIPTION HERE]
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                icon={<Work />}
            >
                <h3 className="vertical-timeline-element-title">Photographer | Weymouth, MA</h3>
                <h4 className="vertical-timeline-element-subtitle">Aug 2016 - Present</h4>
                <p>
                [INSERT DESCRIPTION HERE]
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                icon={<Work />}
            >
                <h3 className="vertical-timeline-element-title">Summer Intern: Referrals Department | Brockton, MA</h3>
                <h4 className="vertical-timeline-element-subtitle">May 2019 – Aug 2019</h4>
                <p>
                [INSERT DESCRIPTION HERE]
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                icon={<Work />}
            >
                <h3 className="vertical-timeline-element-title">Prep Cook | Weymouth, MA</h3>
                <h4 className="vertical-timeline-element-subtitle">June 2016 - Sept 2018</h4>
                <p>
                [INSERT DESCRIPTION HERE]
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                icon={<Star />}
            />
            </VerticalTimeline>
        </Box>
        
    )
}

export default Resume;
