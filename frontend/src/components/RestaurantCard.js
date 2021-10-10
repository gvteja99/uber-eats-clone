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

const imgList = [Dish1, Dish2, Dish3, Dish4]

export default function MediaCard(props) {
    const {
        res,
        onResClick = () => {},
        addResToFavourites = () => {},
     } = props
    return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imgList[random(0,3)]}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="resName">
          {res?.name || "subway"}
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{maxLines: 2, lineHeight: 2}}>
          {res.description || "A nice restaurant"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" onClick={() => addResToFavourites(res.res_id)}>Add to favourites</Button>
        <Button size="small" id="resMenu" variant="outlined" onClick={() =>onResClick(res)}>Check Menu</Button>
      </CardActions>
    </Card>
  );
}
