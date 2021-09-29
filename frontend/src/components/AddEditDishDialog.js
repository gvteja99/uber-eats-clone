/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import  { Button } from '@material-ui/core';
// import {ColorButton3} from '../../constants/index';

const AddEditDishDialog = (props) => {
    const {open, handleClose, dish, handleCreate, isEdit} = props;
    // console.log("====edit", isEdit, "===dish", dish);
    const [dishImage, setDishImage] = useState(dish?.dish_image);
    const [dishName, setDishName] = useState(dish?.dish_name);
    const [dishType, setDishType] = useState(dish?.dish_type);
    const [dishPrice, setDishPrice] = useState(dish?.dish_price);
    const [dishDescription, setDishDescription] = useState(dish?.description);

    useEffect(() => {
        // console.log("======effecting====");
        setDishName(dish?.dish_name);
        setDishType(dish?.food_type);
        setDishPrice(dish?.dish_price);
        setDishImage(dish?.dish_image);
        setDishDescription(dish?.description);
        // getTickets();
        // getResDishes();
    }, [props.open]);

    if (dish?.dish_name) {
        // setDishName(dish.dish_name);
    }

    const handleDishImage= (event) => {
        setDishImage(event.target.value);
    };

    const handleDishDescription = (event) => {
        setDishDescription(event.target.value);
    };

    const handleDishType = (event) => {
        setDishType(event.target.value);
    };

    const handleDishName = (event) => {
        setDishName(event.target.value);
    };

    const handleDishPrice = (event) => {
        setDishPrice(event.target.value);
    };

    const clearState = ()  => {
        setDishName("");
        setDishDescription("");
        setDishImage("");
        setDishType("");
        setDishPrice("");
    }


    return (
        <Dialog 
            open={open}
            onClose={() => { 
                handleClose();
                clearState();
            }}
          aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>{isEdit?  'Edit Dish' :'Add New Dish'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the dish details to include it in the menu.
                    </DialogContentText>
                    {/* <TextField
                        margin='dense'
                        id='dish_image'
                        value={dish?.dishImage || dishImage}
                        onChange={handleDishImage}
                        label='Dish Image'
                        fullWidth
                    /> */}
                    <TextField
                        margin='dense'
                        id='dish_name'
                        value={dish?.dishName || dishName}
                        onChange={handleDishName}
                        label='Dish Name'
                        fullWidth
                    />
                     <TextField
                        margin='dense'
                        id='dish_price'
                        value={dish?.dishPrice || dishPrice}
                        onChange={handleDishPrice}
                        label='Dish Price in dollar'
                        fullWidth
                    />
                    <TextField
                        margin='dense'
                        id='dish_type'
                        value={dish?.dishType || dishType}
                        onChange={handleDishType}
                        label='Dish Type'
                        fullWidth
                    />
                    <TextField
                        margin='dense'
                        id='dish_description'
                        value={dish?.dishDescription || dishDescription}
                        onChange={handleDishDescription}
                        label='Dish Description'
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained'
                        onClick={() =>  {
                            handleCreate(isEdit, Object.assign({},dish, {
                                dish_name: dishName,
                                food_type: parseInt(dishType),
                                dish_category: "desserts",
                                description: dishDescription,
                                main_ingredient: "potato onion",
                                dish_price: parseFloat(dishPrice),
                                dish_image: ""
                            })); 
                            clearState();
                        }} color='primary'>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>)
}

AddEditDishDialog.propTypes = {
    // ...prop type definitions here
    open: PropTypes.bool,
    isEdit: PropTypes.bool,
    handleCreate: PropTypes.func,
    handleClose: PropTypes.func,
    dishImage: PropTypes.any,
    dishName: PropTypes.any,
    dishType: PropTypes.any,
    dishDescription: PropTypes.any,
}

export default AddEditDishDialog;