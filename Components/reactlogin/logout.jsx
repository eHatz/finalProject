import React, { Component } from "react";
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import auth from '../../auth';
import HomePage from "../Pages/HomePage/HomePage.jsx";
import "./login.css";

const Logout = withRouter(

	React.createClass({
		componentDidMount() {
			auth.logout()
		// const { location } = this.props

  //       if (location.state && location.state.nextPathname) {
  //         this.props.router.replace(location.state.nextPathname)
  //       } else {
  //         this.props.router.replace('/')
  //       }
		},

		render() {
			return (
				<div>
					<h1 id='loginText'>Logged Out</h1>
					<HomePage/>
				</div>
			)
		}
	})
)
export default Logout;