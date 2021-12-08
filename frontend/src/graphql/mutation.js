import {
    gql,
  } from "@apollo/client";

const UPDATE_ORDER_STATUS = gql`
mutation updateResOrderStatus(
    $res_id: String!, $order_id: String!, $delivery_status: Int!
) {
    updateResOrderStatus(
        res_id: $res_id, order_id: $order_id, delivery_status: $delivery_status
    ) {
    _id res_id res_name customer_id first_name last_name order_date_time delivery_address total_amount
    order_items { _id dish_name dish_price }
    delivery_type delivery_date_time delivery_status delivery_fee taxes tip instruction
    }
}`;

const PLACE_ORDER = gql`
mutation placeOrder(
  $customer_id: ID! $first_name: String $last_name: String $delivery_type: Int!
  $delivery_address: String $order_date_time: String! $total_amount: Float
  $delivery_fee: Float $taxes: Float $instruction: String $tip: Float $cart: [CartInput]
) {
  placeOrder(
    placeOrderInput: {
      customer_id: $customer_id first_name: $first_name last_name: $last_name 
      delivery_type: $delivery_type delivery_address: $delivery_address
      order_date_time: $order_date_time total_amount: $total_amount
      delivery_fee: $delivery_fee taxes: $taxes instruction: $instruction
      tip: $tip cart: $cart
    }
  ) {
    _id res_id res_name customer_id first_name last_name order_date_time delivery_address total_amount
    order_items { _id dish_name dish_price }
    delivery_type delivery_date_time delivery_status delivery_fee taxes tip instruction
  }
}
`;

const RESTAURANT_SIGNUP = gql`
mutation restaurantSignup(
  $email: String!, $password: String!, $name: String!, $street_address: String,
  $apt_number: String, $city: String!, $state: String, $country: String!,
  $zipcode: Int!,
) {
  restaurantSignup(restaurantSignupInput: {
    email: $email, password: $password, name: $name, street_address: $street_address,
    apt_number: $apt_number city: $city, state: $state, country: $country, zipcode: $zipcode,
  })
}`;

const POST_DISH = gql`
mutation postDish( $dish_name: String! $dish_image: String $dish_price: Float!
  $description: String $main_ingredient: String $dish_category: String!
  $food_type: Int! $res_id: ID!
) {
    postDish(dish: {
        dish_name: $dish_name dish_image: $dish_image dish_price: $dish_price description: $description main_ingredient: $main_ingredient
        dish_category: $dish_category food_type: $food_type res_id: $res_id
}) { 
    address {street_address apt_number city state country zipcode}
    _id name email password delivery_option phone_number description timing_open timing_close token
    dishes {
      _id, description, dish_name, dish_image, dish_price, description, main_ingredient, dish_category,food_type, res_id
    }
}}
`;

const UPDATE_DISH = gql`
mutation updateDish(
    $_id: ID! $dish_name: String! $dish_image: String $dish_price: Float!
    $description: String $main_ingredient: String $dish_category: String!
    $food_type: Int! $res_id: ID!
) {
    updateDish(dish: {
        _id: $_id dish_name: $dish_name dish_image: $dish_image dish_price: $dish_price description: $description main_ingredient: $main_ingredient
        dish_category: $dish_category food_type: $food_type res_id: $res_id
}) { 
    address {street_address apt_number city state country zipcode}
    _id name email password delivery_option phone_number description timing_open timing_close token
    dishes {
      _id, description, dish_name, dish_image, dish_price, description, main_ingredient, dish_category,food_type, res_id
    }
}}
`;

const CUSTOMER_LOGOUT = gql`
mutation customerLogout($email: String!) {
  customerLogout(logoutInput: { email: $email })
}
`;

const RESTAURANT_LOGOUT = gql`
mutation restaurantLogout($email: String!) {
  restaurantLogout(logoutInput: { email: $email })
}
`;

const CUSTOMER_LOGIN = gql`
mutation customerLogin($email: String!, $password: String!) {
  customerLogin(loginInput: { email: $email, password: $password }) {
    _id first_name last_name email password phone_number dob nickname profile_pic about token
    address { street_address apt_number city state country zipcode }
  }
}
`;

const RESTAURANT_LOGIN = gql`
mutation restaurantLogin($email: String!, $password: String!) {
  restaurantLogin(loginInput: { email: $email, password: $password }) {
    dishes {
      food_type dish_category res_id main_ingredient
      description dish_price dish_image dish_name _id
    }
    address { zipcode country state city apt_number street_address }
    _id name email password delivery_option phone_number
    description timing_open timing_close token
  }
}
`;

const CUSTOMER_SIGNUP = gql`
mutation customerSignup($email: String!, $password: String!, $first_name: String!, $last_name: String!) {
  customerSignup(customerSignupInput: { email: $email, password: $password, first_name: $first_name, last_name: $last_name }) 
}`;

const UPDATE_PROFILE = gql`
mutation updateCustomerProfile(
  $customer_id: ID! $email: String! $first_name: String! $last_name: String! $phone_number: String
  $description: String $dob: String $nickname: String $profile_pic: String $about: String
  $street_address: String $apt_number: String $city: String $state: String $country: String $zipcode: Int
) {
  updateCustomerProfile(customerInput: {
    customer_id: $customer_id email: $email first_name: $first_name last_name: $last_name phone_number: $phone_number
    description: $description dob: $dob nickname: $nickname profile_pic: $profile_pic about: $about
    street_address: $street_address apt_number: $apt_number city: $city state: $state country: $country zipcode: $zipcode
  }) {
    _id first_name last_name email password phone_number dob nickname profile_pic about token
    address { street_address apt_number city state country zipcode }
  }
  }
`; 

export {
    UPDATE_ORDER_STATUS,
    PLACE_ORDER,
    RESTAURANT_SIGNUP,
    POST_DISH,
    UPDATE_DISH,
    CUSTOMER_LOGOUT,
    RESTAURANT_LOGOUT,
    CUSTOMER_LOGIN,
    RESTAURANT_LOGIN,
    CUSTOMER_SIGNUP,
    UPDATE_PROFILE,
}