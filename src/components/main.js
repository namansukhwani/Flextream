import React, { useState } from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom'
import { makeStyles, useTheme,CssBaseline } from '@material-ui/core';
import Home from './Home';
import MyList from './MyList';
import Search from './Search';
import Category from './Category';
import SideToolbar from './SideToolBar';
import VideoPlayer from './VideoPlayer';
import Header from './Header';
import ViewMore from './ViewMore';
// import DetailedMovieView from './DetailedMovieView';

const Main = () => {

    const styles = useStyles();
    const theme = useTheme()

    //states
    // const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    // console.log("Drawer ki chutiya value", isDrawerOpen);
    return (
        <div className={styles.root}>
            <CssBaseline/>
            {/* <SideToolbar changeDrawerValue={(value) => { setIsDrawerOpen(value) }} /> */}
            <Header/>
            <main className={styles.main}>
                {/* <div className={styles.toolbar}> */}
                    <Switch>
                        <Redirect path="/" exact to="/Home" />
                        <Route exact path="/Home" component={Home} />
                        <Route path="/search" component={Search} />
                        <Route path="/MyList" component={MyList} />
                        <Route path="/Category" component={Category} />
                        <Route exact path="/videoPlayer/:movieId" component={VideoPlayer} />
                        <Route exact path="/viewMore/:mainTitle" component={ViewMore}/>
                        <Redirect to="/Home" />
                    </Switch>
                {/* </div> */}
            </main>
        </div>

    )
}

export default Main;

const useStyles = makeStyles((theme) => ({
    root: {
        WebkitUserSelect: "none",
        MozUserSelect: 'none',
        msUserSelect: "none",
        userSelect: "none",
        // width: '100vw',
        height: '100%',
        display: 'flex',
        // flexDirection:"row",
        // flexWrap:'wrap'
    },
    main: {
        height: "100%",
        width: '100%',
        flexGrow: 1,
        paddingTop:"70px"
        // display:"flex",
        // padding:theme.spacing(3)
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },

}))