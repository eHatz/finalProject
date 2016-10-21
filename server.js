const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const request = require('request');
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const express_session = require('express-session');
const ensureLogin = require('connect-ensure-login');
const sequelize = require('sequelize');
const models = require("./models");
require('dotenv').config();

//Express Setup
const PORT = process.env.PORT || 4000;
app.connect({
	host: process.env.SLACK_WEBHOOK,
});
app.use(express.static(__dirname + '/public'));
app.use("/static", express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//Passport setup
passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.CALLBACK_URL
}, function(accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}
));

/*
local: http://localhost:4000/login/github/return
prodution: http://bootcampspot2.herokuapp.com/login/github/return
*/

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_session({ secret: 'jennanda', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());
const User = models.User;
const Section = models.Section;
const Session = models.Session;
const Assignment = models.Assignment;

//Routes
app.get('/login', function(req, res){
	
	if (req.session.userInfo) {
		User.findOne({where: {Email: req.session.userInfo.emails[0].value}}).then(function(user){
			if (!user){
				res.setHeader('Content-Type', 'application/json');
		    	res.json({
		    		access: false,
		    		userData: false
		    	});
			}else if (user){
				user.getSections().then(function(section) {
					var userSection = section;
					if (user.Role === 'Admin') {
						userSection = 'Admin';
					};
					res.setHeader('Content-Type', 'application/json');
			    	res.json({
			    		access: 'jennanda',
			    		userData: user,
			    		userSection: userSection
			    	});
				})
			}
		});
	} else {
		res.setHeader('Content-Type', 'application/json');
    	res.json({
    		access: false,
    		userData: false
    	});
	}
});

app.get('/logout', function(req, res){
	req.session.userInfo = null;
	res.json({
		access: false,
	    userData: false
    });
});
app.get('/login/github', passport.authenticate('github'));

app.get('/login/github/return', 
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
    	req.session.userInfo = req.user;
        res.redirect('/#/login');
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
});

app.post('/admin/getUsers', function(req, res) {
	console.log('getusers', req.body);
	//sorting options
	function sortingAsc(sort, column) {
		if (req.body.sort === sort) {
			if (req.body.section !== 'all') {
				Section.findOne({where: {Title: req.body.section} })
				.then(function(dbSection) {
					dbSection.getUsers({order: [[column]]}).then(function(users) {
						console.log('SECTION USERS===========', users);
						res.json({users: users});
					})
				})
			} else {
				User.findAll({order: [[column]]}).then(function(users){
					res.json({users: users});
				})
			}
		}
	}

	function sortingDesc(sort, column) {
		if (req.body.sort === sort) {
			if (req.body.section !== 'all') {
				Section.findOne({where: {Title: req.body.section} })
				.then(function(dbSection) {
					dbSection.getUsers({order: [[column, 'DESC']]}).then(function(users) {
						res.json({users: users});
					})
				})
			} else {
				User.findAll({order: [[column, 'DESC']]}).then(function(users){
					res.json({users: users});
				})
			}
		}
	}
	sortingAsc('all', 'FirstName');
	sortingAsc('sort-nameAsc', 'FirstName');
	sortingAsc('sort-roleAsc', 'Role');
	sortingDesc('sort-roleDesc', 'Role');
	sortingDesc('sort-nameDesc', 'FirstName');
});

app.post('/admin/createUser', function(req, res) {

	User.create({
		FirstName: req.body.firstName,
		LastName: req.body.lastName,
		Email: req.body.email,
		Role: req.body.role
	}).then(function(newUser) {
		if (req.body.role !=='Admin') {
			Section.findOne({where: {Title: req.body.sectionTitle} })
			.then(function(section) {
				if (section) {
					newUser.addSection(section);
					res.json({status: 'User Created Successfully'});
				} else {
					res.json({status: 'User Creation Failed'});
				};
				
			});
			
		};
	});
});

app.post('/admin/getSections', function(req, res) {
	Section.findAll().then(function(section){
		res.json({section: section});
	});
});

app.post('/admin/createSection', function(req, res) {

	Section.create({
		Title: req.body.Title,
		Location: req.body.Location,
		Slack: req.body.Slack,
		StartDate: req.body.StartDate,
		EndDate: req.body.EndDate,
	}).then(function(section) {
		res.json({section:section});
	});
});

//====Attendance routes====
app.post("/attendance/getAllSessions", function(req, res){
	Session.findAll({
		where:{
			SectionId: req.body.section
		}
	}).then(function(sessions){
		console.log("/attendance/getAllSessions: ", sessions);
		res.json(sessions);
	})
})

