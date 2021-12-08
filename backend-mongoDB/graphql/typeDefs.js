import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Customer {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
        phone_number: String
        dob: String
        nickname: String
        profile_pic: String
        about: String
        token: String
        address: Address
        favourites: [Restaurant]
        delivery_addresses:[Delivery_address]
    }
    type Restaurant {
        _id: ID!
        name: String!
        email: String!
        password: String!
        delivery_option: Int!
        phone_number: String
        description: String
        timing_open: String
        timing_close: String
        token: String
        address: Address
        dishes: [Dish!]!
    }
    type Delivery_address {
        delivery_address: String!
    }
    type Address {
        street_address: String
        apt_number: String
        city: String
        state: String
        country: String
        zipcode: Int
    }
    type Dish {
        _id: ID!
        dish_name: String!
        dish_image: String
        dish_price: Float!
        description: String
        main_ingredient: String
        dish_category: String!
        food_type: Int!
        res_id: ID!
    }

    type Order {
        _id: ID!
        res_id: ID!
        res_name: String!,
        customer_id: ID!,
        first_name: String,
        last_name: String,
        order_date_time: String,
        delivery_type: Int,
        delivery_date_time: String,
        delivery_address: String,
        delivery_status: Int,
        delivery_fee: Float,
        taxes: Float,
        tip: Float,
        instruction: String,
        total_amount: Float,
        order_items: [OrderItem]
    }

    type OrderItem {
        _id: ID,
        res_id: ID,
        res_menu_id: ID,
        dish_name: String,
        description: String,
        quantity: Int,
        dish_price: Float, 
        dish_category: String,
        food_type: Int
    }

    input CustomerInput {
        customer_id: ID!
        email: String!
        first_name: String!
        last_name: String!
        phone_number: String
        description: String
        dob: String
        nickname: String
        profile_pic: String
        about: String
        street_address: String
        apt_number: String
        city: String
        state: String
        country: String
        zipcode: Int
    }

    input PlaceOrderInput {
        customer_id: ID!,
        first_name: String,
        last_name: String,
        delivery_type: Int!,
        delivery_address: String,
        order_date_time: String!,
        total_amount: Float,
        delivery_fee: Float,
        taxes: Float,
        instruction: String,
        tip: Float,
        cart: [CartInput],
    }

    input CartInput {
        address: AddressInput,
        _id: ID!,
        name: String,
        email: String,
        password: String,
        delivery_option: Int,
        phone_number: String,
        description: String,
        timing_open: String,
        timing_close: String,
        instruction: String,
        token: String,
        dishes: [dishCartInput]
    }
    input AddressInput {
        street_address: String,
        apt_number: String,
        city: String,
        state: String,
        country: String,
        zipcode: Int,
    }

    input dishCartInput {
        dish_name: String!,
        dish_image: String,
        dish_price: Float!,
        description: String,
        main_ingredient: String,
        dish_category: String!,
        food_type: Int!,
        res_id: ID!,
        _id: ID!,
        quantity: Int!
    }

    input CreateDishInput {
        _id: ID
        dish_name: String!
        dish_image: String
        dish_price: Float!
        description: String
        main_ingredient: String
        dish_category: String!
        food_type: Int!
        res_id: ID!
    }

    input LoginInput {
        email: String!
        password: String!
    }
    input LogoutInput {
        email: String!
    }
    input CustomerSignupInput {
        email: String!
        password: String!
        first_name: String!
        last_name: String!
    }
    input RestaurantSignupInput {
        email: String!
        password: String!
        name: String!
        street_address: String
        apt_number: String
        city: String!
        state: String
        country: String!
        zipcode: Int!
    }

    # input RestaurantorderInput {
    #     res_id: String!
    #     order_id: String!
    #     delivery_status: Int!
    # }

    type OrderOutputWithPage {
        data:[Order], page: Int, pageSize: Int
    }

    type Query {
        getRestaurants(customer_city: String, search: String): [Restaurant]
        getCustomerProfile(id: ID!): Customer!
        getCustomerOrders(id: ID!, page: Int, pageSize: Int): OrderOutputWithPage
    }
    type Mutation {
        updateCustomerProfile(customerInput: CustomerInput!): Customer!
        placeOrder(placeOrderInput: PlaceOrderInput!): Order!
        postDish(dish: CreateDishInput!): Restaurant!
        updateDish(dish: CreateDishInput!): Restaurant!
        customerLogin(loginInput: LoginInput!): Customer!
        restaurantLogin(loginInput: LoginInput!): Restaurant!
        customerLogout(logoutInput: LogoutInput!): Boolean
        restaurantLogout(logoutInput: LogoutInput!): Boolean
        customerSignup(customerSignupInput: CustomerSignupInput): Boolean
        restaurantSignup(restaurantSignupInput: RestaurantSignupInput): Boolean
        updateResOrderStatus(res_id: String!, order_id: String!, delivery_status: Int!): [Order]
    }
    
`;

export default typeDefs;