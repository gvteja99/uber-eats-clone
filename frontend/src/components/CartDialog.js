/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
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

const emails = ['username@gmail.com', 'user02@gmail.com'];

export default function SimpleDialog(props) {
  const { onClose, selectedValue, open, cart=[], onCartCheckout = () => {} } = props;

  // const [error, setError] 

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const reducer =(prev, current) => prev+ current?.dish?.dish_price

  const totalAmount = cart.reduce(reducer, 0)

            // key={email}
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle style={{alignSelf: "center", marginLeft: 100, marginRight: 100 }}>Cart</DialogTitle>
      <List sx={{ pt: 0 }}>
        <div style={{ paddingLeft: 10, paddingBottom: 20}}>
          {cart?.length >0 && cart.map((cartItem, index) => (
            // <ListItem button onClick={() => handleListItemClick(email)}>
            <ListItem key={index}>
              <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                <Typography variant="body1" color="black" style={{alignSelf: "center", backgroundColor: "yellow", textAlign: "center"}}>
                    {`${cartItem?.quantity}  ${cartItem?.dish?.dish_name}`}
                </Typography>
                <Typography variant="body1" color="black" style={{alignSelf: "center", backgroundColor: "yellow", textAlign: "center"}}>
                    {`$ ${cartItem?.dish?.dish_price}`}
                </Typography>
              </div>
            </ListItem>
          ))}

          <ListItem>
              <div style={{width: '100%', display: "flex", justifyContent: "space-between", paddingTop: 0, paddingBottom: 0}}>
                <Typography variant="body1" color="black" style={{alignSelf: "center", backgroundColor: "yellow", textAlign: "center"}}>
                    {`Total Amount:`}
                </Typography>
                <Typography variant="body1" color="black" style={{alignSelf: "center", backgroundColor: "yellow", textAlign: "center"}}>
                    {`$ ${totalAmount}`}
                </Typography>
              </div>
          </ListItem>
        </div>
        <div style={{width: '100%', display: "flex", justifyContent: "center"}}>
          <Button size="small" onClick={() => onCartCheckout()} variant="outlined" color="primary" style={{alignSelf: 'center', width: 100, backgroundColor: "green", color: "white"}}>Checkout</Button>
        </div>

        {/* <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <Typography variant="body1" color="black" style={{alignSelf: "center", backgroundColor: "green", textAlign: "center"}}>
                  {`Checkout`}
          </Typography>
        </ListItem> */}
          {/* <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem> */}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
