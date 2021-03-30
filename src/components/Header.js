import React, {  } from 'react';
import {
    AppBar,
    makeStyles,
    Slide,
    Toolbar,
    useScrollTrigger,
    Container,
    Typography,
    Tooltip,
    Button,

} from '@material-ui/core';
import { AiFillInfoCircle } from 'react-icons/ai';
import { Category } from '@material-ui/icons';
import { BsCollectionPlayFill, BsSearch } from 'react-icons/bs';
import { BiHome } from 'react-icons/bi';
// import { TiThMenu as Menu } from 'react-icons/ti';
import { NavLink } from 'react-router-dom';

function HideOnScroll(props) {

    const { children } = props;

    const trigger = useScrollTrigger()

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    )
}

const Header = (props) => {
    const styles = useStyles();

    //refs

    //states

    //lifecycle

    //methods

    return (
        <HideOnScroll {...props}>
            <AppBar color='transparent' className={styles.AppBar} elevation={0}>
                <Toolbar>
                    <Container className={styles.blackBar} maxWidth="lg">
                        <Typography className={styles.heading} variant="h4" component="h2">
                            Flextream
                        </Typography>
                        <Tooltip arrow title="Home">
                            <Button
                                className={styles.button}
                                variant="contained"
                                disableElevation={true}
                                component={NavLink}
                                to="/Home"
                                activeClassName={styles.active}
                            >
                                <BiHome size={25} />
                                Home
                            </Button>
                        </Tooltip>
                        <Tooltip arrow title="Search">
                            <Button
                                className={styles.button}
                                variant="contained"
                                disableElevation={true}
                                component={NavLink}
                                to="/search"
                                activeClassName={styles.active}
                            >
                                <BsSearch size={25} />
                                Search
                            </Button>
                        </Tooltip>
                        <Tooltip arrow title="My List">
                            <Button
                                className={styles.button}
                                variant="contained"
                                disableElevation={true}
                                component={NavLink}
                                to="/MyList"
                                activeClassName={styles.active}
                            >
                                <BsCollectionPlayFill size={25} />
                                My List
                            </Button>
                        </Tooltip>
                        <Tooltip arrow title="Category">
                            <Button
                                className={styles.button}
                                variant="contained"
                                disableElevation={true}
                                component={NavLink}
                                to="/Category"
                                activeClassName={styles.active}
                            >
                                <Category size={25} />
                                Category
                            </Button>
                        </Tooltip>
                        {/* <Tooltip arrow title="About"> */}
                            <AiFillInfoCircle size={55} style={{ color: "#000", background: '#ffffff30', borderRadius: '30px', padding: '10px' }} />
                        {/* </Tooltip> */}
                    </Container>

                    {/* <AiFillInfoCircle style={{ color: '#fff', }} size={33} onClick={() => { }} /> */}
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
}

export default Header;

const useStyles = makeStyles((theme) => ({
    heading: {
        fontFamily: "Chilanka,cursive",
        fontWeight: 'bold',
        color: '#000',
        background: 'linear-gradient(to right top, #fc00ff99, #00dbde);',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: '10px 10px 0px 10px',
        borderRadius: '35px',
        height: "53px",
        // borderTopLeftRadius:"30px"
    },
    AppBar: {
        justifyContent: "center",
        alignItems: "center"
    },
    blackBar: {
        // width:'1000px',
        background: "#ffffff30",
        height: '55px',
        marginTop: "7px",
        borderRadius: '35px',
        boxShadow: '0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)',
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: '1px',
        overflow: "hidden"
    },
    button: {
        background: "transparent",
        fontWeight: "bold",
        color: "#000",
        textTransform: 'capitalize',
        fontSize: "18px",
        height: '53px',
        // paddingInline:'px',
        borderRadius: '30px',
        alignItems: "center"
    },
    active: {
        background: '#000',
        color: '#fff',
        '&:hover': {
            background: "#000"
        }
    }
}))