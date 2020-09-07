import React, { useEffect } from 'react';
import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'
import * as actions from '../../store/actions/index'

import Spinner from '../../components/UI/Spinner/Spinner'

import { connect } from 'react-redux'

const Orders = (props) => {
    const {fetchOrders, token, userId, loading} = props
    useEffect(() => {
        fetchOrders(token, userId)
    }, [ fetchOrders, token, userId])
    
        let orders = <Spinner />
        if(!loading){ 
            orders = props.orders.map(order => (
                    <Order 
                    key={order.id} 
                    ingredients={order.ingredients}
                    price={order.price}
                />
           ))
        }
        return ( 
            <div>
                { orders }
            </div>
        );
    
}

const mapStateToProps = state => {
    return {
        orders: state.orders.orders,
        loading: state.orders.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
