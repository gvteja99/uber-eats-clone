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
//   gridContainer: {
//     display: 'flex',
//     paddingLeft: '40px',
//     paddingRight: '40px',
//     overflow: 'auto',
//     justifyContent: 'start',
//     flexWrap: 'wrap',
//   },
//   container: {
//     marginTop: '160px',
//   },
});

export default function CustomerCheckout(props) {
    const mainReducer = useSelector((state) => state.mainReducer);
    // const [selectedResMenu, setSelectedResMenu] = useState([]);
    // const emails = ['username@gmail.com', 'user02@gmail.com'];
    // const [open, setOpen] = useState(false);
    // const [selectedValue, setSelectedValue] = useState(emails[1]);
    const dispatch = useDispatch()
    useEffect(() => {
    //   getRestMenu();
      console.log("=================20")
      // dispatch(addDishToCart())
    }, [dispatch])
    const history = useHistory();
    const classes = useStyles();
    const { customerProfile, token, cart = [] } = mainReducer;
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = (value) => {
    //     setOpen(false);
    //     setSelectedValue(value);
    // };

    // console.log("=====props", props);
    // const { selectedRes = {} } = props?.location?.state;
    // console.log("=====selectedres", selectedRes)
    // // props.location.state.detail
    // console.log("=====selectedRes", selectedRes);
    // console.log("customerProfile", customerProfile);

    // const onAddToCartClick = async (res, dish) => {
    //   if (!token) {
    //     return
    //   }
    //   const found = cart.find(item => item?.dish?.res_menu_id === dish?.res_menu_id);
    //   console.log("===found", found);
    //   if (found) {
    //     return
    //   }
    //   await dispatch(addDishToCart({res, dish}))
    //   // await dispatch(addDishToCart());

    // };


    // const url =  `/restaurants/${selectedRes.res_id}/dishes`;
    // /:id/dishes
    // const getRestMenu = async () => {
    //     const headers = { 
    //         'x-access-token': token,
    //     };
    //     try {
    //         const res = await axios.get(url, {headers});
    //         console.log("response",res);
    //         setSelectedResMenu(res.data?.data);
    //         // await dispatch(getAllResList(res.data?.data))
            
    //     }catch(err){
    //         console.log(err)
    //     }

    // }
    const reducer =(prev, current) => prev+ current?.dish?.dish_price

    const subTotalAmount = cart.reduce(reducer, 0);
    const deliveryFee = 0.00
    const taxes = 0.00
    const totalAmount =  deliveryFee + taxes + subTotalAmount

    console.log("==cart", cart);
    return (
    <>
        <h1>Checkout Page</h1>
        <div style={{display: "flex", justifyContent: "stretch", marginTop: "50px"}}>
            <div style={{backgroundColor: "white", flex: 1}}>
                <List sx={{ pt: 0 }}>
                    <div style={{ paddingLeft: 10, paddingBottom: 20}}>
                    <Typography style={{alignSelf: 'center', textAlign: "center"}}>{`Ordered Items`}</Typography>
                    {cart?.length >0 && cart.map((cartItem, index) => (
                        // <ListItem button onClick={() => handleListItemClick(email)}>
                        <ListItem key={index}>
                            <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0,paddingLeft: 100,  paddingRight: 100}}>
                                <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                    {`${cartItem?.quantity}  ${cartItem?.dish?.dish_name}`}
                                </Typography>
                                <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                    {`$ ${cartItem?.dish?.dish_price}`}
                                </Typography>
                            </div>
                        </ListItem>
                    ))}

                    <ListItem>
                        <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0, paddingLeft: 100,  paddingRight: 100}}>
                            <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                {`Total Amount:`}
                            </Typography>
                            <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                {`$ ${subTotalAmount}`}
                            </Typography>
                        </div>
                    </ListItem>
                    </div>
                </List>
            </div>
            <div style={{backgroundColor: "#F2F3F5", flex: 0.7, paddingLeft: 50, paddingRight: 50}}>
                <div style={{width: '100%', display: "flex", justifyContent: "center"}}>
                    <Button size="medium" variant="outlined" color="primary" style={{alignSelf: 'center', backgroundColor: "green", color: "white", paddingLeft: 100, paddingRight: 100}}>Place Order</Button>
                </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 10, paddingBottom: 0 }}>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`Subtotal Amount: `}
                        </Typography>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`$ ${subTotalAmount}`}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 10, paddingBottom: 0 }}>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`Delivery Fee: `}
                        </Typography>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`$ ${deliveryFee}`}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 10, paddingBottom: 0 }}>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`Taxes: `}
                        </Typography>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`$ ${taxes}`}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 10, paddingBottom: 0 }}>
                        <Typography variant="h6" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`Total: `}
                        </Typography>
                        <Typography variant="h6" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`$ ${totalAmount}`}
                        </Typography>
                    </div>
            </div>
        </div>
      {/* <Navigationbar  showCart={true} onCartClick={handleClickOpen}/> */}
     
    </>
  );
}
