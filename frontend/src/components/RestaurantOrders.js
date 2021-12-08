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
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    useMutation,
    useLazyQuery,
    gql,
  } from "@apollo/client";
import {
    Typography,
    Box,
    Grid,
    Hidden,
    Card,
    CardActions,
    CardActionArea,
    CardContent,
    List, ListItem, Link, FormControl, FormLabel, FormControlLabel, MenuItem, Radio, RadioGroup
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
import Navigationbar from './navigationbar';
import { addDishToCart, getAllResList, updateCustomerOrders, updateResOrders } from '../app/reducers/mainSlice';
import { capsStrFirstChar, getOrderStatus } from "../utility";
// import "./styles.css";
import ResDishCard from './ResDishCard';
import CartDialog from './CartDialog';
import { UPDATE_ORDER_STATUS } from "../graphql/mutation.js";

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
    const { resProfile, token, resOrders } = mainReducer;
    console.log("==resProfile", resProfile, token)
    const res_id = resProfile?._id;
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderFilter, setOrderFilter] = useState("0");
    const [listOnDisplay, setListOnDisplay] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
      getCustomersOrders();
    }, [dispatch])
    useEffect(() => {
        const orderDict = {
            0: [1,2,3,4,5,6,7],
            1: [1,2,3,5],
            2: [4,6],
            3: [7],
        }
        let allowedStatus =  orderDict[parseInt(orderFilter )];
        setListOnDisplay(resOrders.filter((order)=>  allowedStatus.includes(order.delivery_status))
    )}, [resOrders, orderFilter]);
    const history = useHistory();
    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const onClickViewReciept = async(order) => {
        setSelectedOrder(order);
        // const url =  `/customers/order/${order.order_id}`;
        // const headers = { 
        //     'x-access-token': token,
        // };
        // try {
        //     console.log('====url', url);
        //     const res = await axios.get(url, {headers});
        //     console.log("response",res);
            setSelectedOrderDetails(order?.order_items)
            // await dispatch(updateCustomerOrders(res.data?.data));
            
        // }catch(err){
        //     console.log(err)
        // }

        handleClickOpen();
    }

    const handleClose = () => {
        setOpen(false);
    };


    

    const getCustomersOrders = async () => {
        const url =  `/restaurants/${res_id}/orders`;
        const headers = { 
            'x-access-token': token,
        };
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            await dispatch(updateResOrders(res.data?.data));
            
        }catch(err){
            console.log(err)
        }

    }

    // const UPDATE_ORDER_STATUS = gql`
    //     mutation updateResOrderStatus(
    //         $res_id: String!, $order_id: String!, $delivery_status: Int!
    //     ) {
    //         updateResOrderStatus(
    //             res_id: $res_id, order_id: $order_id, delivery_status: $delivery_status
    //     ) {
    //         _id
    //         res_id
    //         res_name
    //         customer_id
    //         first_name
    //         last_name
    //         order_date_time
    //         delivery_address
    //         total_amount
    //         order_items {
    //         _id
    //         dish_name
    //         dish_price
    //         }
    //         delivery_type
    //         delivery_date_time
    //         delivery_status
    //         delivery_fee
    //         taxes
    //         tip
    //         instruction
    //     }
    //     }
    // `;

