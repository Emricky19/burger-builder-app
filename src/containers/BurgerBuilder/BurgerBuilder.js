import React, { useState, useEffect } from 'react'

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




const BurgerBuilder = (props) => {
    const [ purchasing, setPurchasing ] = useState(false)

    const { initializeIngredients } = props

    useEffect(() => {
        initializeIngredients()
    }, [initializeIngredients])
    //Displaying and updating Burger Price
    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0)

            return sum > 0
    }
    
    const purchaseHandler = () => {
        if(props.isAuthenticated){
            setPurchasing(true)
        }
        else{
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
    }
    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        props.initializePurchase()
        props.history.push('/checkout')
    }
    
        const disabledInfo = {
            ...props.ingredients
        }

        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null

        let burger = props.error ? <p>ingredients can't be loaded</p> : <Spinner /> 
        if(props.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = { props.ingredients }/>
                    <BuildControls 
                    ingredientAdded={props.addIngredient}
                    ingredientRemoved={props.removeIngredient}
                    purchasable={updatePurchaseState(props.ingredients)}
                    disabled={disabledInfo}
                    ordered={purchaseHandler}
                    price={props.totalPrice}
                    isAuth={props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={props.ingredients} 
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued = {purchaseContinueHandler}
                price={props.totalPrice}
                />
        }

        return(
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    
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