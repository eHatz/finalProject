import React, { Component } from "react";
import "./ViewAssignment.css";
import ViewMySubmission from './ViewMySubmission/ViewMySubmission.jsx';
import TableRow from '../../Table/TableRow/TableRow.jsx'
import $ from "jquery";
		
class ViewAssignment extends Component {
		constructor(props, context) {

			super(props, context);
			this.state = {
				assignment: [],
				submission: [],
				userRole: null,
				allSubmissions: []
			};
			this.getHwSubmission = this.getHwSubmission.bind(this);
			this.getAllSubmissions = this.getAllSubmissions.bind(this);
		}
		componentWillMount() {
			const { UserInfo, UserSection} = this.props;
			this.setState({userRole: UserInfo.UserInfo.Role})
			if (UserInfo.UserInfo.Role === undefined) {
				$.ajax({
					url: '/login',
					type: "GET"
				}).then((response) => {
					this.setState({userRole: response.userData.Role})
				});
			};
			this.getHwSubmission(this.props.params.id);
			this.getAllSubmissions(this.props.params.id);

		}

		getHwSubmission(assignmentId) {
			const { UserInfo } = this.props;
			
			if (UserInfo.UserInfo.Role === 'Student') {
				$.ajax({
					url: '/viewSubmission',
					type: "POST",
					data: {
						assignmentId: assignmentId,
						UserInfo: UserInfo
			        }
				}).then((response) => {
					this.setState({submission: response.studentSubmission, assignment: response.assignment});
				});
			};
		}

		getAllSubmissions(assignmentId) {
			const { UserInfo } = this.props;
			
			if (UserInfo.UserInfo.Role === 'Admin' || UserInfo.UserInfo.Role === 'Teacher') {

				$.ajax({
					url: '/viewAllSubmissions',
					type: "POST",
					data: {
						assignmentId: assignmentId,
						UserInfo: UserInfo
			        }
				}).then((response) => {
					this.setState({allSubmissions: response.studentSubmission, assignment: response.assignment});
				});
			};
		}
		
	render() {
		const { UserInfo, UserSection, params } = this.props;
		
		return (

			<div className="homeworkBackground">
				{UserInfo.UserInfo.Role === 'Admin' || UserInfo.UserInfo.Role === 'Teacher'  ? (
					<div>
						<TableRow 
							columnCount ={[
								{type: 'Header', value: 'NAME'},
								{type: 'Header', value: 'STATUS'},
								{type: 'Header', value: 'GRADE'},
							]}
							pageName = 'gradeAssignments'
						/>
						
						{this.state.allSubmissions.map((item, index) =>
							<TableRow
								columnCount ={[
									{type: 'Data', value: item.FirstName + ' ' + item.LastName},
									this.state.assignment.Due > item.UserAssignment.updatedAt ? (
										{type: 'Data', value: 'Early'}
									) : (
										{type: 'Data', value: 'Late'}
									),
									{type: 'Data', value: item.UserAssignment.Grade}
								]}
								pageName = 'gradeAssignments'
								rowLink = {'grading/' + item.UserAssignment.UserId + '/' + item.UserAssignment.AssignmentId}
								key= {index}
							/>
						)}
					</div>
				) : (
					null
				)
				}

				{UserInfo.UserInfo.Role === 'Student' ? (
					<ViewMySubmission
						assignment = {this.state.assignment}
						submission = {this.state.submission}
						UserInfo = {UserInfo}
						UserSection = {UserSection}
						assignmentId = {params.id}
					/>
				) : (
					null
				)}

			</div>
		);
	}
}

export default ViewAssignment;