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
import { addDishToCart, getAllResList } from '../app/reducers/mainSlice';
import { capsStrFirstChar } from "../utility";
// import "./styles.css";
import ResDishCard from './ResDishCard';
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
    marginTop: '160px',
  },
});

export default function ResLanding(props) {
    const mainReducer = useSelector((state) => state.mainReducer);
    const [selectedResMenu, setSelectedResMenu] = useState([]);
    const emails = ['username@gmail.com', 'user02@gmail.com'];
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(emails[1]);
    const dispatch = useDispatch()
    useEffect(() => {
      getRestMenu();
      // console.log("=================20")
      // dispatch(addDishToCart())
    }, [dispatch])
    const history = useHistory();
    const classes = useStyles();
    const { customerProfile, token, cart = [] } = mainReducer;
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

    // console.log("=====props", props);
    const { selectedRes = {} } = props?.location?.state;
    // console.log("=====selectedres", selectedRes)
    // props.location.state.detail
    // console.log("=====selectedRes", selectedRes);
    // console.log("customerProfile", customerProfile);

    const onAddToCartClick = async (res, dish) => {
      if (!token) {
        return
      }
      // const found = cart.find(item => item?.dish?.res_menu_id === dish?.res_menu_id);
      // console.log("===found", found);
      // if (found) {
      //   return
      // }
      await dispatch(addDishToCart({res, dish}))
      // await dispatch(addDishToCart());


    };


    const url =  `/restaurants/${selectedRes.res_id}/dishes`;
    // /:id/dishes
    const getRestMenu = async () => {
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            setSelectedResMenu(res.data?.data);
            // await dispatch(getAllResList(res.data?.data))
            
        }catch(err){
            console.log(err)
        }

    }

    // console.log("==cart", cart);
    return (
    <>
      <Navigationbar  showCart={true} onCartClick={handleClickOpen}/>
      <Box component="div" className={classes.container}>
        <h1 className={classes.Header} style={{marginLeft: '40px', marginBottom: '20px'}}>
                {capsStrFirstChar(selectedRes.name || 'subway')}
            </h1>
        <Grid
          container
          spacing={4}
          className={classes.gridContainer}
          justifyContent="center"
        >
            {selectedResMenu?.length > 0 && selectedResMenu.map((dish, key) => (
                <Grid item xs={12} sm={6} md={4}>
                    <ResDishCard dish={dish} res={selectedRes} onAddToCartClick={onAddToCartClick}/>
                </Grid>
            ))
          }
        </Grid>
      </Box>
      <CartDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        cart={cart}
        onCartCheckout={onCartCheckout}
      />
    </>
  );
}
