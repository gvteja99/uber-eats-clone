import restaurantsResolvers from './restaurants.js';
import customersResolvers from './customers.js';

const resolvers = {
    Query: {
        ...restaurantsResolvers.Query,
        ...customersResolvers.Query,
    },
    // Mutation: {},
}

export default resolvers;