const [ updateResOrderStatus ] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted(res) {
      console.log("da", res);
      dispatch(updateResOrders(res.updateResOrderStatus));
    },
    onError(e) {
        alert(JSON.parse(JSON.stringify(e))?.message);
        console.log("--dfd", JSON.parse(JSON.stringify(e)));
    },
  });


    const updateOrderStatusApi = async (order_id, delivery_status, delivery_type) => {
        if (parseInt(delivery_status) === 7) {
            return 
        }
        const url =  `/restaurants/order`;
        const headers = { 
            'x-access-token': token,
        };
        let deliveryToOrderMap;
        if (parseInt(delivery_type) === 1) {
            deliveryToOrderMap = {
                1: 2,
                2: 3,
                3: 4,
                4: 4,
                7: 7
            }
        } else {
            deliveryToOrderMap = {
                1: 2,
                2: 5,
                5: 6,
                6: 6,
                7: 7,
            }
        }
        const body = {
            res_id,
            order_id,
            delivery_status: deliveryToOrderMap[parseInt(delivery_status)] || 1,
        }

        try {
            updateResOrderStatus({
                variables: { ...body },
              })
            // const res = await axios.put(url, body, {headers});
            // console.log("response",res);
            // await dispatch(updateResOrders(res.data?.data));
            
        }catch(err){
            console.log(err)
        }
    }

    const cancelOrderStatusApi = async (order_id, delivery_status, delivery_type) => {
        if ([7,6,4].includes(parseInt(delivery_status))) {
            return 
        }
        const url =  `/restaurants/order`;
        const headers = { 
            'x-access-token': token,
        };
        const body = {
            res_id,
            order_id,
            delivery_status: 7,
        }

        try {
            const res = await axios.put(url, body, {headers});
            console.log("response",res);
            await dispatch(updateResOrders(res.data?.data));
            
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
        <form style={{display: 'flex', justifyContent: 'start'}}>
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
                    <FormControlLabel value="1" control={<Radio />} label="New Orders" />
                    <FormControlLabel value="2" control={<Radio />} label="Delivered" />
                    <FormControlLabel value="3" control={<Radio />} label="Cancelled" />
                </RadioGroup>
            </FormControl>
        </form>
        {listOnDisplay?.length >0 && listOnDisplay.map((order, index) => (
            <ListItem key={index}>
                <Card style={{ width: "60%", display: "block", paddingLeft: 20,  paddingRight: 40}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <Button onClick={() => history.push({
                            pathname: '/customer_detail',
                            state: { customer: order }
                        })}>
                        <Typography variant="h6" color="black" style={{fontSize: 14}}>
                            {capsStrFirstChar(`${order?.first_name} ${order?.last_name}`)}
                        </Typography>
                        </Button>
                        <Typography variant="body2" style={{ color: order?.delivery_status === 7?  "red":  "green", textAlign: 'center'}}>
                            {capsStrFirstChar(`${getOrderStatus(order?.delivery_status)}`)}
                        </Typography>
                    </div>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="caption" style={{}}>
                                {`${moment(order.order_date_time).format('yyyy-MM-DD ddd hh:mm:ss')} `}
                        </Typography>
                        <Typography variant="caption" style={{paddingLeft: 5}}>
                            {`$${order.total_amount}`}
                        </Typography>
                        {/* <Link href="#">Link</Link> */}
                    </div>
                    <div style={{display: "flex", paddingTop: 10, paddingBottom: 10}}>
                    <Button 
                            size="small" variant="text" color="primary" onClick={() => onClickViewReciept(order)}
                            style={{alignSelf: 'center', backgroundColor: "green", color: "white", paddingLeft: 20, paddingRight: 20}}
                        >View Reciept</Button>
                     <Button size="small" variant="outlined" style={{marginLeft: 20, backgroundColor: "black", color: "white"}}
                        onClick={() => updateOrderStatusApi(order?._id, order?.delivery_status, order?.delivery_type)}>
                        Move to Next status
                    </Button>
                    { [1,2,3,5].includes(order?.delivery_status) &&
                        <Button size="small" variant="outlined" style={{marginLeft: 20, backgroundColor: "#CB0C0C", color: "white"}}
                            onClick={() => cancelOrderStatusApi(order?._id, order?.delivery_status, order?.delivery_type)}>
                            Cancel Order
                        </Button>
                    }
                     </div>
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
        <div style={{width: '100%', fontWeight: "bold", fontSize: 20, display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0, paddingLeft: 15, paddingRight: 20}}>
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
                <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <div style={{width: '100%', display: "flex", justifyContent: "stretch", alignItems: 'baseline'}}>
                            <Typography variant="body1" style={{fontSize: 13, color: 'black'}}>
                                {orderItem.quantity}
                            </Typography>
                            <Typography variant="body1" style={{fontSize:13, marginLeft: 30, color: 'black'}}>
                                {capsStrFirstChar(`${orderItem?.dish_name}`)}
                            </Typography>
                        </div>
                    </div>
                    <Typography variant="body1" style={{fontSize: 13, paddingRight: 5, marginLeft: 30, color: "black"}}>
                            {`$${orderItem.dish_price}`}
                        </Typography>
                
                </div>
            </ListItem>

        )
        )}
        { order.instruction &&
            <Typography variant="body1" style={{fontSize: 13, paddingRight: 30, marginLeft: 16, color: "black", textAlign: 'start'}}>
                { `Special Instruction: ${order.instruction} \n`}
            </Typography>
        }
        <Typography variant="body1" style={{fontSize: 13, paddingRight: 30, marginLeft: 16, color: "black", textAlign: 'start'}}>
            { `Delivered at: ${order.delivery_address}`}
        </Typography>
    </div>
      </Dialog>
    );
  }
  