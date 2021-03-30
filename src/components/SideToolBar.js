import React, { useState,useCallback } from 'react';
import {
    Drawer,
    useTheme,
    makeStyles,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@material-ui/core';
import { Category, ChevronLeft } from '@material-ui/icons';
import { BsCollectionPlayFill, BsSearch } from 'react-icons/bs';
import { BiHome } from 'react-icons/bi';
import { TiThMenu as Menu } from 'react-icons/ti';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const SideToolbar = (props) => {

    const styles = useStyles();
    const theme = useTheme()

    // refs

    // States
    const [drawerOpen, setDrawerOpen] = useState(false)

    //methods
    function handelDrawer(){
        // props.changeDrawerValue(!drawerOpen)
        setDrawerOpen(!drawerOpen)
    }

    return (
        <Drawer
            elevation={0}
            classes={{
                paper: clsx({
                    [styles.drawerOpen]:drawerOpen,
                    [styles.drawerColse]:!drawerOpen
                }),
              }}
            className={clsx(styles.drawer,{
                [styles.drawerOpen]:drawerOpen,
                [styles.drawerColse]:!drawerOpen
            })}
            variant="permanent"
        >

            <div className={styles.menueButtonDiv}>
                <IconButton onClick={() => handelDrawer()}>
                    {drawerOpen ? <ChevronLeft style={{ color: "#fff", }} /> : <Menu size={25} style={{ color: "#fff", justifySelf: "center", alignSelf: 'center' }} />}
                </IconButton>
            </div>
            <div className={styles.toolbar}>
                <List className={styles.list} disablePadding={true} style={{ width: "100%" }}>
                    <Tooltip arrow title="Home">

                        <ListItem component={NavLink} to="/Home" activeClassName={styles.active} onClick={() => { }} alignItems="center" button key={"Home"}>
                            <ListItemIcon style={{ padding: 8 }} ><BiHome size={25} style={{ color: "#fff", justifySelf: "center", alignSelf: 'center' }} /></ListItemIcon>
                            {drawerOpen && <ListItemText style={{ color: "#fff", }} primary={"Home"} />}
                        </ListItem>
                    </Tooltip>
                    <Tooltip arrow title="Search">
                        <ListItem component={NavLink} to="/search" activeClassName={styles.active} button key={"Search"}>
                            <ListItemIcon style={{ padding: 8 }} ><BsSearch size={22} style={{ color: "#fff", justifySelf: "center", alignSelf: 'center' }} /></ListItemIcon>
                            {drawerOpen && <ListItemText style={{ color: "#fff", }} primary={"Search"} />}
                        </ListItem>
                    </Tooltip>
                    <Tooltip arrow title="My List">
                        <ListItem component={NavLink} to="/MyList" activeClassName={styles.active} button key={"My List"}>
                            <ListItemIcon style={{ padding: 8 }} ><BsCollectionPlayFill size={22} style={{ color: "#fff", justifySelf: "center", alignSelf: 'center' }} /></ListItemIcon>
                            {drawerOpen && <ListItemText style={{ color: "#fff", }} primary={"My List"} />}
                        </ListItem>
                    </Tooltip>
                    <Tooltip arrow title="Category">
                        <ListItem component={NavLink} to="/Category" activeClassName={styles.active} button key={"Category"}>
                            <ListItemIcon style={{ padding: 8 }} ><Category style={{ color: "#fff", justifySelf: "center", alignSelf: 'center' }} /></ListItemIcon>
                            {drawerOpen && <ListItemText style={{ color: "#fff", }} primary={"Category"} />}
                        </ListItem>
                    </Tooltip>
                </List>
            </div>
        </Drawer>
    )
}

export default SideToolbar;

const useStyles = makeStyles((theme) => ({
    drawer: {
        background: "transparent",
        flexShrink: 0,
        whiteSpace: 'nowrap',

    },
    drawerOpen: {
        background: "transparent",
        width: 200,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerColse: {
        background: "transparent",
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: '60px',
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    menueButtonDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: '12px'
    },
    toolbar: {
        height: '100%',
        display: 'flex',
        alignItems: "center",
    },
    list: {
        '&::-webkit-scrollbar': {
            display: 'none'
        }
    },
    active: {
        background: "#00000040"
    }
}))