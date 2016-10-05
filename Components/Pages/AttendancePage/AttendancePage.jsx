import React, { Component } from "react";
import {Grid, Row, Col} from "react-bootstrap";
import Navbar from "../../Navbar/Navbar.jsx";
import LogoutBar from "../../LogoutBar/LogoutBar.jsx";
import "./AttendancePage.css";

class AttendancePage extends Component {

	render() {

		return (
			
			<div>

					<Navbar />
					<LogoutBar UserName='Tim' />
					<Row className="show-grid">
					</Row>

				<div className="row">
					<div className="col-sm-4 linkDiv">
						<Navbar />
					</div>
				</div>
			</div>
	
		);
	}
}

export default AttendancePage;
