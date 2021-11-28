import Customers from '../../Models/customers.js';
import Orders from "../../Models/orders.js";

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
        },
        async getCustomerOrders(_, {id, page=1, pageSize=5}) {
            try {
                const customer_id = id;
                let orders = await Orders.find({customer_id})
                let pageMax = Math.ceil(orders.length / pageSize);
                    if (page > pageMax) {
                        page = pageMax;
                    }
                    let start = (page - 1) * pageSize;
                    let end = page * pageSize;
                    orders = orders.slice(start,end);
                return {data: orders, page, pageSize};
            } catch(error) {
                console.log(error);
                throw new Error(error);
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
                throw new Error(error);
            }
        },
        async placeOrder(_,  { placeOrderInput }) {
            try {
                const { customer_id, first_name, last_name, cart, delivery_type, delivery_address, order_date_time, total_amount, delivery_fee, taxes, instruction, tip }= placeOrderInput;
                // For single Rest order place:
                let cartList = cart?.length > 0 && cart[0]
                let order_items = [];
                cartList?.dishes.map(dish => {
                    order_items.push({
                        res_id: dish.res_id,
                        res_menu_id: dish.res_menu_id,
                        dish_name: dish.dish_name,
                        description: dish.description,
                        quantity: dish.quantity,
                        dish_price: dish.dish_price, 
                        dish_category: dish.dish_category,
                        food_type: dish.food_type,
                    })
                })
        
                let orderPayload = {
                    res_id: cartList._id,
                    res_name: cartList.name,
                    customer_id,
                    first_name,
                    last_name,
                    order_date_time,
                    delivery_type,
                    delivery_address,
                    delivery_fee,
                    taxes,
                    tip,
                    instruction,
                    total_amount,
                    order_items,
                }
        
                const order = new Orders({...orderPayload}); 
                const savedOrder = await order.save()
                return savedOrder;
            } catch(error) {
                console.log(error);
                throw new Error(error);
            }
        }
    }
}

export default resolvers;