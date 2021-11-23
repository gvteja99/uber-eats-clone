import { gql } from 'apollo-server-express';

const typeDefs = gql`
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
    type Query {
        getRestaurants(customer_city: String, search: String): [Restaurant]
    }
    
`;

export default typeDefs;