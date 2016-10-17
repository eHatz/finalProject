import React, { Component } from "react";
import { ButtonToolbar, DropdownButton, MenuItem } from "react-bootstrap";
import "./AttendanceMenu.css";



class AttendanceMenu extends Component {

	constructor(...args){
		super(...args);
		this.state = {
			sections: []
		}
	}

	componentWillMount() {
		console.log("AttendanceMenu");
		//Request class list from server

	}

	render() {

		return (

			<ButtonToolbar>
			
				<DropdownButton title="Section" id="dropdown-size-medium">
					<MenuItem eventKey="1">Action</MenuItem>
				</DropdownButton>

				<DropdownButton title="Section" id="dropdown-size-medium">
					<MenuItem eventKey="1">Action</MenuItem>
				</DropdownButton>

				<DropdownButton title="Student" id="dropdown-size-medium">
					<MenuItem eventKey="1">Action</MenuItem>
				</DropdownButton>
				
			</ButtonToolbar>

		);
	}
}


export default AttendanceMenu;