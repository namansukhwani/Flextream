import React, { useEffect, useState } from 'react';
import {
    useTheme,
    makeStyles,
    Container,
    Typography,
    Button,
    Paper,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FiArrowRight } from 'react-icons/fi'
import { IoIosRefreshCircle } from 'react-icons/io'
import { AiFillPlayCircle, AiFillPlusCircle, AiFillStar } from 'react-icons/ai';
import { Languages } from '../Data/languages';
import Carousel from 'react-material-ui-carousel';
import { NavLink } from 'react-router-dom';

const url_link = "https://yts.mx/api/v2/";

const RecentlyAddedList = (props) => {

    const styles = useStyles();
    const theme = useTheme

    // refs

    // States
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    //lifecycle
    useEffect(() => {
        fetchRecentlyAdded();
    }, [])

    //methods
    async function fetchRecentlyAdded() {

        let url = new URL(url_link + 'list_movies.json')

        const params = {
            limit: 5,
            sort_by: 'date_added',
            minimum_rating: 7.5,
            // sort_by:'like_count'
        }

        if (params != null) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        }

        fetch("https://vpn-api.herokuapp.com/fetch",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':"*"
            },
            body:JSON.stringify({
                url:url,
                username:"Hitman12355",
                password:"qwerty123456"
            })
        })
            .then(resp => resp.json())
            .then(data => {
                // tempList=data.data.movies
                // console.log(data);
                const promises = data.data.movies.map(movie => {
                    return fetch("https://vpn-api.herokuapp.com/fetch",{
                        method:"POST",
                        headers:{
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':"*"
                        },
                        body:JSON.stringify({
                            url:url_link + `movie_details.json?movie_id=${movie.id}&with_images=true&with_cast=true`,
                            username:"Hitman12355",
                            password:"qwerty123456"
                        })
                    })
                        .then(resp => { return resp.json() })
                        .catch(err => console.log("ERROR::", err))
                })

                Promise.all(promises).then(results => {
                    const tempData = results.map(result => result.data.movie)
                    setData(tempData);
                    setIsLoading(false);
                    console.log(tempData);
                })
                    .catch(err => console.log("ERROR::", err))
            })
            .catch(err => {
                console.log('ERROR::', err);
                setTimeout(()=>{
                    fetchRecentlyAdded()
                },5000)
                // fetchRecentlyAdded()
            })

    }

    const MovieView = ({ movie, index }) => {
        return (
            <Container className={styles.newMovieCon} key={index} style={{ backgroundImage: `url(${"https://vpn-api.herokuapp.com/fetch/image?url="+movie.large_screenshot_image2})`, }} maxWidth="xl">
                <Container maxWidth='xl' className={styles.movieConFilter}>
                    <Paper elevation={10} className={styles.movieCoverCon}>
                        <Typography className={styles.rating}>{movie.rating + "/10"}<AiFillStar style={{ color: "#ffd700" }} /></Typography>
                        <img src={"https://vpn-api.herokuapp.com/fetch/image?url="+movie.medium_cover_image} style={{ objectFit: 'fill', width: '100%', height: '100%' }} />
                    </Paper>
                    <Container maxWidth="xl" className={styles.movieDetails}>
                        <Typography className={styles.movieTitle} variant="h4" component="h2">{movie.title}</Typography>
                        <Typography className={styles.movieSubtitle} >
                            {movie.year + " . " + Languages[movie.language] + " . " + String(movie.runtime) + " min . " + movie.genres.map((genre) => { return String(genre) + " " })}
                        </Typography>
                        <div style={{ width: "60%", height: '110px', overflow: "hidden", textOverflow: 'ellipsis', lineHeight: "20px", marginBottom: "10px" }}>
                            <Typography className={styles.movieDescription}>{movie.description_intro}</Typography>
                        </div>
                        <Container className={styles.playButtons}>
                            <Button
                                variant="contained"
                                style={{ marginRight: '15px', marginBottom: "15px" }}
                                size="large"
                                startIcon={<AiFillPlayCircle style={{ color: "#000" }} />}
                                component={NavLink}
                                to={{
                                    pathname:`/videoPlayer/${movie.id}`,
                                    state:movie
                                }}
                            >
                                Play
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ color: "#fff", borderColor: "#fff", marginBottom: "15px" }}
                                size="large"
                                startIcon={<AiFillPlusCircle style={{ color: "#fff" }} />}
                            >
                                Add to My list
                            </Button>
                        </Container>
                    </Container>
                </Container>
            </Container>
        )
    }

    return (
        <div style={{paddingInline:"15px"}}>
            <Container className={styles.titleContainer} maxWidth="xl">
                <Typography className={styles.title}><IoIosRefreshCircle style={{ marginRight: 2 }} size={23} />Recently Added Movies</Typography>
                <Button
                    variant="text"
                    color="default"
                    endIcon={<FiArrowRight style={{ color: "#fff" }} />}
                    className={styles.titleButton}
                    component={NavLink}
                    disabled={isLoading}
                    to={{
                        pathname:'/viewMore/recentlyAdded',
                        state:{
                            parameters:{
                                limit: 5,
                                sort_by: 'date_added',
                                minimum_rating: 7.5,
                                genre:""
                                // sort_by:'like_count'
                            },
                            title:"Recently Added",
                            // headingIcon:IoIosRefreshCircle,
                            backgroundImage:(isLoading ? "": data[0].background_image_original)
                        }
                    }}
                >
                    View More
                    </Button>
            </Container>
            {isLoading ?
                <Container className={styles.newMovieCon} maxWidth="xl">
                    <Container maxWidth='xl' className={styles.movieConFilter} style={{background:"#ffffff00 "}}>
                        <Skeleton animation="wave" className={styles.movieCoverCon} variant="rect" />
                        <Container maxWidth="xl" className={styles.movieDetails} >
                            <Skeleton animation="wave" variant="rect" style={{ width: "350px", height: 40,marginBottom:"5px" }} />
                            <Skeleton animation="wave" variant="text" style={{ width: "300px", height: 10 ,marginBottom:"20px"}} />
                            <div style={{ width: "60%", height: '110px', overflow: "hidden", textOverflow: 'ellipsis', lineHeight: "20px", marginBottom: "10px" }}>
                                <Skeleton animation="wave" variant="text" style={{ width: "500px", height: "20px" }} />
                                <Skeleton animation="wave" variant="text" style={{ width: "500px", height: "20px" }} />
                                <Skeleton animation="wave" variant="text" style={{ width: "500px", height: "20px" }} />
                                <Skeleton animation="wave" variant="text" style={{ width: "500px", height: "20px" }} />
                                <Skeleton animation="wave" variant="text" style={{ width: "500px", height: "20px" }} />
                            </div>
                            <Container className={styles.playButtons}>
                                <Skeleton animation="wave" variant="rect" style={{width:'110px',height:"50px",borderRadius:"10px",margin:'5px'}} />
                                <Skeleton animation="wave" variant="rect" style={{width:'150px',height:"50px",borderRadius:"10px",margin:'5px'}} />
                            </Container>
                        </Container>
                    </Container>
                </Container>
                :
                <Carousel
                    autoPlay={true}
                    interval={7000}
                    stopAutoPlayOnHover={true}
                    indicators={true}
                    navButtonsAlwaysInvisible={true}
                >
                    {
                        data.map((movie, index) => {
                            return <MovieView key={index.toString()} movie={movie} index={index} />
                        })
                    }
                </Carousel>

            }
        </div>
    )
}

