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
    List, ListItem, Link, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup,
    TablePagination, TextField,
} from '@material-ui/core';
// import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { orange, teal } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Navigationbar from './navigationbar';
import { addDishToCart, cancelCustomerOrder, getAllResList, updateCustomerOrders } from '../app/reducers/mainSlice';
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);


    const { customerProfile, token, cart = [], customerOrders } = mainReducer;
    const customer_id  = customerProfile._id;

    const dispatch = useDispatch()
    useEffect(() => {
      getCustomersOrders();
    }, [dispatch])

    useEffect(() => {
        let allowedStatus = parseInt(orderFilter )=== 0 ? [1,2,3,4,5,6,7] : (parseInt(orderFilter ) === 1 ? [1,2,3,5] : [4,6,7])
        setListOnDisplay(customerOrders.filter((order)=>  allowedStatus.includes(order.delivery_status))
    )}, [customerOrders, orderFilter]);
    const history = useHistory();
    const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
    };

    // const onClickViewReciept = async(order) => {
    const onClickViewReciept = (order) => {
        setSelectedOrder(order);
        // const url =  `/customers/order/${order._id}`;
        // const headers = { 
        //     'x-access-token': token,
        // };
        // try {
            // const res = await axios.get(url, {headers});
            // console.log("response",order?.order_items);
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


    const getCustomersOrders = async (page, pageSize) => {
        const headers = { 
            'x-access-token': token,
        };
        const url =  `/customers/${customer_id}/orders?page=${page || 1}&pageSize=${pageSize||5}`;
        try {
            const res = await axios.get(url, {headers});
            console.log("response",res);
            await dispatch(updateCustomerOrders(res.data?.data));
            setPage(parseInt(res.data.page));
            setPageSize(parseInt(res.data.pageSize));
            
            
        }catch(err){
            console.log(err)
        }

    }

    const prevPage = (e) => {
        // let page = this.state.page;
        let page_number = page;
        if (page === 1)
            return;
        // else{
        //      // page -= 1;
        //     setPage(page_number -1)
        // }
        getCustomersOrders(page_number -1, pageSize);
    }

    const nextPage = (e) => {
        let page_number = page;
        console.log("page", page, "pagesize", pageSize);
        // setPage(page_number + 1)
        getCustomersOrders(page_number+1, pageSize);
    }


    const cancelOrderStatusApi = async ({order}) => {
        console.log("order", order);
        const order_id =  order?._id;
        const res_id = order?.res_id;
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
            console.log("body", body)
            const res = await axios.put(url, body, {headers});
            console.log("response",res);
            await dispatch(cancelCustomerOrder({order}));
            
        }catch(err){
            console.log(err)
        }

    }

    const pageSizeOptions = [
        {
          value: '2',
          label: '2',
        },
        {
          value: '5',
          label: '5',
        },
        {
            value: '10',
            label: '10',
        }
      ];
    

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
        {/* {console.log("size:", pageSize, typeof(pageSize))} */}
        <TextField
            id="pageSize"
            select
            label="Page Size"
            value={pageSize.toString()}
            style={{color: "blue", width: 100}}
            onChange={e => {
                getCustomersOrders(1,parseInt(e.target.value))
                setPageSize(parseInt(e.target.value))
            }}
        >
            {pageSizeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
            </TextField>
        </form>
        {listOnDisplay?.length >0 && listOnDisplay.map((order, index) => (
            <ListItem key={index}>
                <Card style={{ width: "60%", display: "block", marginLeft: "20px", paddingLeft: 10,  paddingRight: "40px"}}>
                    <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                        <Typography variant="h6" color="black" style={{}}>
                            {capsStrFirstChar(`${order?.res_name}`)}
                        </Typography>
                        <Typography variant="body2" style={order?.delivery_status === 7? {color: "red"}: { color: "green"}}>
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
                    {order.delivery_status === 1 &&
                        <Button size="small" variant="text" onClick={() => {cancelOrderStatusApi({order})}}
                            style={{alignSelf: 'center', backgroundColor: "#CB0C0C", color: "white", marginLeft: 25, paddingLeft: 20, paddingRight: 20, marginTop: 10, marginBottom: 10}}
                        >
                        Cancel Order
                        </Button>
                    }
                    
                </Card>
            </ListItem>
        )
        )}
        {/* <TablePagination
            rowsPerPageOptions={[2, 5, 10]}
            component="div"
            count={orderDetails.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
        (
        <div className="col-sm-12 justify-content-center mt-1">
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className="page-item ">
                        <div className="page-link" onClick={() => prevPage()} aria-label="Previous"><span aria-hidden="true">&laquo;</span></div>
                    </li>
                    <li className="page-item">
                        <div className="page-link" onClick={() => nextPage()} aria-label="Next"><span aria-hidden="true">&raquo;</span></div>
                    </li>
                </ul>
            </nav>
        </div>
            );
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
  