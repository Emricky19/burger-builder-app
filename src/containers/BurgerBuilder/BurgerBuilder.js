import React, { Component } from 'react'

import Aux from '../../hoc/Auxx/Auxilliary';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler'

import { connect } from 'react-redux'

import axios from '../../axios-orders'

import * as actions from '../../store/actions/index'




export class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state{

    //     }
    // }
    state = {
        purchasing: false,
    }
    componentDidMount(){
        this.props.initializeIngredients()
    }
    //Displaying and updating Burger Price
    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0)

            return sum > 0
    }
    
    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true})
        }
        else{
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.props.initializePurchase()
        this.props.history.push('/checkout')
    }
    render () {
        const disabledInfo = {
            ...this.props.ingredients
        }

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null

        let burger = this.props.error ? <p>ingredients can't be loaded</p> : <Spinner /> 
        if(this.props.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = { this.props.ingredients }/>
                    <BuildControls 
                    ingredientAdded={this.props.addIngredient}
                    ingredientRemoved={this.props.removeIngredient}
                    purchasable={this.updatePurchaseState(this.props.ingredients)}
                    disabled={disabledInfo}
                    ordered={this.purchaseHandler}
                    price={this.props.totalPrice}
                    isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.props.ingredients} 
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued = {this.purchaseContinueHandler}
                price={this.props.totalPrice}
                />
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}
const mapStateToProps = state => {
    return{
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
     return{
         addIngredient: (ingName) => dispatch (actions.addIngredient(ingName)),
         removeIngredient: (ingName) => dispatch (actions.removeIngredient(ingName)),
         initializeIngredients: () => dispatch (actions.initIngredients()),
         initializePurchase: () => dispatch(actions.purchaseInit()),
         onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
     }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));