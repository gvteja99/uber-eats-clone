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
import { onResLogin, onCustomerLogin, updateResProfile, onCustomerSignup } from '../app/reducers/mainSlice';

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

export default function ResProfile() {
    const mainReducer = useSelector((state) => state.mainReducer);
    const { resProfile, token } = mainReducer;
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {}, [])
    const dispatch = useDispatch()
    const classes = useStyles();
    const {register, handleSubmit, control} = useForm()
    const history = useHistory();
    const url =  "/signup/customer";
    const customerSignupApi = async () => {
        const body = {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        };
        console.log("body", body);
        try {
            const res = await axios.post(url,body);
            console.log("response",res);
            dispatch(onCustomerSignup())
            history.push("/login");
            
        }catch(err){
            console.log(err)
        }
    }
    const onClickSubmit = (data) => {
        console.log("calling")
        customerSignupApi();
    }
    const onError = (errors, e) => {
        console.log("errors", errors, "e", e);
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
          Customer
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
            inputRef={{...register('firstName')}}
            // required
            fullWidth
            name="firstName"
            label="firstName"
            type="text"
            id="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
           <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('lastName')}}
            // required
            fullWidth
            name="lastName"
            label="lastName"
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          {/* <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('name')}}
            // required
            fullWidth
            id="name"
            label="name"
            name="name"
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            inputProps={{className: classes.textInput}}
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
          /> */}
          {/* <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('country')}}
            // required
            fullWidth
            name="country"
            label="country"
            type="text"
            id="country"
            value={country}
            onChange={e => setCountry(e.target.value)}
          /> */}
           {/* <TextField
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
       
       
        <TextField
          id="outlined-select-currency"
          select
          label="country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        //   helperText="Please select your currency"
        >
          {countries.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
  

          {/* <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
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