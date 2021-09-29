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
    List, ListItem
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
import Dish1 from "../images/dish1.jpeg";
import { getAllResList, getFavResList, getResMenu } from '../app/reducers/mainSlice';
// import "./styles.css";
import RestaurantCard from './RestaurantCard';

const useStyles = makeStyles({
  gridContainer: {
    display: 'flex',
    paddingLeft: '40px',
    paddingRight: '40px',
    overflow: 'auto',
    justifyContent: 'start',
    flexWrap: 'wrap',
  },
  container: {
    marginTop: '160px',
  },
});

export default function CustomersLanding() {
    const mainReducer = useSelector((state) => state.mainReducer);
    useEffect(() => {
        getAllRestaurantApi();
        getFavouritesRestaurantApi();
    }, [])
    const dispatch = useDispatch()
    const history = useHistory();
    const classes = useStyles();

    const { customerProfile, token, allRestList, favResList } = mainReducer;
    const { customer_id, city } = customerProfile;
    console.log("customerProfile", customerProfile);

    const getAllRestaurantApi = async () => {
      const url =  `/restaurants?customer_city=${city}`;
        const headers = { 
          'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            await dispatch(getAllResList(res.data?.data))
            
        }catch(err){
            console.log(err)
        }

    }

    const getFavouritesRestaurantApi = async () => {
      const url =  `/customers/${customer_id}/favourites/`;
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            // console.log("response",res);
            await dispatch(getFavResList(res.data?.data))
            
        }catch(err){
            console.log(err)
        }

    }
    
    const addResToFavourites = async (res_id) => {
      const isPresent = favResList.find(elem => elem.res_id === res_id);
      if (isPresent) {
        // console.log("===========Already Present")
        return
      }
      const url =  `/customers/favourites/`;
      const headers = { 
          'x-access-token': token,
      };
      const body = {
        customer_id,
        res_id,
      }
      try {
          const res = await axios.post(url, body, {headers});
          console.log("response",res);
          await dispatch(getFavResList(res.data?.data))
          
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
        {/* <h1 className={classes.Header}>
                Customer Dashboard
            </h1> */}
        <Grid
          container
          spacing={4}
          className={classes.gridContainer}
          justifyContent="center"
        >
            {allRestList?.length > 0 && allRestList.map((res, key) => (
                <Grid item xs={12} sm={6} md={4}>
                    <RestaurantCard res={res} onResClick={onResClick} addResToFavourites={addResToFavourites}/>
                </Grid>
            ))
          }
        </Grid>
      </Box>
    </>
  );
}
