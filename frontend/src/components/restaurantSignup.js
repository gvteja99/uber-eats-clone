import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import NavigationBar from './navigationbar.js';
import axios from 'axios';
import { 
    Avatar, CssBaseline, Button, Container, FormControl, FormLabel, FormControlLabel,
    makeStyles, Link, Grid, Checkbox, Typography, TextField, Radio, RadioGroup, MenuItem,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useForm, Controller} from 'react-hook-form'
import { onResSignup } from '../app/reducers/mainSlice';
import { isValidEmail } from '../utility.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.success.light,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textInput: {
      borderColor: theme.palette.success.light,
  }
}));

export default function ResSignup() {
    const mainReducer = useSelector((state) => state.mainReducer);
    const { resProfile, token } = mainReducer;
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    // const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [aptNumber, setAptNumber] = useState(resProfile?.apt_number ||  "");
    const [streetAddress, setStreetAddress] = useState(resProfile?.streetAddress ||  "");
    const [city, setCity] = useState(resProfile?.city ||  "san jose");
    const [state, setState] = useState(resProfile?.state ||  "california");
    const [country, setCountry] = useState(resProfile?.country ||  "united states");
    const [zipcode, setZipcode] = useState(resProfile?.zipcode ||  "95111");

    const countries = [
        {
          value: 'united states',
          label: 'United States',
        },
        {
          value: 'india',
          label: 'India',
        },
      ];

    useEffect(() => {}, [])
    const dispatch = useDispatch()
    const classes = useStyles();
    const {register, handleSubmit, control} = useForm()
    const history = useHistory();
    const url =  "/signup/restaurant";
    const restaurantSignupApi = async () => {
      if (!validateInputs()) {
        return
      }
        const body = {
            email,
            password,
            name,
            street_address: streetAddress,
            apt_number: aptNumber,
            city,
            state,
            country,
            zipcode,
        };
        console.log("body", body);
        try {
            const res = await axios.post(url,body);
            await dispatch(onResSignup(res.data))
            console.log("response",res);
            history.push("/login");
            
        }catch(err){
            console.log(err)
        }
    }
    const onClickSubmit = (data) => {
        console.log("calling")
        restaurantSignupApi();
    }
    const onError = (errors, e) => {
        console.log("errors", errors, "e", e);
    }
    const validateInputs = () =>  {
      if (!email) {
        alert("Needs Email");
        return false
      }
      if (!isValidEmail(email)) {
        alert("Invalid Email");
        return false
      }
      if (!name) {
        alert("Needs firstName");
        return false
      }
      if (!city) {
        alert("Needs lastName");
        return false
      }
      if (!password) {
        alert("Needs password");
        return false
      }
      if (!country) {
        alert("Needs country");
        return false
      }
      return true
    }
  return (
    <>
    <NavigationBar />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Restaurant Signup
        </Typography>
        <form className={classes.form} noValidate  onSubmit={handleSubmit(onClickSubmit, onError)}>
        <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('email')}}
            // required
            fullWidth
            id="email"
            label="email"
            name="email"
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            inputProps={{className: classes.textInput}}
          />
          <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('password')}}
            // required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('name')}}
            // required
            fullWidth
            name="name"
            label="restaurant name"
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
           <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('streetAddress')}}
            // required
            fullWidth
            name="streetAddress"
            label="streetAddress"
            type="text"
            id="streetAddress"
            value={streetAddress}
            onChange={e => setStreetAddress(e.target.value)}
          />
           <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('aptNumber')}}
            // required
            fullWidth
            name="aptNumber"
            label="aptNumber"
            type="text"
            id="aptNumber"
            value={aptNumber}
            onChange={e => setAptNumber(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('city')}}
            // required
            fullWidth
            name="city"
            label="city"
            type="text"
            id="city"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
           <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('state')}}
            // required
            fullWidth
            name="state"
            label="state"
            type="text"
            id="state"
            value={state}
            onChange={e => setState(e.target.value)}
          />
           <TextField
          id="country"
          select
          label="country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          {countries.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('zipcode')}}
            // required
            fullWidth
            name="zipcode"
            label="zipcode"
            type="text"
            id="zipcode"
            value={zipcode}
            onChange={e => setZipcode(e.target.value)}
          />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Signup
          </Button>
        </form>
      </div>
    </Container>
    </>
  );
}