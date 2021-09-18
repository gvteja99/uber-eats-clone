import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { Redirect, Router} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { 
    Avatar, CssBaseline, Button, Container, FormControl, FormLabel, FormControlLabel,
    makeStyles, Link, Grid, Checkbox, Typography, TextField, Radio, RadioGroup,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useForm, Controller} from 'react-hook-form'
import { onResLogin, onCustomerLogin, updateResProfile } from '../app/reducers/mainSlice';

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
    console.log("resProfile", resProfile);
    const [name, setName] = useState(resProfile && ( resProfile?.name ||  ""));
    const [phone, setPhone] = useState(resProfile?.phone_number || "");
    const [streetAddress, setStreetAddress] = useState(resProfile?.street_address ||  "");
    const [aptNumber, setAptNumber] = useState(resProfile?.apt_number ||  "");
    const [city, setCity] = useState(resProfile?.city ||  "San Jose");
    const [state, setState] = useState(resProfile?.state ||  "California");
    const [country, setCountry] = useState(resProfile?.country ||  "United States");
    const [zipcode, setZipcode] = useState(resProfile?.zipcode ||  "95111");
    const [timingOpen, setTimingOpen] = useState(resProfile?.timing_open ||  "");
    const [timingClose, setTimingClose] = useState(resProfile?.timing_close ||  "");

    useEffect(() => {}, [])
    const dispatch = useDispatch()
    const classes = useStyles();
    const {register, handleSubmit, control} = useForm()
    const history = useHistory();
    console.log("token==", token);
    const url =  "/restaurants/profile";
    const updateProfileApi = async () => {
        const body = {
            res_id: resProfile?.res_id,
            name,
            address_id: resProfile?.address_id,
            delivery_option: 2,
            phone_number: phone,
            description: `${name} is a good restaurant`,
            timing_open: timingOpen,
            timing_close: timingClose,
            street_address: streetAddress,
            apt_number: aptNumber,
            city: city,
            state: state,
            country: country,
            zipcode: zipcode,
            isAddressUpdated: true
        };
        const headers = { 
            'x-access-token': token,
        };
        console.log("body", body);
        try {
            const res = await axios.put(url,body, {headers});
            console.log("response",res);
            dispatch(updateResProfile(res.data))
            setTimeout(() => history.push("/"), 2000);
            
        }catch(err){
            console.log(err)
        }

    }
    const onClickSubmit = (data) => {
        console.log("calling")
        updateProfileApi();
    }
    const onError = (errors, e) => {
        console.log("errors", errors, "e", e);
    }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Restaurant
        </Typography>
        <form className={classes.form} noValidate  onSubmit={handleSubmit(onClickSubmit, onError)}>
          <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('name')}}
            // required
            fullWidth
            id="name"
            label="name"
            name="name"
            // autoComplete="name"
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            // style={classes.textInput}
            inputProps={{className: classes.textInput}}
          />
          <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('phone')}}
            // required
            fullWidth
            name="phone"
            label="phone"
            type="tel"
            id="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
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
          />
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
        <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('timingOpen')}}
            // required
            fullWidth
            name="timingOpen"
            label="timingOpen"
            type="text"
            id="timingOpen"
            value={timingOpen}
            onChange={e => setTimingOpen(e.target.value)}
          />
        <TextField
            variant="outlined"
            margin="normal"
            // , { required: true }
            inputRef={{...register('timingClose')}}
            // required
            fullWidth
            name="timingClose"
            label="timingClose"
            type="text"
            id="timingClose"
            value={timingClose}
            onChange={e => setTimingClose(e.target.value)}
          />
          {/* <FormControl component="fieldset">
            <RadioGroup
                // aria-label="gender"
                name="controlled-radio-buttons-group"
                defaultValue={"1"}
                value={userType}
                onChange={e => setUserType(e.target.value)}
            >
                <FormControlLabel value="1" control={<Radio />} label="customer" />
                <FormControlLabel value="2" control={<Radio />} label="restaurant" />
            </RadioGroup>
            </FormControl> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            // onSubmit={() => onClickSubmit()}
          >
            Update Profile
          </Button>
          {/* <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
    </Container>
  );
}