import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import Navbar from "./Navbar";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Work from '@material-ui/icons/Work'
import School from '@material-ui/icons/School'
import Star from '@material-ui/icons/Star'
import Particles from 'react-particles-js'

const useStyles = makeStyles(theme => ({
    mainContainer: {
        background: "#B5D2E3"
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

const Resume = () => {
    const classes = useStyles()

      
    return (
        <Box className={classes.mainContainer}>
            <Navbar/>
            <Particles canvasClassName={classes.particles}>
                params={{
                    particles:{
                        number:{
                            value: 45,
                            density: {
                                enable: true,
                                value_area: 900
                            }
                        },
                        size:{
                            value: 8,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 6,
                                size_min: 0.1,
                                sync: true
                            }
                        },
                        opacity: {
                            value:1,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: true
                            }
                        }
                    }
                }}
            </Particles>
            <VerticalTimeline >
            <VerticalTimelineElement
                className="vertical-timeline-element--education"
                contentStyle={{ background: '#98c1d9', color: 'black' }}
                iconStyle={{ background: '#293241', color: '#fff' }}
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
                contentStyle={{ background: '#98c1d9', color: 'black' }}
                contentArrowStyle={{ borderRight: '7px solid  #98C1D9' }}
                iconStyle={{ background: '#293241', color: '#fff' }}
                icon={<Work />}
                date="Jan 2021 - Present"
            >
                <h3 className="vertical-timeline-element-title">IT Support Specialist</h3>
                <h4 className="vertical-timeline-element-subtitle">Baystate Physical Therapy, Braintree, MA</h4>
                <p>
                Researched and implemented new software to improve customer support
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#293241', color: '#fff' }}
                contentStyle={{color: 'black'}}
                icon={<Work />}
                date="Aug 2016 - Present"
            >
                <h3 className="vertical-timeline-element-title">Photographer</h3>
                <h4 className="vertical-timeline-element-subtitle">Andrew Galvin Photography, Weymouth, MA</h4>
                <p>
                Specialize in senior and professional portraits
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                contentStyle={{color: 'black'}}
                icon={<Work />}
                date="May 2018 - Jan 2021"
            >
                <h3 className="vertical-timeline-element-title">Merchandise Associate</h3>
                <h4 className="vertical-timeline-element-subtitle">Home Sense, Braintree, MA</h4>
                <p>
                Key contributor to the successful opening of a new store
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                contentStyle={{color: 'black'}}
                icon={<Work />}
                date="May 2019 - Aug 2019"
            >
                <h3 className="vertical-timeline-element-title">Summer Intern: Referrals Department</h3>
                <h4 className="vertical-timeline-element-subtitle">Harbor Health Services, Brockton, MA</h4>
                <p>
                Assisted patients with obtaining medical referrals
                </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
                className="vertical-timeline-element--work"
                iconStyle={{ background: '#EE6C4D', color: '#fff' }}
                contentStyle={{color: 'black'}}
                icon={<Work />}
                date="June 2016 - Sept 2018"
            >
                <h3 className="vertical-timeline-element-title">Prep Cook</h3>
                <h4 className="vertical-timeline-element-subtitle">Olympic Pizza, Weymouth, MA</h4>
                <p>
                Prepared food vital for day to day business
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
