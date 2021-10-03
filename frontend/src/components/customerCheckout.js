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
import PropTypes from 'prop-types';
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
import { clearCart } from '../app/reducers/mainSlice';
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
    const [deliveryAddressList, setDeliveryAddressList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState();
    const [newAddess, setNewAddess] = useState();
    // const emails = ['username@gmail.com', 'user02@gmail.com'];
    const [open, setOpen] = useState(false);
    // const [selectedValue, setSelectedValue] = useState(emails[1]);
    const dispatch = useDispatch()
    useEffect(() => {
    //   getRestMenu();
      console.log("=================20")
      // dispatch(addDishToCart())
    }, [dispatch]);
    useEffect(() => {getDeliveryAddressesApi()}, []);
    const history = useHistory();
    const classes = useStyles();
    const handleClickOpen = () => {
        console.log("click open ======")
        setOpen(true);
    };

    const handleClose = () => {
      // value
        setOpen(false);
        // setSelectedValue(value);
    };
    const { customerProfile, token, cart = [] } = mainReducer;


   
    // /:id/dishes
    const getDeliveryAddressesApi = async () => {
        const url =  `/customers/${customer_id}}/delivery_address`;
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            setDeliveryAddressList(res.data?.data);
            // await dispatch(getAllResList(res.data?.data))
            
        }catch(err){
            console.log(err)
        }

    }

    const addDeliveryAddressesApi = async (delivery_address) => {
        const url =  `/customers/delivery_address`;
        const body = {
            customer_id,
            delivery_address,
        } 
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.post(url, body, {headers});
            console.log("response",res);
            setDeliveryAddressList(res.data?.data);
            setNewAddess('');
            // await dispatch(getAllResList(res.data?.data))
            
        }catch(err){
            console.log(err)
        }

    }
    // const reducer =(prev, current) => prev+ current?.dish?.dish_price
    let subTotalAmount = 0
    for (let resIndex = 0; resIndex < cart.length; resIndex++) {
        for (let dishIndex = 0; dishIndex < cart[resIndex].dishes?.length; dishIndex++ ) {
            subTotalAmount += cart[resIndex].dishes[dishIndex].dish_price * cart[resIndex].dishes[dishIndex].quantity
        }
    } 

    const deliveryFee = 0.00
    const taxes = 0.00
    const totalAmount =  deliveryFee * cart.length + taxes + subTotalAmount
    // console.log("===profile curstomer:", customerProfile);
    const {customer_id, street_address, zipcode, city, state, country} = customerProfile;
    const onCreateOrder = async () => {
        if (!selectedAddress) {
            alert("Select a delivery address");
            return
        }
        // console.log("======calling create order")
        const url =  `/customers/orders`;
        const body = {
            cart: cart,
            customer_id,
            delivery_type: 1,
            delivery_address: selectedAddress || `${street_address}, ${zipcode}, ${city}, ${state}, ${country}`,
            order_date_time: new Date().toISOString(),
            total_amount: totalAmount.toFixed(2),
            delivery_fee: deliveryFee,
            taxes: 0,
            instruction: '',
            tip: 0,
        }
        const headers = { 
            'x-access-token': token,
        };
        console.log("============body", body)
        try {
            const res = await axios.post(url, body, {headers});
            console.log("response",res);
            handleClose();
            alert("Your order is placed successfully");
            await dispatch(clearCart())
            history.push('/')
            
        }catch(err){
            console.log(err)
            alert(err)
        }

    }

    console.log("==cart", cart);
    console.log("===list", deliveryAddressList);
    return (
    <>
        <h1 style={{textAlign: 'center', marginTop: 20}}>Checkout Page</h1>
        <div style={{display: "flex", justifyContent: "stretch", marginTop: "50px"}}>
            <div style={{backgroundColor: "white", flex: 1}}>
                <List sx={{ pt: 0 }}>
                    <div style={{ paddingLeft: 10, paddingBottom: 20}}>
                    <Typography style={{alignSelf: 'center', textAlign: "center"}}>{`Ordered Items`}</Typography>

                    {cart?.length >0 &&  cart.map((cartItem, index) => {
                        return cartItem?.dishes?.length >0 && cartItem?.dishes.map((dish, dishIndex) => (
                            <ListItem key={index}>
                            <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0, paddingLeft: 100,  paddingRight: 100}}>
                            <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                {`${dish?.quantity}  ${dish?.dish_name}`}
                            </Typography>
                            <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                {`$ ${dish.dish_price}`}
                            </Typography>
                            </div>
                        </ListItem>
                        )
                        )
                    })}

                    <ListItem>
                        <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0, paddingLeft: 100,  paddingRight: 100}}>
                            <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                {`Total Amount:`}
                            </Typography>
                            <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                                {`$ ${subTotalAmount.toFixed(2)}`}
                            </Typography>
                        </div>
                    </ListItem>
                    </div>
                </List>
                <form style={{marginRight: 30, marginLeft: 30}}>
                    {deliveryAddressList?.length >0 &&
                        <TextField
                            id="selectedAddress"
                            select
                            fullWidth
                            label="selecte delivery Address"
                            style={{color: 'black', marginBottom: 10}}
                            value={selectedAddress}
                            onChange={e => setSelectedAddress(e.target.value)}
                            
                        >
                            {console.log('deliveryList', deliveryAddressList)}
                            {console.log('selectedAddress', selectedAddress)}
                            {deliveryAddressList.map((option) => (
                            <MenuItem key={option.delivery_address} value={option.delivery_address}>
                                {option.delivery_address}
                            </MenuItem>
                            ))}
                        </TextField>
                    }
                     <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="newAddess"
                        label="add new address"
                        type="text"
                        id="newAddess"
                        value={newAddess}
                        onChange={e => setNewAddess(e.target.value)}
                    />
                    <Button disabled={!newAddess} variant="outlined" style={{backgroundColor: 'black', color: 'white'}} onClick={() => addDeliveryAddressesApi(newAddess)}>Add</Button>
                </form>
                {/* <Button>Add a delivery Addres</Button> */}
            </div>
            <div style={{backgroundColor: "#F2F3F5", flex: 0.7, paddingLeft: 50, paddingRight: 50}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 10, paddingBottom: 0 }}>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`Subtotal Amount: `}
                        </Typography>
                        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                            {`$ ${subTotalAmount.toFixed(2)}`}
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
                            {`$ ${totalAmount.toFixed(2)}`}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "center"}}>
                    <Button 
                        size="medium" variant="outlined" color="primary" onClick={() => handleClickOpen()}
                        style={{alignSelf: 'center', backgroundColor: "green", color: "white", marginTop: 30, paddingLeft: 100, paddingRight: 100}}
                    >Place Order</Button>
                </div>
            </div>
            <SimpleDialog
                // selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                cart={cart}
                onCreateOrder={onCreateOrder}
      />
        </div>
      {/* <Navigationbar  showCart={true} onCartClick={handleClickOpen}/> */}
     
    </>
  );
}

function SimpleDialog(props) {
    const { onClose, open, cart=[], onCreateOrder = () => {} } = props;
  
    // const [error, setError] 
  
    const handleClose = () => {
      onClose();
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };

    const titleTxt = cart.length > 1 ? "Create Multiple Orders?": "Ready for placing order?"

    const contentTxt = cart.length > 1 ?  `you have orders from more than 1 restaurants. Do you want to create order for each restaurant` : `Your order will be placed once you click on create button`;
  
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle style={{alignSelf: "center", marginLeft: 100, marginRight: 100 }}>{titleTxt}</DialogTitle>
        <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
            {contentTxt}
        </Typography>
        <div style={{width: '100%', display: "flex", justifyContent: "center"}}>
          <Button size="large" onClick={() => onCreateOrder()} variant="outlined" color="primary" style={{ marginTop: 20,marginBottom: 20, paddingLeft: 100, paddingRight: 100, alignSelf: 'center', width: 100, backgroundColor: "black", color: "white"}}>Create</Button>
        </div>
      </Dialog>
    );
  }
  
  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    // selectedValue: PropTypes.string.isRequired,
  };
  
