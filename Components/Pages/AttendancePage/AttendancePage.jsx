import React, { Component } from "react";
import "./AttendancePage.css";
import Navbar from "../../Navbar/Navbar.jsx"
import LogoutBar from "../../LogoutBar/LogoutBar.jsx";
import Table from "../../Table/Table.jsx";

class AttendancePage extends Component {
	componentDidMount(){
		const { sidebarOn } = this.props;
		sidebarOn();
	}
	render() {
		return (

			<div>
				<LogoutBar UserName='Tim' />
				<div className='row'>
					<div className= "col-sm-9 remove-all-margin-padding">
						<Table pageName='attendancePage'
							header1='NOTES' 
							header2 = 'TIME' 
							header3='DATE' 
							header4='ATTENDANCE'
						/>
					</div>
				</div>
			</div>

		);
	}
}

export default AttendancePage;