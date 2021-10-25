import React, { useState } from 'react';
import {
    makeStyles,
    Tooltip,
    Paper,
    Container,
    Typography,
    CircularProgress,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { addMovie, removeMovie, errList } from '../redux/slices/myListSlice'
import DetailedMovieView from './DetailedMovieView';
import useProgressiveImg from '../hooks/progressiverImage';
import { AiFillCloseCircle } from 'react-icons/ai';

const url_link = "https://yts.mx/api/v2/";

const MovieView = ({ movie, index, handelModalOpen, styles }) => {
    const [src, { blur }] = useProgressiveImg("https://flextream.herokuapp.com/fetch/image?url=" + movie.small_cover_image, "https://flextream.herokuapp.com/fetch/image?url=" + movie.medium_cover_image);

    return (
        <div key={index.toString()} style={{ paddingInline: "5px", paddingBlock: "10px" }}>
            <Tooltip title={movie.title} arrow placement="bottom">
                <Paper onClick={() => handelModalOpen(movie.id)} key={index.toString()} className={styles.movieCon}>
                    <div style={{}}>
                        <img src={src} style={{ borderRadius: '10px', objectFit: 'fill', width: '100%', height: '100%', filter: blur ? "blur(20px)" : "none", transition: blur ? "none" : "filter 0.3s ease-out" }} />
                    </div>
                    <Container className={styles.titleCon}>
                        <Typography className={styles.movieName} noWrap={true}>{movie.title}</Typography>
                    </Container>
                </Paper>
            </Tooltip>
        </div>
    )
}


const MyList = (props) => {

    const styles = useStyles();

    const mylist = useSelector(state => state.mylist)
    const list = Object.values(mylist.list)

    //Refs

    //States
    const [isModalOpen, setisModalOpen] = useState(false)
    const [selectedMovieData, setSelectedMovieData] = useState({})
    const [modalIsLoading, setmodalIsLoading] = useState(true);

    //Lifecycle

    //methos

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
        fetch("https://flextream.herokuapp.com/fetch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            },
            body: JSON.stringify({
                url: url_link + `movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`,
                username: "Hitman12355",
                password: "qwerty123456"
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

    if (list.length > 0) {
        return (
            <div>
                <Container style={{ backgroundImage: `url(${"https://flextream.herokuapp.com/fetch/image?url=" + list[0].background_image_original})` }} maxWidth="xl" className={styles.headingDiv}>
                    <div className={styles.filterDiv}>
                        <Typography className={styles.heading} variant="h4" component="h2">
                            My List 🎬
                        </Typography>
                    </div>
                </Container>
                <div style={{ paddingInline: "15px", display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
                    {list.map((movie, index) => {
                        return <MovieView key={index.toString()} movie={movie} index={index} handelModalOpen={(id) => handelModalOpen(id)} styles={styles} />
                    })}
                </div>
                <DetailedMovieView
                    isModalOpen={isModalOpen}
                    handelModalClose={handelModalClose}
                    data={selectedMovieData}
                    isLoading={modalIsLoading}
                    handelSimilarMovie={handelSimilarMovie}
                />
            </div>
        );
    }

    return (
        <Container style={{ color: "#fff", justifyContent: "center", alignItems: "center", marginTop: '15%', textAlign: "center" }}>
            <AiFillCloseCircle size={50} style={{ color: "#fff" }} />
            <Typography variant="h4" component="h2">No Movies Added</Typography>
            <Typography variant="caption" >Add movies to your list to see them here</Typography>
        </Container>
    )
}

export default MyList;

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