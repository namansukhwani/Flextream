import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    Tooltip,
    Paper,
    Container,
    Typography,
    CircularProgress
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import DetailedMovieView from './DetailedMovieView';
import configration from './../util/configration';
import Image from '../util/components/image';
import fetchAPI from '../util/services/fetchService';
import moviesListTypes from '../Data/movieListType';

const url_link = configration.API_URL;

const MovieView = ({ movie, index, handelModalOpen, styles }) => {

    return (
        <div key={index.toString()} style={{ paddingInline: "5px", paddingBlock: "10px" }}>
            <Tooltip title={movie?.title} arrow placement="bottom">
                <Paper onClick={() => handelModalOpen(movie.id)} key={index.toString()} className={styles.movieCon}>
                    <div style={{}}>
                        <Image sourceSmall={movie.small_cover_image} sourceMedium={movie.medium_cover_image} styles={{ borderRadius: '10px', objectFit: 'fill', width: '100%', height: '100%' }} />
                    </div>
                    <Container className={styles.titleCon}>
                        <Typography className={styles.movieName} noWrap={true}>{movie.title}</Typography>
                    </Container>
                </Paper>
            </Tooltip>
        </div>
    )
}

function ViewMore(props) {

    const styles = useStyles();
    const {state,pathname} = useLocation();
    const limit = 40;
    
    //refs

    //states
    const [type, setType] = useState(moviesListTypes.comedy.type)
    const [pageNo, setPageNo] = useState(1);
    const [data, setData] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(true)
    const [isModalOpen, setisModalOpen] = useState(false)
    const [selectedMovieData, setSelectedMovieData] = useState({})
    const [modalIsLoading, setmodalIsLoading] = useState(true);

    //lifecycle
    useEffect(() => {
        const pathType = pathname.substring(pathname.lastIndexOf('/') + 1)
        if (pathType in moviesListTypes) {
            setType(pathType);
            fetchData(pathType);
        }
        else fetchData(type);
    }, [])

    //methods
    function handelModalOpen(movieId) {
        fetchMovieDetails(movieId)
        setisModalOpen(!isModalOpen)
    }

    function handelModalClose(modalValue) {
        setisModalOpen(modalValue);
        setmodalIsLoading(true);
    }

    function handelSimilarMovie(newMovieId) {
        setmodalIsLoading(true);
        fetchMovieDetails(newMovieId);
    }

    async function fetchMovieDetails(movieId) {
        fetchAPI.call("/fetch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify({
                url: url_link + `/movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`,
            })
        })
            .then(resp => resp.json())
            .then(responce => {
                // console.log(responce)
                if (responce.status === 'ok') {
                    setSelectedMovieData(responce.data.movie);
                    setmodalIsLoading(false);
                }
            })
            .catch(err => console.log("ERROR::", err))
    }

    function fetchData(type) {
        let url = new URL(url_link + '/list_movies.json')

        const parameters=moviesListTypes[type].query

        const params = {
            limit: limit,
            page: 1,
            genre: parameters.genre,
            sort_by: parameters.sort_by,
            minimum_rating: parameters.minimum_rating,
        }

        if (params != null) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        }

        fetchAPI.call("/fetch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify({
                url: url,
            })
        })
            .then(resp => resp.json())
            .then(result => {
                // console.log(result);
                if (result.status === "ok") {
                    setData(result.data.movies);
                    setisLoading(false)
                    setPageNo(pageNo + 1)
                }

            })
            .catch(err => console.log("ERROR::", err))
    }

    async function fetchMoreData() {
        // console.log("feting MOre data");
        let url = new URL(url_link + '/list_movies.json')

        const parameters=moviesListTypes[type].query
        const params = {
            limit: limit,
            page: pageNo,
            genre: parameters?.genre,
            sort_by: parameters?.sort_by,
            minimum_rating: parameters?.minimum_rating,
        }

        // console.log(params);

        if (params != null) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        }

        fetchAPI.call("/fetch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify({
                url: url,
            })
        })
            .then(resp => resp.json())
            .then(result => {
                // console.log("fetched more",result);
                if (result.status === "ok") {
                    setData(data.concat(result.data.movies));
                    setisLoading(false)
                    setPageNo(pageNo + 1)
                }

            })
            .catch(err => console.log("ERROR::", err))
    }



    return (
        <div id="scrollDiv">
            <Container style={{ backgroundImage: state?.backgroundImage ? `url(${configration.SERVER_URL_1+"/fetch/image?url=" + state.backgroundImage})`: 'url(https://media.istockphoto.com/photos/pop-corn-and-on-red-armchair-cinema-picture-id1271522601?b=1&k=20&m=1271522601&s=170667a&w=0&h=azZRRchShbrwRgq58omc1HOYABnfDDOzXJatuaZrueQ=)' }} maxWidth="xl" className={styles.headingDiv}>
                <div className={styles.filterDiv}>
                    <Typography className={styles.heading} variant="h4" component="h2">
                        {moviesListTypes[type].title}
                    </Typography>
                </div>
            </Container>
            {
                isLoading ?
                    <Container style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100%", padding: '20px', marginTop: '13%' }} maxWidth="xl">
                        <CircularProgress size={55} variant="indeterminate" style={{ color: "#14efab" }} />
                    </Container>
                    :
                    <InfiniteScroll
                        dataLength={data.length}
                        hasMore={true}
                        loader={<Container style={{ display: "flex", justifyContent: "center", alignItems: 'center', padding: '25px' }} maxWidth="xl">
                            <CircularProgress size={55} variant="indeterminate" style={{ color: "#14efab" }} />
                        </Container>}
                        // scrollableTarget="scrollDiv"
                        style={{ paddingInline: "15px", display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}
                        next={fetchMoreData}
                    >
                        {data.map((movie, index) => {
                            return <MovieView key={index.toString()} movie={movie} index={index} handelModalOpen={(id) => handelModalOpen(id)} styles={styles} />
                        })}
                    </InfiniteScroll>
                // <div style={{paddingInline:"15px",display:'flex',flexDirection:"row",flexWrap:"wrap",justifyContent:"space-around"}}>
                // {data.map((movie,index)=>{
                //     return <MovieView key={index.toString()} movie={movie} index={index} />
                // })}
                // </div>
            }
            <DetailedMovieView
                isModalOpen={isModalOpen}
                handelModalClose={handelModalClose}
                data={selectedMovieData}
                isLoading={modalIsLoading}
                handelSimilarMovie={handelSimilarMovie}
            />
        </div>
    )
}

export default ViewMore;

const useStyles = makeStyles((theme) => ({
    movieCon: {
        width: "180px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#ffffff30",
        padding: 2,
        transition: 'transform 0.25s linear',
        boxShadow: '0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)',
        "&:hover, &:focus": {
            transform: 'scale(1.08)'
        },
    },
    titleCon: {
        width: "100%",
        height: "40px",
        display: 'flex',
        background: "#00000050",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px"
    },
    movieName: {
        color: "#fff",
        fontSize: "15px",
        fontWeight: "400"
    },
    headingDiv: {
        marginTop: "-70px",
        display: "flex",
        height: "230px",
        padding: 0,
        position: "relative",
        backgroundRepeat: "no-repeat",
        backgroundSize: 'cover',
    },
    filterDiv: {
        height: "100%",
        width: "100%",
        background: "linear-gradient(0deg, rgba(21,24,35,100) 0%, rgba(0,0,0,0) 60%)",
        flexDirection: "column-reverse",
        display: "flex"
    },
    heading: {
        fontWeight: "bold",
        margin: 14,
        color: "#fff"
    }
}))