app.post("/attendance/singleSession", function(req, res){
	const sessionId = req.body.sessionId;
	console.log("sessionId: ", sessionId)
	var sectionId;
	var thisSession;
	var responseArray = [];

	Session.findOne({where:{id: sessionId}})
		.then((session) => {
			console.log("server 221: ", session);
			//Find the session and its associated section Id in the DB, and hold them in variables
			thisSession = session;
			sectionId = session.SectionId;
			return sectionId;
		}).then((sectionId) =>
			//Grab the associated section from the DB;
			Section.findOne({where:{id: sectionId}})
		).then((section) =>
			//Get all students for this section... 
			section.getUsers({where:{Role: "Student"}})
		).then((users) =>
			//...and save them to our response array
			users.forEach((user) =>
				responseArray.push({
					UserId: user.id,
					Name: user.FirstName + " " + user.LastName,
					Date: thisSession.Date,
					Time: "---",
					Status: "Absent"
				})
			)
		).then(() =>
			//Get all students who have registered their attendance for the session 
			thisSession.getUsers()
		).then((sessionAttendance) => {
			//Compare to the students in our responseArray
				sessionAttendance.forEach(function(attendanceInstance){
					responseArray.forEach(function(responseUser){
						//Once we match an attendance instance with the corresponding student...
						if(attendanceInstance.UserId === responseUser.id){
							//...if the the student created this attendanceInstance before the start of class...
							if(attendanceInstance.createdAt <= thisSession.Date){
								//Mark this student as early
								return responseUser.Status = "Early";
							} else {
								//Otherwise, the student was late
								return responseUser.Status = "Late";
							}			
						}
						//Unmatched students never registered their attendance, and therefore remain "Absent"
					})
				})
				console.log("/attendance/singleSession: ", responseArray);
				return responseArray;
		}).then((responseArray) => res.send(responseArray))
})

app.post("/attendance/teacher", function(req, res){
		//??
	Section.findAll({
		include: [{
			model: User,
			where: {id: req.id}
		}]
	}).then(function(sections){
		console.log("(server.js 183) techerSections route: ", sections);
		res.json(sections);
	})
})

//====Assignment Routes ==================
app.post('/getAssignments', function(req, res) {
	Section.findOne({where: {Title: req.body.sectionTitle} }).then(function(section) {
		section.getAssignments().then(function(assignments) {
			res.json(assignments);
		});
	});
});

app.post('/createAssignment', function(req, res) {
	Section.findOne({where: {Title: req.body.sectionTitle} }).then(function(section) {
		section.getUsers().then(function(users) {
			section.createAssignment({
				Title: req.body.Title, 
				Instructions: req.body.Instructions,
				Due: req.body.Due, 
				Resources:req.body.Instructions,
				Type:req.body.Type
			})
			.then(function(assignment) {
				assignment.addUsers(users);
				res.json({assignment: assignment});
			});
		});
	});
});

app.post('/viewSubmission', function(req, res) {
	const UserInfo = req.body.UserInfo;
	const assignmentId = req.body.assignmentId;
	Assignment.findOne({where: {id: assignmentId} })
	.then(function(assignment) {
		assignment.getUsers({where: {Email: UserInfo.UserInfo.Email}})
		.then(function(submission) {
			res.json({studentSubmission: submission, assignment: assignment});
		});
	});
});

app.post('/viewAllSubmissions', function(req, res) {
	const UserInfo = req.body.UserInfo;
	const assignmentId = req.body.assignmentId;
	Assignment.findOne({where: {id: assignmentId} })
	.then(function(assignment) {
		assignment.getUsers()
		.then(function(submission) {
			res.json({studentSubmission: submission, assignment: assignment});
		});
	});
});

app.post('/submitAssignment', function(req, res) {
	const assignmentLinks = req.body.assignmentLinks;
	const UserInfo = req.body.UserInfo;
	const assignmentId = req.body.assignmentId;
	Assignment.findOne({where: {id: assignmentId} })
	.then(function(assignment) {
		User.findOne({where: {Email: userInfo.UserInfo.Email}}).then(function(user) {
			assignment.addUser(user, {Submission: assignmentLinks}).then(function(user){
				res.json({success: user});
			})
		});
	});
});



//====Slack Routes====

app.get("/slack", (req, res) => {
	res.sendFile(path.join(__dirname, './slack.html'));
});

app.post('/slack', (req, res) => {
	request.post({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url: process.env.SLACK_WEBHOOK,
		body: JSON.stringify({
			'channel': req.body.channel, 
			'username': 'webhookbot', 
			'text': req.body.message, 
			'icon_emoji': ':ghost:'
		})
	}, function(error, response, body){
	});
});

//Sequelize
models.sequelize.sync();


app.listen(PORT, () => {
	console.log(`Server is now listening on ${PORT}`);
});