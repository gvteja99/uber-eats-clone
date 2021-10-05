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
    List, ListItem, Link, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup
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
    const [orderFilter, setOrderFilter] = useState("0");
    const [listOnDisplay, setListOnDisplay] = useState([]);

    const { customerProfile, token, cart = [], customerOrders } = mainReducer;
    const { customer_id } = customerProfile

    const dispatch = useDispatch()
    useEffect(() => {
      getCustomersOrders();
    }, [dispatch])

    useEffect(() => {
        let allowedStatus = parseInt(orderFilter )=== 0 ? [1,2,3,4,5,6] : (parseInt(orderFilter ) === 1 ? [1,2,3,5] : [4,6])
        setListOnDisplay(customerOrders.filter((order)=>  allowedStatus.includes(order.delivery_status))
    )}, [customerOrders, orderFilter]);
    const history = useHistory();
    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const onClickViewReciept = async(order) => {
        setSelectedOrder(order);
        const url =  `/customers/order/${order.order_id}`;
        const headers = { 
            'x-access-token': token,
        };
        try {
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
            {'Orders'}
        </h1>
        <form style={{display: 'flex', justifyContent: 'flex-start'}}>
        <FormControl component="fieldset" style={{marginLeft: '40px', marginRight: '40px', marginBottom: '20px'}}>
            <FormLabel component="legend" style={{color: "blue"}}>Delivery Option</FormLabel>
                <RadioGroup
                    // aria-label="gender"
                    row
                    name="controlled-radio-buttons-group"
                    // defaultChecked={true}
                    // defaultValue={"1"}
                    value={orderFilter}
                    onChange={e => setOrderFilter(e.target.value)}
                >
                    <FormControlLabel value="0" control={<Radio />} label="All" />
                    <FormControlLabel value="1" control={<Radio />} label="Current Orders" />
                    <FormControlLabel value="2" control={<Radio />} label="Past Orders" />
                </RadioGroup>
            </FormControl>
        </form>
        {listOnDisplay?.length >0 && listOnDisplay.map((order, index) => (
            <ListItem key={index}>
                <Card style={{ width: "60%", display: "block", marginLeft: "20px", paddingLeft: 10,  paddingRight: "40px"}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="h6" color="black" style={{}}>
                            {capsStrFirstChar(`${order?.res_name}`)}
                        </Typography>
                        <Typography variant="body2" style={{ color: "green"}}>
                            {capsStrFirstChar(`${getOrderStatus(order?.delivery_status)}`)}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="body2" color="black" style={{fontSize: 11, marginBottom: 3}}>
                                {`${moment(order.order_date_time).format('yyyy-MM-DD ddd hh:mm:ss')} `}
                        </Typography>
                        <Typography variant="caption" color="black" style={{paddingLeft: 5}}>
                            {`$ ${order.total_amount}`}
                        </Typography>
                        {/* <button>View Reciept</button> */}
                        {/* <Link href="#">Link</Link> */}
                    </div>
                    <Button 
                            size="small" variant="text" color="primary" onClick={() => onClickViewReciept(order)}
                            style={{alignSelf: 'center', backgroundColor: "green", color: "white", paddingLeft: 20, paddingRight: 20, marginTop: 10, marginBottom: 10}}
                        >View Reciept</Button>
                </Card>
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
        <div style={{width: "100%", alignSelf: "center" }}>
            <div style={{width: '100%', fontWeight: "bold", fontSize: 20, display: "flex", justifyContent: "space-between",paddingLeft: 16, paddingRight: 20, paddingTop: 0, paddingBottom: 20}}>
                <Typography variant="body1" color="black" style={{color: 'black'}}>
                    {`Total `}
                </Typography>
                <Typography variant="body1" style={{marginLeft: 30, fontSize: 16, color: "black"}}>
                        {`$${order.total_amount}`}
                </Typography>
                {/* <div style={{flex: 1, display: "flex", justifyContent: "end", paddingTop: 0, paddingBottom: 0}}>
                </div> */}
            </div>
        {   orderDetails?.length >0 && orderDetails.map((orderItem, index) => (
            <ListItem key={index}>
                <div style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <div style={{width: '100%', display: "flex", justifyContent: "stretch", alignItems: 'baseline'}}>
                            <Typography variant="body1" style={{fontSize: 13, color: 'black'}}>
                                {orderItem.quantity}
                            </Typography>
                            <Typography variant="body1" style={{fontSize:13, marginLeft: 30, color: 'black'}}>
                                {capsStrFirstChar(`${orderItem?.dish_name}`)}
                            </Typography>
                        </div>
                        <Typography variant="body1" style={{fontSize: 13, paddingRight: 5, marginLeft: 30, color: "black", textAlign: 'end'}}>
                            {`$${orderItem.dish_price}`}
                        </Typography>
                    </div>
                </div>
            </ListItem>
        )
        )}
        <Typography variant="body1" style={{fontSize: 13, paddingRight: 30, marginLeft: 16, color: "black", textAlign: 'start'}}>
            { `Delivered at: ${order.delivery_address}`}
        </Typography>
     </div>
      </Dialog>
    );
  }
  