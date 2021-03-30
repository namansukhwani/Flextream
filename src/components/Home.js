import React, { useState, } from 'react';
import {
    // useTheme,
    makeStyles,

} from '@material-ui/core';
// import {AiFillInfoCircle} from 'react-icons/ai';
import RecentlyAddedList from './RecentAddedHome';
import MovieScrollView from './MovieScrollView';
import {FaStar,FaLaughSquint,FaGhost} from 'react-icons/fa'
import {AiFillHeart} from 'react-icons/ai'
import {BsMusicNoteBeamed} from 'react-icons/bs'
import {GiDramaMasks,GiMagicGate} from 'react-icons/gi'
import DetailedMovieView from './DetailedMovieView';

const url_link = "https://yts.mx/api/v2/";

const Home = (props) => {

    const styles = useStyles();
    // const theme = useTheme

    // refs

    // States
    const [isModalOpen, setisModalOpen] = useState(false)
    const [selectedMovieData, setSelectedMovieData] = useState({})
    const [modalIsLoading, setmodalIsLoading] = useState(true);

    //lifecycle
  
    //methods
    function handelModalOpen(movieId){
        fetchMovieDetails(movieId)
        setisModalOpen(!isModalOpen)  
    }

    function handelModalClose(modalValue){
        setisModalOpen(modalValue);
        setmodalIsLoading(true);
    }

    function handelSimilarMovie(newMovieId){
        setmodalIsLoading(true);
        fetchMovieDetails(newMovieId);
    }
    
    async function fetchMovieDetails(movieId){
        fetch("https://vpn-api.herokuapp.com/fetch",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':"*"
            },
            body:JSON.stringify({
                url:url_link + `movie_details.json?movie_id=${movieId}&with_images=true&with_cast=true`,
                username:"Hitman12355",
                password:"qwerty123456"
            })
        })
        .then(resp=>resp.json())
        .then(responce=>{
            console.log(responce)
            if(responce.status==='ok'){
                setSelectedMovieData(responce.data.movie);
                setmodalIsLoading(false);
            }
        })
        .catch(err=>console.log("ERROR::",err))
    }

    return (
        <div>
            {/* <Container className={styles.headingContainer} maxWidth="xl">
                <Typography className={styles.heading} variant="h4" component="h2">
                    Flextream
                </Typography>
                <AiFillInfoCircle style={{color:'#fff'}} size={33} onClick={()=>{}}/>
            </Container> */}
            <RecentlyAddedList/>
            <MovieScrollView 
                parameters={{
                    limit: 16,
                    sort_by: 'like_count',
                    minimum_rating:0,
                    genre:'',
                }}
                title="Most Popular Movies"
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:20,
                    sort_by:'rating',
                    minimum_rating:0,
                    genre:'',
                }}
                title="Top Rated Movies"
                largeDiv={true}
                TitleIcon={FaStar}
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:15,
                    genre:'Comedy',
                    sort_by:"like_count",
                    minimum_rating:0,
                }}
                title="Popular in Comedy"
                TitleIcon={FaLaughSquint}
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:15,
                    genre:'Romance',
                    sort_by:"download_count",
                    minimum_rating:0,
                }}
                title="Popular in Romance"
                TitleIcon={AiFillHeart}
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:15,
                    genre:'fantasy',
                    sort_by:"year",
                    minimum_rating:7
                }}
                title="Trending in Fantasy"
                TitleIcon={GiMagicGate}
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:15,
                    genre:'Drama',
                    sort_by:"year",
                    minimum_rating:7
                }}
                title="Treanding in Drama"
                TitleIcon={GiDramaMasks}
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:15,
                    genre:'Horror',
                    sort_by:"download_count",
                    minimum_rating:0,
                }}
                title="Popular in Horror"
                TitleIcon={FaGhost}
                togglelModal={handelModalOpen}
            />
            <MovieScrollView
                parameters={{
                    limit:15,
                    genre:'Musical',
                    sort_by:"download_count",
                    minimum_rating:0,
                }}
                title="Popular in Musical"
                TitleIcon={BsMusicNoteBeamed}
                togglelModal={handelModalOpen}
            />
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

export default Home;

const useStyles = makeStyles((theme) => ({
    headingContainer: {
        // width:"100%",
        height: '45px',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '10px',
        padding: '15px',
        alignItems:'center',
        justifyContent:"space-between",
        marginTop:'15px',
    },
    logo: {
        width: "60px",
        height: "60px",
        marginRight: "5px",
    },
    heading: {
        fontFamily: "Chilanka,cursive",
        fontWeight: 'bold',
        color: '#fff',
        background: 'linear-gradient(to right top, #fc00ff, #00dbde);',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: '10px 10px 0px 10px',
        borderRadius: '13px',
    },
}))