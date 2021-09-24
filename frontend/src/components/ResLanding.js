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
import { getAllResList, getResMenu } from '../app/reducers/mainSlice';
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
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };
    useEffect(() => {
        getRestMenu();
    }, [])
    const dispatch = useDispatch()
    const history = useHistory();
    const classes = useStyles();
    const { selectedRes = {} } = props?.location?.state;
    console.log("=====selectedres", selectedRes)
    const { customerProfile, token } = mainReducer;
    // props.location.state.detail
    console.log("=====selectedRes", selectedRes);
    console.log("customerProfile", customerProfile);

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
    return (
    <>
      <Navigationbar  showCart={true}/>
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
            {console.log("========10")}
            {selectedResMenu?.length > 0 && selectedResMenu.map((dish, key) => (
                <Grid item xs={12} sm={6} md={4}>
                    <ResDishCard dish={dish} res={selectedRes}/>
                </Grid>
            ))
          }
        </Grid>
      </Box>
      <CartDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
