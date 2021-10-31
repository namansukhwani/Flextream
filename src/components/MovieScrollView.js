import React, { useEffect, useState, useRef } from 'react';
import {
    // useTheme,
    makeStyles,
    Container,
    Typography,
    Button,
    Paper,
    Tooltip,
} from '@material-ui/core';
import { AiFillFire, AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'
import { FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx';
import { Skeleton } from '@material-ui/lab';
import { NavLink } from 'react-router-dom';
import configration from './../util/configration';
import Image from '../util/components/image';
import fetchAPI from './../util/services/fetchService';

const url_link = configration.API_URL;

const MovieView = ({ movie, index, togglelModal, largeDiv, styles, dataLength }) => {
    return (
        <div key={index.toString()} style={{ paddingInline: "5px", paddingBlock: "15px" }}
            className={clsx({
                [styles.paddingLeft]: index === 0,
                [styles.paddingRight]: index === dataLength - 1
            })}
        >
            <Tooltip title={movie.title} arrow placement="bottom">
                <Paper onClick={() => togglelModal(movie.id)} key={index.toString()} style={{ width: (largeDiv ? '230px' : '185px') }} className={styles.movieCon}>
                    <div style={{}}>
                        <Image sourceSmall={movie.small_cover_image} sourceMedium={movie.medium_cover_image} styles={{ borderRadius: '10px', objectFit: 'fill', width: '100%', height: '100%',}} />
                    </div>
                    <Container className={styles.titleCon}>
                        <Typography className={styles.movieName} noWrap={true}>{movie.title}</Typography>
                    </Container>
                </Paper>
            </Tooltip>
        </div>
    )
}

const MovieScrollView = ({ largeDiv = false, parameters = {}, title = "", TitleIcon = AiFillFire, togglelModal }) => {
    const styles = useStyles();
    // const theme = useTheme()

    //refs
    const scrollDiv = useRef(0);

    // States
    const [data, setData] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    // const [isModalOPen, setisModalOPen] = useState(false);
    // const [showArrows, setShowArrows] = useState(false);

    //lifecycle
    useEffect(() => {
        async function fetchMostPopular() {
            let url = new URL(url_link + '/list_movies.json')

            const params = parameters

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
        };

        fetchMostPopular();
    }, [])

    //methods

    const handleScroll = (direction) => {
        if (direction === 'left') {
            // console.log(scrollDiv.current.offsetWidth)
            scrollDiv.current.scrollLeft -= scrollDiv.current.clientWidth - 300
        }
        else {
            console.log("right", scrollDiv.current.clientWidth);
            scrollDiv.current.scrollLeft += scrollDiv.current.clientWidth - 300
        }
    }



    return (
        <>
            <div style={{ paddingBottom: "15px", position: "relative", display: "flex", flexDirection: "column", }}>
                <Container style={{ paddingInline: "15px" }} className={styles.titleContainer} maxWidth="xl">
                    <Typography className={styles.title}><TitleIcon style={{ marginRight: 2 }} size={23} />{title}</Typography>
                    <Button
                        variant="text"
                        color="default"
                        endIcon={<FiArrowRight style={{ color: "#fff" }} />}
                        className={styles.titleButton}
                        component={NavLink}
                        disabled={isLoading}
                        to={{
                            pathname: `/viewMore/${title}`,
                            state: {
                                parameters: parameters,
                                title: title,
                                backgroundImage: (isLoading ? "" : data[0].background_image_original)
                            }
                        }}
                    >
                        View More
                    </Button>
                </Container>
                {isLoading ?
                    // <div className={styles.Carousel}>
                    //     {[...Array(Math.ceil((window.innerWidth- 200) / 180)).keys()].map((h, index) => {
                    //         <Skeleton variant="rect" style={{width: "180px",height: "300px",borderRadius:'10px',paddingInline:'15px',paddingBlock:"15px"}} />
                    //     })}
                    // </div>
                    <Skeleton variant='rect' animation="wave" style={{ height: '325px', width: '100%', margin: '15px', borderRadius: "10px", color: '#000' }} />
                    :
                    <div style={{ position: "relative" }}>
                        <div
                            // onMouseEnter={() => setShowArrows(true)}
                            // onMouseLeave={() => { setShowArrows(false) }}
                            className={styles.arrowLeft}
                        >
                            <AiFillLeftCircle
                                elevation={10}
                                onClick={() => handleScroll('left')}
                                size={55}
                                style={{ color: "#fff", zIndex: '10' }}
                            // className={showArrows ? styles.show : styles.hide}
                            />
                        </div>
                        <div ref={ref => scrollDiv.current = ref} className={styles.Carousel}>
                            {data.map((movie, index) => {
                                return <MovieView key={index.toString()} movie={movie} index={index} togglelModal={(id) => togglelModal(id)} largeDiv={largeDiv} styles={styles} dateLength={data.length} />
                            })}
                        </div>
                        <div
                            className={styles.arrowRight}
                        // onMouseEnter={() => setShowArrows(true)}
                        // onMouseLeave={() => { setTimeout(() => setShowArrows(false), 3000) }}
                        >
                            <AiFillRightCircle
                                elevation={10}
                                onClick={() => handleScroll('right')}
                                size={55}
                                style={{ color: "#fff", zIndex: '10' }}
                            // className={showArrows ? styles.show : styles.hide}

                            />
                        </div>
                    </div>
                }
            </div>
            {/* <DetailedMovieView isModalOpen={isModalOPen} setIsModalOpen={(value)=>setisModalOPen(value)} /> */}
        </>
    )
}

export default MovieScrollView;

const useStyles = makeStyles((theme) => ({
    titleContainer: {
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
    movieCon: {
        // width:"240px",
        // height:"px",
        // width: "180px",
        // height: "318px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#ffffff30",
        padding: 2,
        transition: 'transform 0.25s linear',
        // marginRight: "10px",
        // marginLeft: "10px",
        boxShadow: '0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)',
        "&:hover, &:focus": {
            transform: 'scale(1.08)'
        },
    },
    titleCon: {
        width: "100%",
        height: "38px",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        background: "#00000050",
        borderRadius: "10px"
    },
    movieName: {
        color: "#fff",
        fontSize: "15px",
        fontWeight: "400"
    },
    Carousel: {
        width: "100%",
        overflowX: 'scroll',
        scrollBehavior: 'smooth',
        display: "-ms-inline-flexbox",
        display: "-webkit-inline-box",
        flexWrap: "nowrap",
        height: "auto"
        // paddingLeft:"15px",
    },
    arrowLeft: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        // background:"#14fa",
        position: "absolute",
        width: '80px',
        height: "100%",
        left: "0px",
        top: "0px"
    },
    arrowRight: {
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        // background:"#14fa",
        position: "absolute",
        width: '80px',
        height: "100%",
        right: "0px",
        top: "0px"
    },
    show: {
        display: 'block',
        opacity: 1,
        // transition:'visibility 0s, opacity 0.5s linear'
    },
    hide: {
        display: "none",
        opacity: 0,
        transition: 'opacity 0.5s linear'
    },
    paddingLeft: {
        paddingLeft: "15px !important"
    },
    paddingRight: {
        paddingRight: "15px !important"
    }


}))