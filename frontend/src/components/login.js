import React, { isValidElement, useEffect, useState } from "react";

// Importing Redux library
import { useSelector, useDispatch } from "react-redux";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql,
} from "@apollo/client";
import Navigationbar from "./navigationbar.js";
import { useNavigate, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  CssBaseline,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormControlLabel,
  makeStyles,
  Link,
  Grid,
  Checkbox,
  Typography,
  TextField,
  Radio,
  RadioGroup,
} from "@material-ui/core";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { onResLogin, onCustomerLogin } from "../app/reducers/mainSlice";
import { isValidEmail } from "../utility.js";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.success.light,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textInput: {
    borderColor: theme.palette.success.light,
  },
}));

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("1");

  // Using usedispatch hook
  const dispatch = useDispatch();

  const classes = useStyles();
  const { register, handleSubmit, control } = useForm();
  const history = useHistory();

  const CUSTOMER_LOGIN = gql`
    mutation customerLogin($email: String!, $password: String!) {
      customerLogin(loginInput: { email: $email, password: $password }) {
        _id
        first_name
        last_name
        email
        password
        phone_number
        dob
        nickname
        profile_pic
        about
        token
        address {
          street_address
          apt_number
          city
          state
          country
          zipcode
        }
      }
    }
  `;

  const RESTAURANT_LOGIN = gql`
    mutation restaurantLogin($email: String!, $password: String!) {
      restaurantLogin(loginInput: { email: $email, password: $password }) {
        dishes {
          food_type
          dish_category
          res_id
          main_ingredient
          description
          dish_price
          dish_image
          dish_name
          _id
        }
        address {
          zipcode
          country
          state
          city
          apt_number
          street_address
        }
        _id
        name
        email
        password
        delivery_option
        phone_number
        description
        timing_open
        timing_close
        token
      }
    }
  `;

  const [customerLogin] = useMutation(
    CUSTOMER_LOGIN,
    {
      onCompleted(res) {
        console.log("da", res);
        dispatch(onCustomerLogin(res?.customerLogin));
        setTimeout(() => history.push("/customer"), 2000);
      },
      onError(e) {
        alert(JSON.parse(JSON.stringify(e))?.message);
        console.log("--dfd", JSON.parse(JSON.stringify(e)));
      },
    }
  );

  const [restaurantLogin] = useMutation(
    RESTAURANT_LOGIN,
    {
      onCompleted(res) {
        console.log("da", res);
        dispatch(onResLogin(res?.restaurantLogin));
        setTimeout(() => history.push("/res_profile"), 2000);
      },
      onError(e) {
        alert(JSON.parse(JSON.stringify(e))?.message);
        console.log("--dfd", JSON.parse(JSON.stringify(e)));
      },
    }
  );

  const signInApi = async () => {
    if (!validateInputs) {
      return;
    }
    const body = { email, password };
    try {
      parseInt(userType) == 1
        ? customerLogin({
            variables: { ...body },
          })
        : restaurantLogin({
            variables: { ...body },
          });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  const onClickSubmit = (data) => {
    console.log("calling");
    signInApi();
  };
  const onError = (errors, e) => {
    console.log("errors", errors, "e", e);
  };

  const validateInputs = () => {
    if (!email) {
      alert("Needs Email");
      return false;
    }
    if (!isValidEmail(email)) {
      alert("Invalid Email");
      return false;
    }
    if (!password) {
      alert("Needs password");
      return false;
    }
    if (!userType) {
      alert("Needs User Type");
      return false;
    }
    return true;
  };
  const signupPageUrl =
    parseInt(userType) == 2 ? "/res_signup" : "/customer_signup";
  return (
    <>
      <Navigationbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="signIn">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmit(onClickSubmit, onError)}
          >
            <TextField
              variant="outlined"
              margin="normal"
              // , { required: true }
              inputRef={{ ...register("email") }}
              // required
              fullWidth
              id="email"
              className="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              // style={classes.textInput}
              inputProps={{ className: classes.textInput }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              // , { required: true }
              inputRef={{ ...register("password") }}
              // required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FormControl component="fieldset">
              <RadioGroup
                // aria-label="gender"
                name="controlled-radio-buttons-group"
                defaultValue={"1"}
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="customer"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="restaurant"
                />
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
                <Link href={signupPageUrl} variant="body2">
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
