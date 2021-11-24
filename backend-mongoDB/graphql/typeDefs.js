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


    type Query {
        getRestaurants(customer_city: String, search: String): [Restaurant]
        getCustomerProfile(id: ID!): Customer!
    }
    type Mutation {
        updateCustomerProfile(customerInput: CustomerInput!): Customer!
    }
    
`;

export default typeDefs;