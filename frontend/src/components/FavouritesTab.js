/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-filename-extension */
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {makeStyles, withStyles } from '@material-ui/core/styles';
import {
    Typography,
    Box,
    Grid,
    Hidden,
    Card,
    CardActions,
    CardActionArea,
    CardContent,
    List,
    ListItem,
    CardMedia,
    IconButton,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { orange, teal } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Navigationbar from './navigationbar';
import { getAllResList, getFavResList, getResMenu, deleteResFromFavList } from '../app/reducers/mainSlice';

import Dish1 from "../images/dish1.jpeg";
import Dish2 from "../images/dish2.jpeg";
import Dish3 from "../images/dish3.jpeg";
import Dish4 from "../images/dish4.jpeg";
import { random } from '../utility';

const useStyles = makeStyles({
  gridContainer: {
    display: 'flex',
    paddingLeft: '40px',
    paddingRight: '40px',
    overflow: 'auto',
    justifyContent: 'start',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  container: {
    marginTop: '100px',
  },
});

const imgList = [Dish1, Dish2, Dish3, Dish4];

export default function CustomersLanding() {
    const mainReducer = useSelector((state) => state.mainReducer);
    useEffect(() => {
        // getAllRestaurantApi();
        getFavouritesRestaurantApi();
    }, [])
    const dispatch = useDispatch()
    const history = useHistory();
    const classes = useStyles();

    const { customerProfile, token, allRestList, favResList } = mainReducer;
    const customer_id  = customerProfile._id;
    console.log("customerProfile", customerProfile);

    // const getAllRestaurantApi = async () => {
    //   const url =  "/restaurants";
    //     const headers = { 
    //         'x-access-token': token,
    //     };
    //     try {
    //         const res = await axios.get(url, {headers});
    //         console.log("response",res);
    //         await dispatch(getAllResList(res.data?.data))
            
    //     }catch(err){
    //         console.log(err)
    //     }

    // }

    const getFavouritesRestaurantApi = async () => {
      const url =  `/customers/${customer_id}/favourites/`;
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            await dispatch(getFavResList(res.data?.data))
            
        }catch(err){
            console.log(err)
        }

    }
    console.log("====favResList====", favResList);
    
    const removeResToFavourites = async (res_id) => {
      // console.log("====favourite_id====", res_id);
      const isPresent = favResList.find(elem => elem._id === res_id);
      if (!isPresent) {
        console.log("===========Already Not Present")
        return
      }
      const url =  `/customers/${customer_id}/favourites/${res_id}`;
      const headers = { 
          'x-access-token': token,
      };
      try {
          const res = await axios.delete(url, {headers});
          console.log("response",res);
          await dispatch(deleteResFromFavList({resFavList: res?.data?.data }))
          
      }catch(err){
          console.log(err)
      }
    }



    const onResClick = res => {
        // dispatch(updateResProfile(res.data))
        history.push({
            pathname: '/restaurant/landing',
            // search: '?query=abc',
            state: { selectedRes: res }
          })
        // setTimeout(() => history.push("/"), 500);
        // history.
    }
    return (
    <>
      <Navigationbar />
      <Box component="div" className={classes.container}>
        <h1 style={{textAlign: 'center', marginTop: 0}}>
                Favourites
            </h1>
        <Grid
          container
          spacing={4}
          className={classes.gridContainer}
          justifyContent="center"
        >
            {favResList?.length > 0 && favResList.map((res, key) => (
                <Grid item xs={12} sm={6} md={4}>
                    <FavResCard res={res} onResClick={onResClick} removeResToFavourites={removeResToFavourites}/>
                </Grid>
            ))
          }
        </Grid>
      </Box>
    </>
  );
}

function FavResCard(props) {
    const {
        res,
        onResClick = () => {},
        removeResToFavourites = () => {},
     } = props
    return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imgList[random(0,3)]}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {res?.name || "subway"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {res.description || "A nice restaurant"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" onClick={() => removeResToFavourites(res._id)}>Remove from favourites</Button>
        <Button size="small" variant="outlined" onClick={() =>onResClick(res)}>Check Menu</Button>
      </CardActions>
    </Card>
  );
}

