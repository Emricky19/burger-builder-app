import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'
import { connect } from 'react-redux'


class Checkout extends Component {
 
    checkoutCancelledHHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }
    render() {
        let summary = <Redirect to="/" />
        if(this.props.ingredients) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null
            summary = (
                <div>
                    { purchasedRedirect }
                    <CheckoutSummary
                    checkoutCancelled={this.checkoutCancelledHHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                    ingredients={this.props.ingredients} 
                    />
                    <Route 
                        path={this.props.match.path + '/contact-data'} 
                        component={ContactData}
                    />
                </div>
            )
        }
        return (
            <>
                 {summary}
                
            </>
        );
    }
}


const mapStateToProps = state => {
    return{
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        purchased: state.orders.purchased
    }
}

export default connect(mapStateToProps)(Checkout);
