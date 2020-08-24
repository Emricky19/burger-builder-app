import React from 'react'
import burgarLogo from '../../assets/images/burger-logo.png'
import classes from './Logo.module.css'

const Logo = (props) => {
    return (
        <div className={classes.Logo}>
            <img src={burgarLogo} alt="MyBurger"/>
        </div>
    )
}

export default Logo
