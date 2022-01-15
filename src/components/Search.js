import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Typography,
    makeStyles,
    InputBase,
    Tooltip,
    Paper,
    CircularProgress
} from '@material-ui/core';
import { AiOutlineSearch } from 'react-icons/ai'
import InfiniteScroll from 'react-infinite-scroll-component';
import DetailedMovieView from './DetailedMovieView';
import configration from './../util/configration';
import Image from '../util/components/image';
import fetchAPI from '../util/services/fetchService';
import { useHistory, useLocation } from 'react-router-dom';

const url_link = configration.API_URL;

const MovieView = ({ movie, index, handelModalOpen, styles }) => {

    return (
        <div key={index.toString()} style={{ paddingInline: "5px", paddingBlock: "10px" }}>
            <Tooltip title={movie.title} arrow placement="bottom">
                <Paper onClick={() => handelModalOpen(movie.id)} key={index.toString()} className={styles.movieCon}>
                    <div style={{}}>
                        <Image sourceSmall={movie.small_cover_image} sourceMedium={movie.medium_cover_image} styles={{ borderRadius: '10px', objectFit: 'fill', width: '100%', height: '100%'}} />
                    </div>
                    <Container className={styles.titleCon}>
                        <Typography className={styles.movieName} noWrap={true}>{movie.title}</Typography>
                    </Container>
                </Paper>
            </Tooltip>
        </div>
    )
}

const Search = (props) => {
    const location=useLocation()
    const histor = useHistory();

    const styles = useStyles();

    //Refs
    const inputRef = useRef();

    //States
    const [search, setSearch] = useState("")
    const [data, setData] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [isModalOpen, setisModalOpen] = useState(false)
    const [selectedMovieData, setSelectedMovieData] = useState({})
    const [modalIsLoading, setmodalIsLoading] = useState(true);

    //Lifecycle
    useEffect(() => {
        const params=new URLSearchParams(location.search)
        const searchValue = params.get('s');
        console.log("Search param",searchValue);
        if (searchValue?.length > 0) {
            console.log("me yah hu");
            onSearchChanged(searchValue);
        }
        else {
            const fetchTopMovies = () => {
                let url = new URL(url_link + '/list_movies.json')
    
                const params = {
                    limit: 40,
                    // genre: 'fantasy',
                    sort_by: "year",
                    minimum_rating: 7
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
                        setData(result.data.movies);
                        setisLoading(false)
                    })
                    .catch(err => console.log("ERROR::", err))
            }
            fetchTopMovies();
        }
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
                console.log(responce)
                if (responce.status === 'ok') {
                    setSelectedMovieData(responce.data.movie);
                    setmodalIsLoading(false);
                }
            })
            .catch(err => console.log("ERROR::", err))
    }

    function fetchSearchedMovie(movie) {
        let url = new URL(url_link + '/list_movies.json')

        let params;

        if (movie === "") {
            params = {
                limit: 40,
                // genre: 'fantasy',
                sort_by: "year",
                minimum_rating: 7
            }
        }
        else {
            params = {
                limit: 50,
                query_term: movie,
                sort_by: 'download_count'
            }
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
                // console.log("data",result);
                if (result.data.movie_count === 0) {
                    setData([])
                }
                else {
                    setData(result.data.movies);
                }
                setisLoading(false)
            })
            .catch(err => console.log("ERROR::", err))
    }

    function onSearchChanged(value) {
        const shouldFetch=search.trim()===value.trim()
        setSearch(value)
        if (!shouldFetch) {
            setisLoading(true);
            fetchSearchedMovie(value)
            histor.replace({ pathname: "/search", search: `?s=${encodeURIComponent(value)}` })
        }
    }

    return (
        <div style={{ width: "100%", height: '100%' }}>
            <Container className={styles.searchContainer} maxWidth="xl" >
                <Container className={styles.search} maxWidth="md">
                    <Container maxWidth="xl" className={styles.searchInner}>
                        <div className={styles.searchIconDiv}>
                            <AiOutlineSearch size={35} style={{ color: "#fff" }} />
                        </div>
                        <InputBase
                            placeholder="Search Here...."
                            value={search}
                            onChange={(e) => onSearchChanged(e.target.value)}
                            className={styles.searchInput}
                            ref={ref => inputRef.current = ref}
                        />
                    </Container>
                </Container>
            </Container>

            <div id="scrollDiv" style={{ marginTop: "15px" }}>
                {
                    isLoading ?
                        <Container style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100%", padding: '20px', marginTop: '13%' }} maxWidth="xl">
                            <CircularProgress size={55} variant="indeterminate" style={{ color: "#14efab" }} />
                        </Container>
                        :
                        data.length === 0 ?
                            <Container style={{ display: "flex", justifyContent: "center", alignItems: 'center', flexDirection: 'column', height: "100%", padding: '20px', marginTop: '13%' }} maxWidth="xl">
                                <Typography style={{ color: "#fff", fontSize: "30px", }} component="h2">No results found for "{search}"</Typography>
                                <Typography style={{ color: "#ffffff40" }} component="h2">Please try searching by a correct movie name, actor or director name. </Typography>
                            </Container>
                            :
                            <InfiniteScroll
                                dataLength={data.length}
                                hasMore={false}
                                style={{ paddingInline: "15px", display: 'flex', flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}

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

export default Search;

const useStyles = makeStyles({
    searchContainer: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        marginTop: "15px",
    },
    search: {
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#ffffff60',
        height: '50px',
        '&:hover,focus,active': {
            backgroundColor: "#ffffff80"
        },
        padding: '2px',
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    searchInner: {
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        background: "#00000050",
        borderRadius: 10,
        padding: "2px",
        color: "#fff",
        height: "46px"
    },
    searchIconDiv: {
        pointerEvents: 'none',
        display: "flex",
        justifyContent: 'center',
        alignItems: "center"
    },
    searchInput: {
        marginLeft: '10px',
        width: '100%',
        color: "#fff"
    },
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
        "&:hover,&:focus": {
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
})