import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles'
import {
    Grid,
    Box
} from '@material-ui/core';
import Carousel from 'react-bootstrap/Carousel';
import Res1 from '../images/dish1.jpeg';
import Res2 from '../images/dish2.jpeg';
import Res3 from '../images/dish3.jpeg'; 


// CSS styles
const useStyles = makeStyles(theme => ({
    avatar: {
        margin: theme.spacing(2),
        width: theme.spacing(16),
        height: theme.spacing(16),
    },
    title: {
        color: 'yellow'
    },
    container: {
        marginTop: '162px',
    },
    subtitle: {
        color: 'tan',
        marginBottom: '2.5rem'
    },
    typedContainer: {
        position: 'absolute',
        top: '51%',
        width: '100vw',
        textAlign: 'center',
        zIndex: 1,
        left: '51%',
        transform: 'translate(-50%, -50%)',
    },

}))


const Dashboard = () => {
    const mainReducer = useSelector((state) => state.mainReducer)
    console.log("")
    const [allResList, setAllResList] = useState([]);
    useEffect(() => {
        getAllRestaurants();
    }, [])
    const url = "/restaurants"
    const getAllRestaurants = async() => {
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "x-access-token": "",
            },
        }).then((response) => {
            console.log("response:", JSON.stringify(response))
            return response.json()
        });
        await setAllResList(resp);
        console.log("===restList", resp);
    }
    const classes = useStyles();
    // const resImgList = [
    //     {url: Res1},
    //     {url: Res2},
    //     {url: Res3},
    // ];

    return (
        <Box component='div' className={classes.container}>
            <Grid container justifyContent="center">
                <div className='container-fluid' >  
                    <div className="row title" style={{ marginBottom: "20px" }} >  
                    </div>  
                </div>  
                <div className='container-fluid' >  
                    <Carousel variant="dark">
                        <Carousel.Item style={{height:"400px"}} >  
                            <img style={{height:"400px"}}  
                            className="d-block w-100"  
                            src={Res1} alt='' />  
                        </Carousel.Item  >
                        <Carousel.Item style={{height:"400px"}} >  
                            <img style={{height:"400px"}}  
                            className="d-block w-100"  
                            src={Res2} alt='' />  
                        </Carousel.Item  >
                        <Carousel.Item style={{height:"400px"}} >  
                            <img style={{height:"400px"}}  
                            className="d-block w-100"  
                            src={Res3} alt='' />  
                        </Carousel.Item  >
                    </Carousel>  
                </div>  
            </Grid>
        </Box>
    )
}

export default Dashboard
