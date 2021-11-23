import Customers from '../../Models/customers.js';

const resolvers = {
    Query: {
        async getCustomerProfile(parent, {id}) {
            try {
                const customer_id = id;
                const c = await Customers.findById(customer_id);
                return c;
                // return res.status(200).json(c);
            } catch(error) {
                console.log(error);
                // return res.status(500).json(error);
                return {error}
            }
        }
    }
}

export default resolvers;