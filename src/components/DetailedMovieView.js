import React, { useEffect, useState } from 'react';
import {
    Modal,
    Container,
    Typography,
    makeStyles,
    CircularProgress,
    Paper,
    Button,
    IconButton,
    Fade,
    Grid,
    Avatar,
    Tooltip
} from '@material-ui/core';
import { } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { Languages } from '../Data/languages';
import { AiFillPlayCircle, AiFillPlusCircle, AiFillStar, AiOutlineDownload } from 'react-icons/ai';
import { FaMagnet } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import useProgressiveImg from '../hooks/progressiverImage';

const url_link = "https://yts.mx/api/v2/";
const trackers = `&tr=${encodeURIComponent('udp://open.demonii.com:1337/announce')}&tr=${encodeURIComponent('udp://tracker.openbittorrent.com:80')}&tr=${encodeURIComponent('udp://tracker.coppersurfer.tk:6969')}&tr=${encodeURIComponent('udp://glotorrents.pw:6969/announce')}&tr=${encodeURIComponent('udp://tracker.opentrackr.org:1337/announce')}&tr=${encodeURIComponent('udp://torrent.gresille.org:80/announce')}&tr=${encodeURIComponent('udp://p4p.arenabg.com:1337')}&tr=${encodeURIComponent('udp://tracker.leechers-paradise.org:6969')}`

