/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-filename-extension */
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {makeStyles, withStyles } from '@material-ui/core/styles';
import moment from "moment";
import {
    Typography,
    Box,
    Grid,
    Hidden,
    Card,
    CardActions,
    CardActionArea,
    CardContent,
    List, ListItem, Link
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
import { addDishToCart, getAllResList, updateCustomerOrders } from '../app/reducers/mainSlice';
import { capsStrFirstChar, getOrderStatus } from "../utility";
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

export default function CustomerOrders(props) {
    const mainReducer = useSelector((state) => state.mainReducer);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
      getCustomersOrders();
    }, [dispatch])
    const history = useHistory();
    const classes = useStyles();
    const { customerProfile, token, cart = [], customerOrders } = mainReducer;
    const { customer_id } = customerProfile
    const handleClickOpen = () => {
        setOpen(true);
    };

    const onClickViewReciept = async(order) => {
        setSelectedOrder(order);
        console.log("===order", order);
        const url =  `/customers/order/${order.order_id}`;
        const headers = { 
            'x-access-token': token,
        };
        try {
            console.log('====url', url);
            const res = await axios.get(url, {headers});
            console.log("response",res);
            setSelectedOrderDetails(res.data?.data)
            // await dispatch(updateCustomerOrders(res.data?.data));
            
        }catch(err){
            console.log(err)
        }

        handleClickOpen();
    }

    const handleClose = () => {
        setOpen(false);
    };


    

    const url =  `/customers/${customer_id}/orders`;
    const getCustomersOrders = async () => {
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            await dispatch(updateCustomerOrders(res.data?.data));
            
        }catch(err){
            console.log(err)
        }

    }

    return (
    <>
      <Navigationbar />
      <Box component="div" className={classes.container}>
        <h1 className={classes.Header} style={{marginLeft: '40px', marginBottom: '20px'}}>
            {'Past Orders'}
        </h1>
        {customerOrders?.length >0 && customerOrders.map((order, index) => (
            <ListItem key={index}>
                <div style={{display: "block", paddingLeft: 50,  paddingRight: 50}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="h6" color="black" style={{}}>
                            {capsStrFirstChar(`${order?.res_name}`)}
                        </Typography>
                        <Typography variant="body2" style={{ color: "green"}}>
                            {capsStrFirstChar(`${getOrderStatus(order?.delivery_status)}`)}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "start", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="caption" color="black" style={{}}>
                                {`${moment(order.order_date_time).format('yyyy-MM-DD ddd hh:mm:ss')} `}
                        </Typography>
                        <Typography variant="caption" color="black" style={{paddingLeft: 5}}>
                            {`Amount Paid: $ ${order.total_amount}`}
                        </Typography>
                        <Button 
                            size="small" variant="text" color="primary" onClick={() => onClickViewReciept(order)}
                            style={{alignSelf: 'center', backgroundColor: "green", color: "white", paddingLeft: 100, paddingRight: 100}}
                        >View Reciept</Button>
                        {/* <Link href="#">Link</Link> */}
                    </div>
                </div>
            </ListItem>
        )
        )}
      </Box>
      <SimpleDialog
        // selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        order={selectedOrder}
        orderDetails={selectedOrderDetails}
        // onCreateOrder={onCreateOrder}
      />
    </>
  );
}

function SimpleDialog(props) {
    const { onClose, open, order={}, orderDetails={}} = props;
  
    // const [error, setError] 
  
    const handleClose = () => {
      onClose();
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };
  
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle style={{alignSelf: "center", marginLeft: 100, marginRight: 100 }}>Reciept</DialogTitle>
        <div style={{width: '100%', fontWeight: "bold", fontSize: 20, display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0, paddingLeft: 30, paddingRight: 30}}>
            <Typography variant="body1" color="black" style={{color: 'black'}}>
                {`Total `}
            </Typography>
            <Typography variant="body1" style={{marginLeft: 30, fontSize: 20, color: "black"}}>
                    {`$ ${order.total_amount}`}
            </Typography>
            {/* <div style={{flex: 1, display: "flex", justifyContent: "end", paddingTop: 0, paddingBottom: 0}}>
            </div> */}
        </div>
        {orderDetails?.length >0 && orderDetails.map((orderItem, index) => (
            <ListItem key={index}>
                <div style={{display: "block", paddingLeft: 30}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <div style={{width: '100%', display: "flex", justifyContent: "start"}}>
                            <Typography variant="body1" color="black" style={{color: 'black'}}>
                                {orderItem.quantity}
                            </Typography>
                            <Typography variant="body1" color="black" style={{marginLeft: 30, color: 'black'}}>
                                {capsStrFirstChar(`${orderItem?.dish_name}`)}
                            </Typography>
                        </div>
                        <Typography variant="body1" style={{marginLeft: 30, color: "black", width: 300, textAlign: 'end'}}>
                            {`$ ${orderItem.dish_price}`}
                        </Typography>
                    </div>
                    {/* <div style={{width: '100%', display: "flex", justifyContent: "start", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="caption" color="black" style={{}}>
                                {`${moment(orderItem.order_date_time).format('yyyy-MM-DD ddd hh:mm:ss')} `}
                        </Typography>
                        <Typography variant="caption" color="black" style={{paddingLeft: 5}}>
                            {`Amount Paid: $ ${orderItem.total_amount}`}
                        </Typography>}
                    </div> */}
                </div>
            </ListItem>
        )
        )}
      </Dialog>
    );
  }
  