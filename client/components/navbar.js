import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="navbarContainer">
    <h1>GRACE SHOPPER</h1>
    <nav>
      {isLoggedIn ? (
        <div className="navButtons">
          {/* The navbar will show these links before you log in */}
          <div className="navLeftButtons">
            <Link to="/home">Home</Link>
            <Link to="/plants">All Plants</Link>
          </div>
          <div className="navRightButtons">
            <a href="#" onClick={handleClick}>
              Logout
            </a>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      ) : (
        <div className="navButtons">
          {/* The navbar will show these links before you log in */}
          <div className="navLeftButtons">
            <Link to="/home">Home</Link>
            <Link to="/plants">All Plants</Link>
            <Link to="/plant">Single Plant</Link>
          </div>
          <div className="navRightButtons">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