function DetailedMovieView({ isModalOpen = false, data = { torrents: [] }, isLoading = true, handelModalClose, handelSimilarMovie }) {

    const styles = useStyles();

    const [src, { blur }] = useProgressiveImg("https://vpn-api.herokuapp.com/fetch/image?url=" + data.small_cover_image, "https://vpn-api.herokuapp.com/fetch/image?url=" + data.medium_cover_image);

    // states
    const [similarLoading, setSimilarLoading] = useState(true)
    const [similarMoviesData, setSimilarMoviesData] = useState([])
    const [isDownloadModalOpen, setisDownloadModalOpen] = useState(false)
    const [magnetLinks, setmagnetLinks] = useState([]);

    //lifecycle
    useEffect(() => {
        async function fetchSimilarMovies() {
            fetch("https://vpn-api.herokuapp.com/fetch", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                },
                body: JSON.stringify({
                    url: url_link + `movie_suggestions.json?movie_id=${data.id}`,
                    username: "Hitman12355",
                    password: "qwerty123456"
                })
            })
                .then(resp => resp.json())
                .then(responce => {
                    // console.log(responce)
                    if (responce.status === 'ok') {
                        setSimilarMoviesData(responce.data.movies);
                        setSimilarLoading(false);
                    }
                })
                .catch(err => console.log("ERROR::", err))
        }


        setSimilarLoading(true);
        fetchSimilarMovies();
        createMagnetLinks();
    }, [data])

    //methods
    const createMagnetLinks = () => {
        try {
            const tempList = data.torrents.map(torrent => {
                return `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(data.title)}${trackers}`
            })
            setmagnetLinks(tempList);
        }
        catch (err) {
            // console.log(err);
        }
    }

    function bytesToSize(bytes) {
        var marker = 1024; // Change to 1000 if required
        var decimal = 2; // Change as required
        var kiloBytes = marker; // One Kilobyte is 1024 bytes
        var megaBytes = marker * marker; // One MB is 1024 KB
        var gigaBytes = marker * marker * marker; // One GB is 1024 MB
        var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

        // return bytes if less than a KB
        if (bytes < kiloBytes) return bytes + " Bytes";
        // return KB if less than a MB
        else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
        // return MB if less than a GB
        else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
        // return GB if less than a TB
        else return (bytes / gigaBytes).toFixed(decimal) + " GB";
    }

    const DownloadView = ({ torrent, index }) => {
        return (
            <>
                <Grid container={true} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                    <Typography style={{ fontWeight: "bold", color: '#fff' }}>{torrent.quality}</Typography>
                    <Grid style={{ display: "flex", flexDirection: "row", }}>
                        <Typography style={{ color: '#fff', alignSelf: "center", marginRight: '10px' }}>{bytesToSize(torrent.size_bytes)}</Typography>
                        <Button
                            variant="contained"
                            style={{ width: "min-content", height: 'min-content', alignSelf: "center" }}
                            size="small"
                            // onClick={() => { }}
                            href={torrent.url}
                        >
                            <AiOutlineDownload style={{ color: '#000', alignSelf: "flex-end" }} size={25} />
                        </Button>
                        <IconButton href={magnetLinks[index]} style={{ marginLeft: '10px' }}>
                            <FaMagnet style={{ color: "green" }} size={25} />
                        </IconButton>
                    </Grid>

                </Grid>
                {data.torrents.length !== index + 1 && <div style={{ height: "1px", borderRadius: '5px', background: "#ffffff30", marginTop: '10px' }} />}
            </>
        )
    }

    const MovieView = ({ movie, index }) => {
        const [src, { blur }] = useProgressiveImg("https://vpn-api.herokuapp.com/fetch/image?url=" + movie.small_cover_image, "https://vpn-api.herokuapp.com/fetch/image?url=" + movie.medium_cover_image);

        return (
            <div key={index.toString()} style={{ paddingInline: "5px", paddingBlock: "10px" }}>
                <Tooltip title={movie.title} arrow placement="bottom">
                    <Paper onClick={() => { handelSimilarMovie(movie.id) }} key={index.toString()} className={styles.movieCon}>
                        <div style={{}}>
                            <img alt="" src={src} style={{ borderRadius: '10px', objectFit: 'fill', width: '100%', height: '100%', filter: blur ? "blur(20px)" : "none", transition: blur ? "none" : "filter 0.3s ease-out" }} />
                        </div>
                        <Container className={styles.titleCon}>
                            <Typography className={styles.movieName} noWrap={true}>{movie.title}</Typography>
                        </Container>
                    </Paper>
                </Tooltip>
            </div>
        )
    }

    const BackgroundImgView = ({ image, index }) => {
        const [src, { blur }] = useProgressiveImg("https://vpn-api.herokuapp.com/fetch/image?url=" + image.small, "https://vpn-api.herokuapp.com/fetch/image?url=" + image.large);
        return <img alt="" key={index} src={src} className={styles.imageStyle} style={{ filter: blur ? "blur(20px)" : "none", transition: blur ? "none" : "filter 0.3s ease-out" }} />
    }

    return (
        // <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Modal
            open={isModalOpen}
            onClose={() => handelModalClose(!isModalOpen)}
            className={styles.modal}
            style={{ outline: 0 }}
            closeAfterTransition={true}
        // disableBackdropClick={true}
        >
            <Fade in={isModalOpen} >
                <Container className={styles.mainContainer} maxWidth="md">
                    <IconButton onClick={() => handelModalClose(!isModalOpen)} className={styles.cancelButton}>
                        <MdCancel style={{ color: "#fff" }} size={35} />
                    </IconButton>
                    {isLoading ?
                        <Container style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center" }} maxWidth="xl">
                            <CircularProgress style={{ color: '#fff' }} size={60} />
                        </Container>
                        :
                        <>
                            <Container className={styles.imagesMainContainer} maxWidth="xl">
                                <Carousel
                                    className={styles.carasole}
                                    autoPlay={true}
                                    interval={5000}
                                    indicators={false}
                                    navButtonsAlwaysInvisible={true}
                                    stopAutoPlayOnHover={false}
                                >
                                    {
                                        [{ large: data.large_screenshot_image1, small: data.medium_screenshot_image1 }, { large: data.large_screenshot_image2, small: data.medium_screenshot_image2 }, { large: data.large_screenshot_image3, small: data.medium_screenshot_image3 }].map((image, index) => {
                                            return <BackgroundImgView key={index.toString()} image={image} index={index} />
                                        })
                                    }
                                </Carousel>
                                <Container className={styles.imagesFilter} maxWidth="xl" />

                            </Container>
                            <Container maxWidth="xl" className={styles.titleDiv}>
                                <Grid item sm={12} md={3} style={{ zIndex: 20 }}>
                                    <Paper elevation={10} className={styles.posterDiv}>
                                        <img alt="" src={src} style={{ borderRadius: '10px', objectFit: 'fill', width: '100%', height: '100%', filter: blur ? "blur(20px)" : "none", transition: blur ? "none" : "filter 0.3s ease-out" }} />
                                    </Paper>
                                </Grid>

                                <Grid item sm={12} md={10} direction="column" style={{ paddingInline: '15px', display: "flex", flexDirection: "column" }}>
                                    <Grid md={12} justify="flex-start" direction="row" container style={{ width: 'max-content', marginBottom: '15px' }} >
                                        < Grid xs={12} md={4} item>
                                            <Button
                                                variant="contained"
                                                style={{ width: "min-content", zIndex: 20, marginBottom: "15px" }}
                                                size="large"
                                                startIcon={<AiFillPlayCircle style={{ color: "#000" }} />}
                                                component={NavLink}
                                                to={{
                                                    pathname: `/videoPlayer/${data.id}`,
                                                    state: data
                                                }}
                                            >
                                                Play
                                            </Button>
                                        </Grid>
                                        <Grid xs={12} md={7} style={{}} item>
                                            <Button
                                                variant="outlined"
                                                style={{ color: "#fff", alignSelf: "center", zIndex: 20, borderColor: "#fff", marginBottom: "15px", }}
                                                size="large"
                                                startIcon={<AiFillPlusCircle style={{ color: "#fff" }} />}
                                            >
                                                Add to My list
                                            </Button>
                                        </Grid>
                                        <Grid xs={12} md={1} item>
                                            <Button
                                                variant="contained"
                                                style={{ width: "min-content", zIndex: 20, marginBottom: "15px" }}
                                                size="small"
                                                onClick={() => { setisDownloadModalOpen(true) }}
                                            >
                                                <AiOutlineDownload style={{ color: '#000' }} size={35} />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Typography className={styles.movieTitle} variant="h4" component="h2">{data.title}</Typography>
                                    <Typography className={styles.movieSubtitle} >
                                        {data.year + " . " + Languages[data.language] + " . " + String(data.runtime) + " min . " + data.genres.map((genre) => { return String(genre) + " " })}
                                    </Typography>
                                    <Typography className={styles.rating}>{`${data.rating}/10 `}<AiFillStar style={{ color: "#ffd700" }} /></Typography>
                                </Grid>
                            </Container>
                            <Grid container spacing={2} className={styles.summaryDiv}>
                                <Grid md={8} xs={12}>
                                    <Typography variant="h6" style={{ marginBottom: '10px', color: "#fff" }}>Summary</Typography>
                                    <Typography className={styles.movieDescription}>
                                        {data.description_full}
                                    </Typography>
                                </Grid>
                                {data.cast && <Grid md={4} xs={12} style={{ justifyContent: "center", display: "flex", paddingTop: '15px', paddingInline: '15px' }}>
                                    <Container className={styles.castDiv} maxWidth="xl" >
                                        <Typography variant="h6" style={{ marginBottom: '10px', color: "#fff" }}>Cast</Typography>
                                        {data.cast.map((data, index) => {
                                            return <div key={index} className={styles.castBox}>
                                                <Grid md={3}>
                                                    <Avatar alt="" src={"https://vpn-api.herokuapp.com/fetch/image?url=" + data.url_small_image} />
                                                </Grid>
                                                <Grid md={9}>
                                                    <Typography noWrap style={{ color: '#fff', marginLeft: "10px", fontSize: "18px" }}>{data.name}</Typography>
                                                </Grid>
                                            </div>
                                        })}
                                    </Container>
                                </Grid>}

                            </Grid>
                            <div className={styles.line} />
                            <Container maxWidth="xl">
                                <Typography variant="h6" style={{ marginBottom: '10px', color: "#fff" }}>Similar Movies</Typography>
                            </Container>
                            <div style={{ paddingBottom: '28px' }}>
                                {similarLoading ?
                                    <Container style={{ display: 'flex', justifyContent: "center", alignItems: "center" }} maxWidth="xl">
                                        <CircularProgress style={{ color: '#fff' }} size={60} />
                                    </Container>
                                    :
                                    <Container className={styles.similarDiv} maxWidth="xl">
                                        {similarMoviesData.map((movie, index) => {
                                            return <MovieView key={index} movie={movie} index={index} />
                                        })}
                                    </Container>
                                }
                            </div>
                            <Modal
                                open={isDownloadModalOpen}
                                onClose={() => setisDownloadModalOpen(!isDownloadModalOpen)}
                                className={styles.modal}
                                style={{ outline: 0 }}
                                closeAfterTransition={true}
                            >
                                <Fade in={isDownloadModalOpen} >
                                    <Container maxWidth="xs" className={styles.mainContainer} style={{ height: 'auto', padding: '15px' }}>
                                        <IconButton onClick={() => setisDownloadModalOpen(!isDownloadModalOpen)} className={styles.cancelButton}>
                                            <MdCancel style={{ color: "#fff" }} size={35} />
                                        </IconButton>
                                        <Typography className={styles.movieTitle} style={{ marginBottom: '15px' }} variant="h5" component="h2">{data.title}</Typography>
                                        {
                                            data.torrents.map((torrent, index) => {
                                                return <DownloadView key={index.toString()} torrent={torrent} index={index} />
                                            })}
                                    </Container>
                                </Fade>
                            </Modal>
                        </>
                    }
                </Container>
            </Fade >

        </Modal >

        // </div>
    );
}