export default RecentlyAddedList;

const useStyles = makeStyles((theme) => ({
    titleContainer: {
        // width:"inherit",
        height: '40px',
        padding: 0,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        color: '#fff',
        fontSize: "17px",
        display: "flex",
        alignItems: "center"
    },
    titleButton: {
        textTransform: 'capitalize',
        color: '#e8e8e8',
        fontWeight: 'normal',
        float: 'right',
        fontSize: "15px",
    },
    newMovieCon: {
        borderRadius: '10px',
        // width:"97%",
        minWidth: "500px",
        minHeight: "300px",
        height: '50%',
        padding: 0,
        backgroundRepeat: "no-repeat",
        backgroundSize: 'cover',
        overflow: "hidden",
        position: "relative"
    },
    movieConFilter: {
        background: " linear-gradient(153deg, rgba(24,27,37,99) 34%, rgba(19,23,33,0.8886905103838411) 59%, rgba(0,0,0,0) 100%)  !important",
        height: "100%",
        width: "100%",
        margin: 0,
        padding: '10px',
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        // zIndex:-10
    },
    movieCoverCon: {
        minWidth: '160px',
        width: "14%",
        height: "100%",
        borderRadius: "10px",
        display: 'flex',
        alignItems: "center",
        overflow: "hidden",
        padding: 0,
        position: "relative",
        background:"transparent"
    },
    movieDetails: {
        height: "100%",
        width: '84%',
        margin: 1,
        padding: "2px 20px 2px 10px",
        position: "relative",
        display: "flex",
        flexDirection: "column"
    },
    movieTitle: {
        color: "#fff",
        fontWeight: "500",
    },
    movieSubtitle: {
        fontSize: '14px',
        color: '#fff',
    },
    movieDescription: {
        fontSize: "16px",
        // width:"60%",
        marginTop: "10px",
        color: "#c2c2c2",
        // height:"110px",
        // overflow:"hidden",
        textOverflow: "ellipsis",
        // // whiteSpace:"nowrap"
    },
    playButtons: {
        padding: 6,
        display: "flex",
        bottom: 0,
        position: "absolute",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    rating: {
        color: "#fff",
        fontSize: "14px",
        color: "#fff",
        position: "absolute",
        top: "5px",
        left: "5px",
        justifyContent: "center",
        display: 'flex',
        alignItems: "center",
        fontWeight: "400",
        background: "#00000060",
        borderRadius: '5px',
        padding: "0px 3px 0px 3px"
    },


}))