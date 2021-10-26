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
    List, ListItem,
    Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment
} from '@material-ui/core';
import {useForm, Controller} from 'react-hook-form'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
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
import Navigationbar from './navigationbar';
import Dish1 from "../images/dish1.jpeg";
import { getAllResList, getFavResList, getResMenu } from '../app/reducers/mainSlice';
// import "./styles.css";
import RestaurantCard from './RestaurantCard';
import CartDialog from './CartDialog';

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
    marginTop: '120px',
  },
});

export default function CustomersLanding() {
  const mainReducer = useSelector((state) => state.mainReducer);
    const { customerProfile, token, allRestList, favResList, cart } = mainReducer;
    const [deliveryOption, setDeliveryOption] = useState("2");
    const [searchValue, setSearchValue] = useState("");
    const [open, setOpen] = useState(false);

    const [listOnDisplay, setListOnDisplay] = useState([]);

    const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
    // value
      setOpen(false);
      // setSelectedValue(value);
  };

  const onCartCheckout = (value) => {
    history.push("/customer_checkout");
    handleClose();
  }
    console.log("======deliveryOption", deliveryOption);
    useEffect(() => {
        getAllRestaurantApi();
        getFavouritesRestaurantApi();
    }, [])
    useEffect(() => {
      
      setListOnDisplay(allRestList.filter((res)=>  res.delivery_option === 1 || res.delivery_option === parseInt(deliveryOption)))

    }, [allRestList, deliveryOption])
    const dispatch = useDispatch();
    const {register, handleSubmit, control} = useForm()
    const history = useHistory();
    const classes = useStyles();
   console.log("=========setViewList", listOnDisplay);
    // const { customerProfile, token, allRestList, favResList } = mainReducer;
    
    const { city } = customerProfile;
    const customer_id = customerProfile?._id;
    console.log("customerProfile", customerProfile);

    const getAllRestaurantApi = async () => {
      const url =  `/restaurants?customer_city=${city}&search=${searchValue}`;
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
      // console.log("FAV RES LIST", favResList, "\nRESID", res_id);
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
      <Navigationbar  showCart={true} onCartClick={handleClickOpen}/>
      <Box component="div" className={classes.container}>
        {/* <h1 className={classes.Header}>
                Customer Dashboard
            </h1> */}
        <form style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center',  marginBottom: '25px'}}>
        <TextField
              variant="outlined"
              margin="normal"
              // , { required: true }
              inputRef={{...register('searchValue')}}
              // required
              // 
              
              name="searchValue"
              label="search by name or city"
              type="text"
              id="searchValue"
              value={searchValue}
              style={{ width: 300}}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getAllRestaurantApi()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={e => setSearchValue(e.target.value)}
            />
        <FormControl component="fieldset" style={{marginLeft: '40px', marginRight: '40px'}}>
            <FormLabel component="legend" style={{color: "blue"}}>Delivery Option</FormLabel>
            <RadioGroup
                // aria-label="gender"
                row
                name="controlled-radio-buttons-group"
                value={deliveryOption}
                onChange={e => setDeliveryOption(e.target.value)}
            >
                <FormControlLabel value="2" control={<Radio />} label="Delivery" />
                <FormControlLabel value="3" control={<Radio />} label="Pickup" />
            </RadioGroup>
            </FormControl>
        </form>
        <Grid
          container
          spacing={4}
          className={classes.gridContainer}
          justifyContent="center"
        >
            {listOnDisplay?.length > 0 && listOnDisplay.map((res, key) => (
                <Grid item xs={12} sm={6} md={4}>
                    <RestaurantCard res={res} onResClick={onResClick} addResToFavourites={addResToFavourites}/>
                </Grid>
            ))
          }
        </Grid>
      </Box>
      <CartDialog
        open={open}
        onClose={handleClose}
        cart={cart}
        onCartCheckout={onCartCheckout}
      />
    </>
  );
}
