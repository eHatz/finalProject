import React, { Component } from "react";
import { browserHistory, Router, Route, Link, withRouter } from 'react-router';
// import $ from "jquery";
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
			sections: [], //Holds all the sections that the current user is authorized to see - should not change after component mounts
			// currentSectionIndex: 0,
			sessions: [], //Hold all the class sessions for the section currently being views
			view: "", //Determines which view component gets redered.  Must be allSessions, singleSession, or singleStudent
			isStudent: false, //turns the Admin/Teacher control panel into an attendance button if true
			displayData: [] //Holds the actual data displayed by the current view component
		}

		this.goAjax = this.goAjax.bind(this);
		this.getSessions = this.getSessions.bind(this);
		this.userIsAdmin = this.userIsAdmin.bind(this);
		this.userIsTeacher = this.userIsTeacher.bind(this);
		this.userIsStudent = this.userIsStudent.bind(this);
		this.viewSingleSession = this.viewSingleSession.bind(this);
		this.selectStudentHandler = this.selectStudentHandler.bind(this);
		this.viewSingleStudent = this.viewSingleStudent.bind(this);
		this.selectSection = this.selectSection.bind(this);
		this.attendanceButtonOnClick = this.attendanceButtonOnClick.bind(this);
	}

	componentWillMount() {

		const { UserInfo } = this.props;
		const Role = UserInfo.UserInfo.Role;

		if (Role === "Admin"){
			this.userIsAdmin();
		} else if (Role === "Teacher"){
			this.userIsTeacher();
		} else (this.userIsStudent())

	}

	goAjax(route, data, stateProperty){
		const that = this;
		return $.ajax({
				url: route,
				type: "POST",
				data: data
		}).then(
			function(response){
			that.setState({
				[stateProperty]: response
			});
			return response;
		})
	}

	/*
goAjax(route, data, stateProperty){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: route,
				type: "POST",
				data: data
			}).done(function(response){
				this.setState({
					[stateProperty]: response
				});
				// resolve();
			}.bind(this)).then(function(){
				return("response");
			})
		}.bind(this))
	}
	*/


	getSessions(sections, index){
		//These four constants just load the id for the current section into our AJAX call
		// const index = this.state.currentSectionIndex;
		const sectionId = sections[index].id;
		const dataObj = {section: sectionId}

		console.log("GETSESSIONS -- ", sectionId);
		return this.goAjax("attendance/getAllSessions", dataObj, "sessions");

	}

	viewSingleSession(event){
		const sessionId = event.currentTarget.getAttribute('value');
		const ajaxData = {sessionId: sessionId};
		console.log("sessionId: ", sessionId);
		// console.log("event: ", event.target);
		this.goAjax("/attendance/singleSession", ajaxData, "displayData")
			.then(function(response){
				this.setState({
					view: "singleSession"
				})
				console.log("viewSingleSession: ", response)
			}.bind(this))
		//goAjax(route, data, stateProperty){}
	}

	selectStudentHandler(event){
		const studentId = event.currentTarget.getAttribute('value');
		viewSingleStudent(studentId);
	}

	viewSingleStudent(studentId){
		const ajaxData = {studentId: studentId}
		this.goAjax("attendance/singleStudent", ajaxData, "displayData")
			.then(function(response){
				this.setState({
					view: "singleStudent"
				})
			}.bind(this))
	}

	userIsAdmin(){
		//Retrieve all sections
		this.goAjax("/admin/getSections", null, "sections")
			.then(function(response){
				//Retrieve the related sections
				return this.getSessions(response, 0)}.bind(this))
			.then(function(){
				//Switch state to "allSessionsView", and pass displayData to AttendanceSessionsView	
				this.setState({
		    		view: "allSessions",
		    		displayData: this.state.sessions
	    		});
			}.bind(this))
	}
		
	userIsTeacher(){
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

	userIsStudent(){
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


	//This method fires when an admin or teacher selects a section to view
	selectSection(event){

		let index = event.target.value;
		// console.log("selectSection index: ", index);
		
		this.getSessions(this.state.sections, index)
			.then(function(){
				//Switch state to "allSessionsView", and pass displayData to AttendanceSessionsView	
				this.setState({
		    		view: "allSessions",
		    		displayData: this.state.sessions
	    		});
			}.bind(this))

		// console.log(this.state.displayData);

  

		//Switches table view to show all sessions for the selected section
		// console.log("selectSection event.target.value: ", event.target.value);

		//Grab the sessions from the DB
		
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
							sections={this.state.sections}
						/>)
					}

				</div>

				<div className='wholeTable'>

					{this.state.view === "allSessions" ? 
						<AttendanceSessionsView
							displayData={this.state.displayData}
							viewSingleSession={this.viewSingleSession}
						/>
						: 
						this.state.view === "singleSession" ?
							<AttendanceStudentsView
								displayData={this.state.displayData}
								selectStudentHandler={this.selectStudentHandler}
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