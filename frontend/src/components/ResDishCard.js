/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import * as React from 'react';
import {
  Card, CardActions, CardContent, CardMedia, Button, Typography, IconButton,
} from '@material-ui/core';
import Dish1 from "../images/dish1.jpeg";
import Dish2 from "../images/dish2.jpeg";
import Dish3 from "../images/dish3.jpeg";
import Dish4 from "../images/dish4.jpeg";
import { random } from '../utility';

export default function MediaCard(props) {
    const { dish, res, onAddToCartClick= ()=> {} } = props;

    const imgList = [Dish1, Dish2, Dish3, Dish4]
    // console.log("====dish", dish)
    return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imgList[random(0,3)]}
        // alt="img loading..."
      />
      <div style={{display: "flex", justifyContent: 'space-between'}}>
        <CardContent>
            <Typography className="dishName" gutterBottom variant="h5" component="div">
            {dish?.dish_name || "pizza"}
            </Typography>
            <Typography variant="body2" color="black">
            {dish.description || "italian dish"}
            </Typography>
            <Typography variant="body2" color="black">
            ${dish.dish_price || "5.00"}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small" id="addCartBtn" variant="outlined" onClick={() => onAddToCartClick(res, dish)}>Add to Cart</Button>
            {/* <Button size="small" variant="outlined">Check Menu</Button> */}
        </CardActions>
        </div>
    </Card>
  );
}
