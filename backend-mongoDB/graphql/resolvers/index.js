import restaurantsResolvers from './restaurants.js';

const resolvers = {
    Query: {
        ...restaurantsResolvers.Query,
    },
    // Mutation: {},
}

export default resolvers;