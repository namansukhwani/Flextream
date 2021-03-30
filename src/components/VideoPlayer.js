import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    makeStyles,
    Typography,
    CircularProgress,
    Box,
} from '@material-ui/core';
import {
    ToggleButtonGroup,
    ToggleButton
} from '@material-ui/lab'
// import ReactPlayer from 'react-player';
import { useLocation } from 'react-router-dom';

function CircularProgressWithLabel(props) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress size={50} variant="determinate" {...props} style={{ color: "#14efab" }} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" style={{ color: "#fff" }}>{`${props.value.toFixed(1)}%`}</Typography>
            </Box>
        </Box>
    );
}

const VideoPlayer = (props) => {
    const styles = useStyles()
    const { state } = useLocation();
    const WebTorrent = require('webtorrent');

    const trackers = [
        'udp://glotorrents.pw:6969/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'udp://torrent.gresille.org:80/announce',
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.coppersurfer.tk:6969',
        'udp://tracker.leechers-paradise.org:6969',
        "wss://tracker.btorrent.xyz",
        "wss://tracker.openwebtorrent.com",
        "wss://tracker.fastcast.nz",
        "wss://tracker.fastcast.nz",
        "wss://tracker.openwebtorrent.com",
        // "wss://tracker.webtorrent.io",
        // 'udp://p4p.arenabg.ch:1337',
        // 'udp://tracker.internetwarriors.net:1337',
        // "http://tracker2.wasabii.com.tw:6969/announce",
        // "udp://tracker.sktorrent.net:6969/announce",
        // "http://www.wareztorrent.com:80/announce",
        // "udp://bt.xxx-tracker.com:2710/announce",
        // "udp://tracker.eddie4.nl:6969/announce",   
        // "udp://tracker.grepler.com:6969/announce",
        // "udp://tracker.mg64.net:2710/announce",
        // "udp://wambo.club:1337/announce",
        // "udp://tracker.dutchtracking.com:6969/announce",
        // "udp://tc.animereactor.ru:8082/announce",
        // "http://umunu.com:1984/announce",
        // "http://www.mvgroup.org:2710/announce",
        // "http://www.torrent-downloads.to:2710/announce",
    ]
    // console.log(state);

    const config = {
        maxConns: 100,        // Max number of connections per torrent (default=55)
        tracker: trackers, // Enable trackers (default=true), or options object for Tracker
    }

    const torrentOptions={
        announce:trackers
    }
    //refs
    const playerRef = useRef(0)

    //states
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [movieQualityIndex, setMovieQualityIndex] = useState(0);
    const [torrentFiles, settorrentFiles] = useState([])
    const [downloadSpeed, setDownloadSpeed] = useState(0)
    //lifecycle
    useEffect(() => {
        var client = new WebTorrent(config);
        async function run(){
            let index=await selectMoviequality()
            // console.log(index);
    
            client.on('error', err => {
                console.log('Webtorrent Error::', err);
            })
    
            // const interval = setInterval(() => { 
            //     console.log(`${client.progress * 100}%`);
            //     console.log("download Speed",client.downloadSpeed/125);
            //     console.log("upload speed",client.uploadSpeed/125);
            //     if(client.progress!==0){
            //         setProgress(client.progress * 100);
            //     }
            // }, 5000)
    
            client.add(state.torrents[index].hash,torrentOptions, torrent => {
                console.log("torrent started");
                
                setInterval(() => { 
                    if(torrent.progress!==0){
                        setProgress(torrent.progress * 100);
                    }
                    if(torrent.downloadSpeed!==0){
                        setDownloadSpeed(torrent.downloadSpeed/125)
                    }
                    console.log(`${torrent.progress * 100}%`);
                    console.log(torrent.downloadSpeed/125)
                }, 5000)
    
                torrent.on('done', () => {
                    console.log("Torrent complete 100%");
                    // clearInterval(interval)
                })
                
                torrent.on('warning',(err)=>{
                    console.log(err);
                })
    
                console.log(torrent.downloaded)
    
                torrent.on('metadata',()=>{
                    console.log("metadeta downloded");
                })
                settorrentFiles(torrent.files)
    
                // var mp4File = torrentFiles.find(function (file) {
                //     return file.name.endsWith('.mp4');
                    
                // });
                // setLoading(false);
    
                // console.log(mp4File);
                console.log(torrent.files);
                var file=torrent.files[0]
                file.renderTo(playerRef.current)
    
            })
        }
        // console.log("lund");
        run()

        return()=>{
            // clearInterval(interval)
            client.destroy()
        }
    }, [])
    
    //methods
    async function selectMoviequality(){
        const tempArr=[]
        state.torrents.forEach((data)=>{
            // console.log(data.seeds);
            tempArr.push(data.seeds)
        })

        let i=tempArr.indexOf(Math.max(...tempArr))

        // console.log("index of highest seed movie",i);
        setMovieQualityIndex(i)
        return i
    }

    return (
        <div className={styles.mainDiv}>
            <Container maxWidth="xl" className={styles.header}>
                <Typography noWrap className={styles.movieName} variant="h5" >{state.title}</Typography>
                <div className={styles.headerIcons} >
                    <Typography style={{color:"#fff"}}>{`${downloadSpeed.toFixed(2)} kbps`}</Typography>

                    <ToggleButtonGroup
                        exclusive
                        value={movieQualityIndex}
                        onChange={(e, value) => {
                            // console.log(value);
                            if (value === null) return
                            setMovieQualityIndex(value)
                        }}
                        size="medium"
                        style={{ height: '35px', marginRight: "15px", }}
                    >
                        {state.torrents.map((data, index) => {
                            if(data.quality==='3D') return
                            // console.log(index);
                            return (
                                <ToggleButton
                                    value={index}
                                    style={{ borderColor: "#fff", color: "#fff" }}
                                    classes={{
                                        selected: styles.selected
                                    }}
                                    key={index}
                                >
                                    {data.quality}
                                </ToggleButton>
                            )
                        })}
                    </ToggleButtonGroup>
                    <CircularProgressWithLabel value={progress} />
                </div>
            </Container>
            <div className={styles.player} maxWidth="xl">
                {!loading &&
                    <video
                        preload="auto"
                        url=""
                        poster={state.background_image_original}
                        controls={true}
                        ref={ref => playerRef.current = ref}
                        className={styles.play}
                        autoPlay={true}
                    />
                }
            </div>

        </div>
    )
}

export default VideoPlayer;

const useStyles = makeStyles({
    mainDiv: {
        // width: '100%',
        // height: '100%',
        position: 'relative',
        // background: "#14fa",
        display: 'flex',
        // padding: '5px',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        // background: "#15fa",
        justifyContent: "space-between"
    },
    player: {
        width: '100%',
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        // marginTop: "60px",
        // padding:0
    },
    play: {
        width: "100%",
        height: '82vh',
        borderRadius: '15px',
        objectFit: "cover",
        outline: "none",
        padding: '5px',
        "&:active,focus": {
            outline: "none",
        },
        "&:fullscreen":{
            objectFit:"contain"
        }
    },
    movieName: {
        width: "30%",
        color: "#fff",
        fontWeight: "bold",
        float: "left"
    },
    headerIcons: {
        float: 'right',
        display: 'flex',
        width: 'min-content',
        // background:"#fff",
        height: "55px",
        alignItems: "center"
    },
    selected: {
        background: "#fff !important",
        color: '#000 !important'
    }
})