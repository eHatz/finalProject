import React, { Component } from "react";
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
import $ from "jquery";
import "./AttendancePage.css";
import AttendanceMenu from "./AttendanceMenu/AttendanceMenu.jsx";
import AttendanceButton from "./AttendanceButton/AttendanceButton.jsx";
import AttendanceSessionsView from "./AttendanceSessionsView/AttendanceSessionsView.jsx";
import AttendanceStudentsView from "./AttendanceStudentsView/AttendanceStudentsView.jsx";
import AttendanceStudentView from "./AttendanceStudentView/AttendanceStudentView.jsx";


class AttendancePage extends Component {

	constructor(props){
		super(props);

		this.state = {
			sections: [],
			view: "singleStudent", //allSessions, or singleSession, or singleStudent
			isStudent: false,
			displayData: []
		}

		this.getAdminViewData = this.getAdminViewData.bind(this);
		this.getTeacherViewData = this.getTeacherViewData.bind(this);
		this.getStudentViewData = this.getStudentViewData.bind(this);
		this.switchDisplay = this.switchDisplay.bind(this);
		this.selectSection = this.selectSection.bind(this);
		this.attendanceButtonOnClick = this.attendanceButtonOnClick.bind(this);
	}

	componentWillMount() {

	const { UserInfo } = this.props;
	const Role = UserInfo.UserInfo.Role;

		if (Role === "Admin"){
			this.getAdminViewData();
		} else if (Role === "Teacher"){
			this.getTeacherViewData();
		} else (this.getStudentViewData())
	}

	getAdminViewData(){
		fetch("/admin/getSections", {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((response) => response.json())
		.then((json) => { 
			this.setState({sections: json})
			console.log("adminView sections: ", this.state.sections);
			}
		)
	}
		
	getTeacherViewData(){
		// fetch("/attendance/teacher", {
		// 	credentials: 'include',
		// 	method: 'POST',
		// 	headers: {
		// 		'Accept': 'application/json',
		// 		'Content-Type': 'application/json'
		// 	}
		// }).then((response) => response.json())
		// .then((json) =>  this.setState({sections: json});
		// )
	}

	getStudentViewData(){
		// this.setState({
		// 	isStudent: true,
		// 	view: singleStudent
		// });

		// fetch("/attendance/student", {
		// 	credentials: 'include',
		// 	method: 'POST',
		// 	headers: {
		// 		'Accept': 'application/json',
		// 		'Content-Type': 'application/json'
		// 	}
		// }).then((response) => response.json())
		// .then((json) =>  this.setState({sessions: json});
		// )
	}

	switchDisplay(event){
		this.setState({view: event.target.value});
		console.log("switchView: ", this.state.view);
	}

	//This method fires when an admin or teacher selects a section to view
	selectSection(event){

		//Switches table view to show all sessions for the selected section
		this.setState({view: "allSessions"});
		console.log("selectSection event.target.value: ", event.target.value);

		//Grab the sessions from the DB
		$.ajax({
	        url: "attendance/getAllSessions",
	        type: "POST",
	        data:{
	        	section: event.target.value
	        }
	    }).done(function(response){
	    	//Save the sessions to state and render them to the page
	    	this.setState({displayData: response})
	    });
	}

	attendanceButtonOnClick(){

	}

	render() {

		return (

			<div className="attendanceBackground">

				<div id="AttendancePage_menuDiv">

					{this.state.isStudent ? (
						<AttendanceButton handleClick={this.attendanceButtonOnClick} />
						):(
						<AttendanceMenu
							selectSection={this.selectSection}
							switchDisplay={this.switchDisplay}
							sections={this.state.sections}
						/>)
					}

				</div>

				<div className='wholeTable'>

					{this.state.view === "allSessions" ? 
						<AttendanceSessionsView
							displayData={this.state.displayData}
						/>
						: 
						this.state.view === "singleSession" ?
							<AttendanceStudentsView

							/>
							:						
							<AttendanceStudentView

							/>
					}
					
				</div>
				
			</div>

		);
	}
}


export default AttendancePage;

/*
========


				
=======


sections={UserInfo.UserInfo.sections}		



		Role === "Admin" || Role === "Teacher" ?
			this.adminTeacherView()
			:
			this.studentView()	
*/