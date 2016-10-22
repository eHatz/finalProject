import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Checkbox, Button } from "react-bootstrap";
import "./CreateAssignmentTeacher.css";
import $ from "jquery";
		
class createAssignmentTeacher extends Component {
	constructor(props) {
		super(props);

		this.state = {
			Title: "",
			Instructions:"",
			Due:"",
			Resources:"",
			sectionTitle: this.props.UserSection.Title
		};

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.InstructionsChange = this.InstructionsChange.bind(this);
		this.DueChange = this.DueChange.bind(this);
		this.ResourcesChange = this.ResourcesChange.bind(this);
		this.clearInput = this.clearInput.bind(this);
		this.assignmentCreate = this.assignmentCreate.bind(this);
	}

	handleTitleChange(event) {
		this.setState({ Title: event.target.value });
	}

	InstructionsChange(event) {
		this.setState({ Instructions: event.target.value });
	}

	DueChange(event) {
		this.setState({ Due: event.target.value });
	}

	ResourcesChange(event) {
		this.setState({ Resources: event.target.value });
	}


	clearInput(){
		this.setState({
			Title: "",
			Instructions: "",
			Due: "",
			Resources: ""
		});
	}

	assignmentCreate(event){
		$.ajax({
			url: '/createAssignment',
			type: "POST",
			data: {
	        	Title: this.state.Title,
				Instructions: this.state.Instructions,
				Due: this.state.Due,
				Resources: this.state.Resources,
				sectionTitle: this.state.sectionTitle
	        }
		}).then((response) => {
			this.props.getAssignments(this.state.sectionTitle);
		});

	    this.clearInput();
	    event.preventDefault();
	}
	
	render() {

		return (
			<div className="row">
				<div id='assignmentTeacherDiv'>
					<form onSubmit={this.assignmentCreate}>
						<FormGroup controlId="formBasicText">

							<ControlLabel>Title</ControlLabel>
							<FormControl
		      					type="text" 
		      					value={this.state.Title}
		      					placeholder="Title" 
		      					onChange={this.handleTitleChange}
		      				/>

							<ControlLabel>Instructions:</ControlLabel>
							<FormControl
		      					type="text" 
		      					value={this.state.Instructions}
		      					placeholder="Instructions" 
		      					onChange={this.InstructionsChange}
		      				/>

							<ControlLabel>Due Date</ControlLabel>
							<FormControl
		      					type="text" 
		      					value={this.state.Due}
		      					placeholder="Due Date" 
		      					onChange={this.DueChange}
		      				/>
							<ControlLabel>Resources</ControlLabel>
							<FormControl
								type="text" 
		      					value={this.state.Resources}
		      					placeholder="Resources" 
		      					onChange={this.ResourcesChange}
							/>

						    <Button type="submit">Submit</Button>
						</FormGroup>
					</form>
				</div>
			</div>
		);
	}
}
export default createAssignmentTeacher;