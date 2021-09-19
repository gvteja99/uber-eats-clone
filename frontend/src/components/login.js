import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Router} from 'react-router-dom';
import Navigationbar from './navigationbar.js';

import { useNavigate, useHistory } from 'react-router-dom';
import axios from 'axios';
import { 
    Avatar, CssBaseline, Button, Container, FormControl, FormLabel, FormControlLabel,
    makeStyles, Link, Grid, Checkbox, Typography, TextField, Radio, RadioGroup,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {useForm, Controller} from 'react-hook-form'
import { onResLogin, onCustomerLogin } from '../app/reducers/mainSlice';

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

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("1");
    // const [allResList, setAllResList] = useState([]);
    useEffect(() => {
        // signInApi();
    }, [])
    const mainReducer = useSelector((state) => state.mainReducer)
    const dispatch = useDispatch()
    const classes = useStyles();
    const {register, handleSubmit, control} = useForm()
    const history = useHistory();
    // console.log("EMail", email, "pwd", password, "usertype", userType);
    const url = userType == "1" ? "/login/customer" : "/login/restaurant";
    // const signInApi = async() => {
    //     const resp = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8",
    //             "x-access-token": "",
    //         },
    //         body: JSON.stringify({email, password})
    //     }).then((response) => {
    //         console.log("status code", response.status, typeof(response.status));
    //         if (response.status === 200) {
                
    //             userType === "2" ? dispatch(onResLogin(JSON.parse(response.body))) : dispatch(onCustomerLogin(JSON.parse(response.body)))
    //             console.log("===userType", userType);
    //             // response.body.
    //             return response.json()
    //         } 
    //         return 
    //     }).catch((error)=> console.log(error));
    //     console.log("===loginresponse", resp);
    // }
    const signInApi = async () => {
      const body = {email, password}
      console.log("==loginbody", body);
      try {
          const res = await axios.post(url, body);
          console.log("response",res.data);
          userType === "2" ? dispatch(onResLogin(res.data)) : dispatch(onCustomerLogin(res.data))
          setTimeout(() => history.push("/res_profile"), 2000);
          
      }catch(err){
          alert(err);
          console.log(err)
      }

    }
    const onClickSubmit = (data) => {
        console.log("calling")
        signInApi();
    }
    const onError = (errors, e) => {
        console.log("errors", errors, "e", e);
    }
  return (
    <>
     <Navigationbar />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            // style={classes.textInput}
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
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <FormControl component="fieldset">
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
            </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            // onSubmit={() => onClickSubmit()}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </>
  );
}