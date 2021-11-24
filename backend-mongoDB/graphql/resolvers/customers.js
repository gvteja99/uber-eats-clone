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
                throw new Error(error)
                // return res.status(500).json(error);
            }
        }
    },
    Mutation: {
        async updateCustomerProfile(parent, {customerInput}) {
            try {
                const { customer_id, email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
                    street_address, apt_number, city,  state, country, zipcode } = customerInput;    
                const update = {
                    email, first_name, last_name, phone_number, dob, nickname, profile_pic, about,
                    address: {
                        street_address,
                        apt_number,
                        city,
                        state,
                        country,
                        zipcode,
                    }
                }
                const result = await Customers.findByIdAndUpdate(customer_id, update, { new:true });
                return result;
            } catch(error) {
                console.log(error);
                throw new Error(error)
            }
            // try {
            //     const customer_id = id;
            //     const c = await Customers.findById(customer_id);
            //     return c;
            //     // return res.status(200).json(c);
            // } catch(error) {
            //     console.log(error);
            //     throw new Error(error)
            //     // return res.status(500).json(error);
            // }
        }
    }
}

export default resolvers;