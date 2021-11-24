import Restaurants from '../../Models/restaurants.js';

const resolvers = {
    Query: {
        async getRestaurants(parent, args) {
            try {
                console.log("parent", parent, "args", args);
                // const { customer_city, search } =  req.query;
                const { customer_city='', search='' } =  args;
                let searchStringRegex  = new RegExp(search, "i");
                // TODO: Search and customer city sort option
                const resList = await Restaurants.find({ $or: [ {name: searchStringRegex}, {'address.city': searchStringRegex},  {'dishes.dish_name': searchStringRegex},  ] });
                const results = {data: resList}
                // callback(null, res);
                // return res.status(200).json(results);
                return resList
            } catch(error) {
                console.log("error:", error);
                // return res.status(500).json(error);
                throw new Error(error)
            }
        }
    }
}

export default resolvers;