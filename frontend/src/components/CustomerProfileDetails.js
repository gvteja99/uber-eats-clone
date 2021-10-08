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
    CardMedia,
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
    marginTop: '40px',
    marginLeft: '40px',
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
});

export default function CustomerOrders(props) {
    const { customer = {} } = props?.location?.state;
    const { first_name, last_name, email, profile_pic} = customer;
    const classes = useStyles();

    return (
    <>
      {/* <Navigationbar /> */}
      <Box component="div" className={classes.container}>
      {profile_pic &&
               <Card style={{ width: 140, backgroundColor: "transparent" }}>
               <CardMedia
                 component="img"
                //  height="140"
                 style={{borderRadius: 70, height: 140, width: 140}}
                 src={`/customers/profile_pic/${profile_pic|| 'placeholder.png'}`}
                 title="profile pic"
                 alt="loading"
                 />
           </Card>
            }
        <h1 className={classes.Header} style={{ marginBottom: '20px'}}>
            {`${first_name} ${last_name}`}
        </h1>
        <Typography variant="caption" style={{}} className={"email"}>
            {`${customer.email} `}
        </Typography>
        <Typography variant="caption" style={{}}>
            {`${customer.phone_number} `}
        </Typography>
      </Box>
    </>
  );
}
  