export default DetailedMovieView;

const useStyles = makeStyles({
    modal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    mainContainer: {
        // marginTop:'2.48%',
        height: "95%",
        background: "#0f131e",
        borderRadius: "14px",
        outline: 0,
        boxShadow: '0px 6px 6px -3px rgb(0 0 0 / 20%), 0px 10px 14px 1px rgb(0 0 0 / 14%), 0px 4px 18px 3px rgb(0 0 0 / 12%)',
        padding: 0,
        overflowX: 'hidden',
        overflowY: 'scroll',
        // maxWidth:"60%",
        position: "relative"
    },
    imagesMainContainer: {
        height: '350px',
        position: "relative",
        display: "flex",
        padding: 0
    },
    cancelButton: {
        position: "absolute",
        top: 10,
        right: 10,
        background: '#ffffff30',
        backdropFilter: "blur(20px)",
        padding: 3,
        zIndex: 20
    },
    imagesFilter: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: "linear-gradient(0deg, #0f131e 0%, rgba(0,0,0,0) 40%)"
    },
    imageStyle: {
        objectFit: "cover",
        width: "100%",
        height: "100%"
    },
    carasole: {
        height: '100%',
        width: '100%',
    },
    titleDiv: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "flex-end",
        marginTop: "-180px",
        zIndex: 10,
    },
    posterDiv: {
        zIndex: 20,
        display: "flex",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#ffffff30",
        padding: 6,
        width: "190px",
        minWidth: "130px",
        backdropFilter: "blur(20px)"
    },
    movieTitle: {
        color: "#fff",
        fontWeight: "500",
        zIndex: 20,
        width: "max-content"
    },
    movieSubtitle: {
        fontSize: '14px',
        color: '#fff',
        zIndex: 20
    },
    rating: {
        color: '#fff',
        justifyContent: "start",
        display: 'flex',
        alignItems: "center",
        fontWeight: "400",
        background: "#ffffff30",
        borderRadius: '5px',
        backdropFilter: "blur(20px)",
        padding: 2,
        paddingInline: 20,
        width: "min-content",
        zIndex: 20
    },
    summaryDiv: {
        marginTop: "15px",
        padding: '25px'
    },
    movieDescription: {
        fontSize: "17px",
        color: "#c2c2c2",
        textAlign: "justify"
    },
    castDiv: {
        background: "#ffffff30",
        borderRadius: '10px',
        width: '100%',
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(20px)",
        alignItems: 'center',
        height: "max-content",
        padding: '15px'
    },
    castBox: {
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: "10px",
        width: "100%"
    },
    line: {
        height: "1px",
        borderRadius: '5px',
        background: "#ffffff30",
        marginInline: "25px !important",
        margin: '15px'
    },
    similarDiv: {
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around"
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
});