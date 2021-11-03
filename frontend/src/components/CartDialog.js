/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, makeStyles, ButtonGroup,TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { incrementDishCount, decrementDishCount, removeDishFromCart } from '../app/reducers/mainSlice';

const emails = ['username@gmail.com', 'user02@gmail.com'];

export default function SimpleDialog(props) {
  const { onClose, selectedValue, open, cart=[], onCartCheckout = (instruction) => {}, } = props;
  const [instruction, setInstruction]= useState("");
  const dispatch = useDispatch();

  const useStyles = makeStyles(theme=>({
    disabledButton: {
      backgroundColor: 'grey'
    },
    paper: { minWidth: "80%" },
  }))


  // const [error, setError] 

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleIncrement = dish => {
    dispatch(incrementDishCount({dish}))
    
  }

  const handleDecrement = dish => {
    // console.log("dish====", dish, "cart",cart);
    dispatch(decrementDishCount({dish}))
  }

  console.log("cartdailog", cart);
  let totalAmount = 0
  for (let resIndex = 0; resIndex < cart.length; resIndex++) {
    for (let dishIndex = 0; dishIndex < cart[resIndex].dishes?.length; dishIndex++ ) {
      totalAmount += cart[resIndex].dishes[dishIndex].dish_price * cart[resIndex].dishes[dishIndex].quantity
    }
  } 


  return (
    <Dialog onClose={handleClose} open={open} classes={{paper: useStyles.paper}}>
      <DialogTitle style={{alignSelf: "center", marginLeft: 100, marginRight: 100, }}>Cart</DialogTitle>
      <List sx={{ pt: 0 }}>
        <div style={{ paddingLeft: 10, paddingBottom: 20}}>
          {cart?.length >0 &&  cart.map((cartItem, index) => {
            return cartItem?.dishes?.length >0 && cartItem?.dishes.map((dish, dishIndex) => (
                <ListItem key={index}>
                <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                <div style={{ width: '50%', display: 'flex'}}>
                  <ButtonGroup size="small" aria-label="small outlined button group" style={{height: 30}}>
                    <Button onClick={() => { handleIncrement(dish); }}>+</Button>
                    <Button disabled>{dish.quantity ? dish.quantity : 1}</Button>
                    <Button onClick={() => { handleDecrement(dish); }}>-</Button>
                  </ButtonGroup>
                </div>
                {/* ${dish?.quantity} */}
                  <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                      {`  ${dish?.dish_name}`}
                  </Typography>
                  <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                      {`$${dish.dish_price}`}
                  </Typography>
                  <Button variant="outlined" style={{marginLeft: 10,  width: 100, height: 40,backgroundColor: "red", color: "white"}} onClick={() => {
                     dispatch(removeDishFromCart({dish}));
                  }}>Remove</Button>
                </div>
              </ListItem>
              )
            )
          })}

          <ListItem>
              <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                <Typography variant="body1" color="black" style={{alignSelf: "center",textAlign: "center"}}>
                    {`Total Amount:`}
                </Typography>
                <Typography variant="body1" color="black" style={{alignSelf: "center", textAlign: "center"}}>
                    {`$ ${totalAmount.toFixed(2)}`}
                </Typography>
              </div>
          </ListItem>
          <TextField
          required
          id="filled-required"
          onChange={e => setInstruction(e.target.value)}
          placeholder="Add instruction for store"
          multiline={true}
          maxRows={"2"}
          variant="filled"
          style={{width: "90%", }}
        />
        </div>
        <div style={{width: '100%', display: "flex", justifyContent: "center"}}>
          <Button size="small" disabled={cart.length === 0} 
            onClick={() => {
              if (cart.length > 0) {
                cart[0].instruction = instruction;
              }
              onCartCheckout()
            }} 
            variant="outlined" color="primary" classes={{ disabled: useStyles.disabledButton }}
            style={{alignSelf: 'center', width: 100, backgroundColor: "black", color: "white"}}>
            Checkout
          </Button>
        </div>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  // selectedValue: PropTypes.string.isRequired,
};
