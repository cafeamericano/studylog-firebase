let port=process.env.PORT || 2100

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = express()
var handlebars = require('express-handlebars')
var moment = require('moment')
var firebase = require('firebase')

//DEFINE DB================================================================

var firebaseConfig = {
    apiKey: "AIzaSyBitq_d2v2M0380RyfgYncFDEsT9uFItPc",
    authDomain: "squirrelstudy-a5cad.firebaseapp.com",
    databaseURL: "https://squirrelstudy-a5cad.firebaseio.com",
    projectId: "squirrelstudy-a5cad",
    storageBucket: "squirrelstudy-a5cad.appspot.com",
    messagingSenderId: "358785513083",
    appId: "1:358785513083:web:c50169bb1c445edb"
  };

firebase.initializeApp(firebaseConfig);

var entriespool = firebase.firestore().collection('entriespool')
var useraccounts = firebase.firestore().collection('useraccounts')

//MIDDLEWARE================================================================

app.use(express.static(__dirname+'/public'));

//var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({defaultLayout: 'standard'}))
app.set('view engine', 'handlebars');


//ROUTES================================================================

//Testing routes__________________________________________________________________________________________________

    //Render the page listing all entries made any user
    app.get('/usercontent/entries/showall', function(req, res) {
        var selectEntries = entriespool.orderBy('date', 'desc');
        let passToView = [];
        selectEntries.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                passToView.push(x)
                console.log(x)
            });
            res.render('_userContent/showEntries', {
                entries: passToView
            });
        });
    });

    //Insert JSON data
    app.get('/importcustomrecords', function(req, res) {
        var recordsToImport = [{"ID":16,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-09 13:16:07","date":"2019-02-23","hours":150,"comments":"Verified sum of hours spent studying Javascript with multiple sub-techs from Nov 24th, 2018 to Feb 22, 2019.","category":null,"proglang":"Javascript","subtech":""},{"ID":45,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 15:01:02","date":"2019-03-08","hours":23,"comments":"Includes everything from February 24th, 2019 to March 8th, 2019.","category":null,"proglang":"Javascript","subtech":null},{"ID":46,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 15:01:41","date":"2019-03-10","hours":5.5,"comments":"As of 3:00PM. Learned Git. Added edit feature to application. Set display for record ID to none. Figured out how to implement Google API by passing in data gathered through SQL through Express and Handlebars, then formatting templated content as JSON formatted data.","category":null,"proglang":"Javascript","subtech":null},{"ID":47,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 15:01:59","date":"2019-03-09","hours":8.5,"comments":"Practiced with Express and MySQL. Learned HandleBars.","category":null,"proglang":"Javascript","subtech":null},{"ID":48,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 21:10:36","date":"2019-02-24","hours":5,"comments":"","category":null,"proglang":"Javascript","subtech":null},{"ID":49,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 21:10:45","date":"2019-02-25","hours":2,"comments":"","category":null,"proglang":"Javascript","subtech":null},{"ID":50,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 21:10:55","date":"2019-02-26","hours":3,"comments":"","category":null,"proglang":"Javascript","subtech":null},{"ID":51,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 21:11:04","date":"2019-02-27","hours":4,"comments":"","category":null,"proglang":"Javascript","subtech":null},{"ID":52,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-10 21:11:17","date":"2019-02-28","hours":3.5,"comments":"","category":null,"proglang":"Javascript","subtech":null},{"ID":53,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-11 23:18:55","date":"2019-03-11","hours":1,"comments":"Placement of Google Charts into inline-block cards as well as other UI changes.","category":null,"proglang":"Javascript","subtech":null},{"ID":54,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-13 22:55:23","date":"2019-03-13","hours":2.5,"comments":"Began designing UI of to-do list application.","category":null,"proglang":"Javascript","subtech":null},{"ID":55,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-23 17:56:09","date":"2019-03-22","hours":20,"comments":"Everything from March 14th to March 22nd.","category":null,"proglang":"Javascript","subtech":null},{"ID":56,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-23 17:56:48","date":"2019-03-23","hours":7,"comments":"Did Module 8, studied math, watched React video, worked on Portfolio.","category":null,"proglang":"Javascript","subtech":null},{"ID":57,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-31 12:06:49","date":"2019-03-30","hours":5,"comments":"Studied a lot of ReactJS and finished pre-work.","category":null,"proglang":"Javascript","subtech":null},{"ID":58,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-31 12:07:25","date":"2019-03-29","hours":5,"comments":"Estimated combined study time for March 24th through March 29th.","category":null,"proglang":"Javascript","subtech":null},{"ID":59,"email":"mfarmer5102@gmail.com","timestamp":"2019-03-31 14:01:06","date":"2019-03-31","hours":5.5,"comments":"Finished pre-work. Studied React and learned how to use Props as well as State. Learned structure of a React app when used in combination with Express. @4:30.","category":null,"proglang":"Javascript","subtech":null},{"ID":65,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-02 22:02:00","date":"2019-04-02","hours":1.5,"comments":"Successfully connected React app to MySQL database via Express backend.","category":null,"proglang":"Javascript","subtech":null},{"ID":66,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-04 22:05:55","date":"2019-04-04","hours":1,"comments":"Studying transferring data in JSON format.","category":null,"proglang":"Javascript","subtech":null},{"ID":67,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-05 23:42:29","date":"2019-04-05","hours":2.5,"comments":"Studied C#.","category":null,"proglang":"Javascript","subtech":null},{"ID":68,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-06 18:03:06","date":"2019-04-06","hours":7,"comments":"As of 9:10PM. Studied mainly ReactJS as well as some C#.","category":null,"proglang":"Javascript","subtech":null},{"ID":69,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-07 17:30:27","date":"2019-04-07","hours":8,"comments":"As of 11:15PM. Spent the entire day studying React.","category":null,"proglang":"Javascript","subtech":null},{"ID":70,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-08 23:58:24","date":"2019-04-08","hours":3,"comments":"Studied React all night.","category":null,"proglang":"Javascript","subtech":null},{"ID":71,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-10 00:14:54","date":"2019-04-09","hours":3,"comments":"Studied React all night, again.","category":null,"proglang":"Javascript","subtech":null},{"ID":72,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-10 23:40:16","date":"2019-04-10","hours":3.5,"comments":"Studied React all night.","category":null,"proglang":"Javascript","subtech":null},{"ID":73,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-14 03:04:05","date":"2019-04-13","hours":9,"comments":"Studied React for approximately nine hours in the context of a flexible spreadsheet program.","category":null,"proglang":"Javascript","subtech":null},{"ID":74,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-14 15:36:08","date":"2019-04-14","hours":6.5,"comments":"Studied React.","category":null,"proglang":"Javascript","subtech":null},{"ID":75,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-16 23:33:27","date":"2019-04-16","hours":3,"comments":"Studied React, fixed some bugs in the flexible spreadsheet project.","category":null,"proglang":"Javascript","subtech":null},{"ID":76,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-17 23:45:22","date":"2019-04-17","hours":3,"comments":"Studied React.","category":null,"proglang":"Javascript","subtech":null},{"ID":77,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-20 16:50:13","date":"2019-04-20","hours":8,"comments":"Studied React. Focused on implementing workaround solutions to program shortcomings as well as eliminating need for page refresh through use of rerendering components by updating parent component state.","category":null,"proglang":"Javascript","subtech":null},{"ID":78,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-21 17:55:36","date":"2019-04-21","hours":3.5,"comments":"Studied React.","category":null,"proglang":"Javascript","subtech":null},{"ID":79,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-24 23:23:45","date":"2019-04-24","hours":3,"comments":"Studied React. Cleaning up code and restating code in a different way.","category":null,"proglang":"Javascript","subtech":null},{"ID":80,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-24 23:24:01","date":"2019-04-22","hours":1,"comments":"Small amount of React studies...","category":null,"proglang":"Javascript","subtech":null},{"ID":81,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-24 23:24:28","date":"2019-04-23","hours":1,"comments":"Small amount of React studies, again.","category":null,"proglang":"Javascript","subtech":null},{"ID":82,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-25 09:56:07","date":"2019-04-25","hours":9,"comments":"As of 8:45PM. 1.5 hours studying React. 7.5 hours studying user logins and cookies. Successfully created a basic application that allows logging in, viewing database entries specific to the logged in user, and logging out of the application.","category":null,"proglang":"Javascript","subtech":null},{"ID":83,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-26 22:31:40","date":"2019-04-26","hours":5.5,"comments":"As of 11:59PM. Studying user accounts.","category":null,"proglang":"Javascript","subtech":null},{"ID":84,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-27 15:27:43","date":"2019-04-27","hours":5.75,"comments":"As of 12:15AM. Working on Notebook app.","category":null,"proglang":"Javascript","subtech":null},{"ID":85,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-28 16:21:02","date":"2019-04-28","hours":7.5,"comments":"As of 12:55AM. Now working on a messaging app.","category":null,"proglang":"Javascript","subtech":null},{"ID":89,"email":"garykey3950@gmail.com","timestamp":"2019-04-30 00:57:52","date":"2019-04-29","hours":1,"comments":"Made account for Gary.","category":null,"proglang":"Javascript","subtech":null},{"ID":91,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-30 02:01:34","date":"2019-04-29","hours":7.6,"comments":"As of 2:00AM.","category":null,"proglang":"Javascript","subtech":null},{"ID":92,"email":"garykey3950@gmail.com","timestamp":"2019-04-30 02:04:42","date":"2019-04-30","hours":2.5,"comments":"New entry for Gary's account.","category":null,"proglang":"Javascript","subtech":null},{"ID":93,"email":"mfarmer5102@gmail.com","timestamp":"2019-04-30 23:02:37","date":"2019-04-30","hours":3.5,"comments":"First day of class (HTML), plus personal study. As of 11:00PM.","category":null,"proglang":"Javascript","subtech":null},{"ID":94,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-01 22:08:16","date":"2019-05-01","hours":3.75,"comments":"Studied Firebase. Learned how to create a simple messaging app with reading/writing to DB as well as login with Google Account. Identified essential files that makeup a Firebase app. As of 1:55AM.","category":null,"proglang":"Javascript","subtech":null},{"ID":95,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-03 19:29:11","date":"2019-05-02","hours":3,"comments":"Class. HTML and CSS as well as Git.","category":null,"proglang":"Javascript","subtech":null},{"ID":96,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-03 19:29:28","date":"2019-05-03","hours":2,"comments":"As of 7:30PM. Studying Firebase.","category":null,"proglang":"Javascript","subtech":null},{"ID":97,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-05 00:37:01","date":"2019-05-04","hours":8,"comments":"4 hours of class, plus 4 hours of independent study time, largely studying Firebase and brushing up on CSS.","category":null,"proglang":"Javascript","subtech":"Firebase"},{"ID":98,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-05 15:09:25","date":"2018-11-24","hours":30,"comments":"Estimated amount of time spent studying Swift from June 4th , 2018 to November 23rd, 2018.","category":null,"proglang":"Swift","subtech":""},{"ID":99,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-05 15:09:48","date":"2018-11-24","hours":20,"comments":"Estimated amount of time spent studying VBA from June 4th , 2018 to November 23rd, 2018.","category":null,"proglang":"VBA","subtech":""},{"ID":100,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-05 15:10:13","date":"2018-11-24","hours":10,"comments":"Estimated amount of time spent studying C from June 4th , 2018 to November 23rd, 2018.","category":null,"proglang":"C","subtech":""},{"ID":101,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-05 15:12:29","date":"2019-05-05","hours":4.5,"comments":"As of 10:30. Experimenting with Python and practicing it on Codecademy. Watching videos on Django.","category":null,"proglang":"Python","subtech":"undefined"},{"ID":102,"email":"mfarmer5102@gmail.com","timestamp":"2019-05-05 22:33:40","date":"2019-05-05","hours":0,"comments":"*********** Capturing totals by subject as of 5/5/19 at 10:30PM. 370 in JavaScript (75 in React), 30 in Swift, 20 in VBA, 10 in C, 4 in C#, 4.5 in Python. *********** ","category":null,"proglang":"","subtech":"undefined"}]; //Place JSON data here
        for (i=0; i<recordsToImport.length; i++) {
            entriespool.add(recordsToImport[i]);
        }
        res.redirect('/')
    });

    //Grab all entries from MySQL in the entriespool table and return as JSON
    app.get('/all', function(req, res) {
        var sql = "SELECT * FROM entriespool;"
        connection.query(sql, function (err, result) {
            let items = [];
            for (i=0; i<result.length; i++) {
                items.push(result[i])
            }
            console.log(items)
            res.send(items)
        })
    });

//Login routes__________________________________________________________________________________________________

    //Force redirection to login route
    app.get('/', function(req, res) {
        res.redirect('/login/prompt')
    });

    //Render the login page, clear any previous cookies, and give unauthroized layout
    app.get('/login/prompt', function(req, res) {
        let cookiedEmail = req.cookies['email']
        res.clearCookie(cookiedEmail).render('_login/loginScreen', {layout: 'unauthorized'})
    });

    //Process an attempted login by the user and respond accordingly
    app.post('/login/process', function(req, res) {

        // Create a query against the collection
        var query = useraccounts.where('email', '==', req.body.email);

        let passToView = [];
        query.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                passToView.push(x)
            });
            let passwordStored = (passToView[0].password);
            let passwordEntered = req.body.password;
            if (passwordEntered === passwordStored) {
                res.cookie('email', req.body.email).redirect('/login/success');
            } else {
                res.render('_login/loginFailure', {layout: 'unauthorized'})
            };
        });
        
    });

    //Render the page that lets the user know login was successful
    app.get('/login/success', function(req, res) {
        res.render('_login/loginSuccess', {layout: 'unauthorized'});
    });

//Account management routes__________________________________________________________________________________________________

    //Render page for new account creation
    app.get('/account/create/prompt', function(req, res) {
        res.render('_accountManagement/createNewAccount', {layout: 'unauthorized'});
    });

        //Process changes to an existing entry
        app.post('/usercontent/entries/edit/process/', function(req, res) {
            let docToEditId = req.body.id;
            console.log(docToEditId)
            var incomingData = {
                date: req.body.date,
                hours: req.body.hours,
                comments: req.body.comments,
                proglang: req.body.proglang,
            }
            console.log(incomingData)
            var docRef = entriespool.doc(docToEditId);
            console.log(docRef)
            docRef.update(incomingData);
            res.redirect('/usercontent/entries/show')
        });

    //Process creation of new account given user input
    app.post('/account/create/process', function(req, res) {
        if (req.body.email === "" || req.body.password === "" || req.body.firstname === "" || req.body.lastname === "" || req.body.city === "" || req.body.country === "") {
            res.render('_accountManagement/accountCreationFailure', {layout: 'unauthorized'})
        } else {
            console.log(req.body.email)
            console.log(req.body.password)
            useraccounts.add({
                email: req.body.email,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                profilephoto: req.body.profilephoto,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                country: req.body.country,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log
            res.render('_accountManagement/accountCreationSuccess', {layout: 'unauthorized'})
        };
    });

    //Render the page that allows the user to confirm that the account should be deleted
    app.get('/account/delete/prompt', function(req, res) {
        let x = req.cookies['email']
        res.render('_accountManagement/confirmAccountDeletion', {
            accountToBeDeleted: x
        });
    });

    //Render the page indicating that account deletion was successful, use unauthorized layout
    app.post('/account/delete/process', function(req, res) {
        var query = useraccounts.where('email', '==', req.body.email);
        let passToView = [];
        query.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                useraccounts.doc(`${x.id}`).delete();
                res.render('_accountManagement/accountDeletionSuccess', {layout: 'unauthorized'})
            });
        });

/*
        FIXME:
        var sql = `DELETE FROM useraccounts WHERE email = '${req.body.email}';`
        console.log(sql)
        connection.query(sql, function (err) {
            if (err) throw err;
            res.render('_accountManagement/accountDeletionSuccess', {layout: 'unauthorized'})
        });
            //Process entry deletion request
            app.post('/usercontent/entries/delete/process', function(req, res) {
                let docToDeleteId = req.body.idToDelete
                useraccounts.doc(`${docToDeleteId}`).delete();
                res.render('_accountManagement/accountDeletionSuccess', {layout: 'unauthorized'})
            });
*/
    });

//Profile management routes__________________________________________________________________________________________________

    //Render the user's profile page listing all current values
    app.get('/profile/update/prompt', function(req, res) {
        let x = req.cookies['email']
        var query = useraccounts.where('email', '==', x);
        let passToView = [];
        query.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                passToView.push(x)
            });
            res.render('_profileManagement/showProfile', {
                entries: passToView
            });
        });
    });

    //Process confirmed updates to the user's profile
    app.post('/profile/update/process', function(req, res) {
        let docToEditId = req.body.id;
        var incomingData = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            profilephoto: req.body.profilephoto,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country
        }
        var docRef = useraccounts.doc(docToEditId);
        docRef.update(incomingData);
        res.redirect('/profile/update/success')
    });

    //Render the page confirming that the user's profile updates have been accepted
    app.get('/profile/update/success', function(req, res) {
        res.render('_profileManagement/profileUpdateSuccess');
    });

//User content routes__________________________________________________________________________________________________

    //Render the page listing all entries made by the user
    app.get('/usercontent/entries/show', function(req, res) {
        let cookiedEmail = req.cookies['email']
        var query = entriespool.orderBy('date', 'desc');;
        let passToView = [];
        query.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                if (x.email === cookiedEmail){
                    passToView.push(x)
                };
            });
            res.render('_userContent/showEntries', {
                entries: passToView
            });
        });
    });

    //Render the page for creating a new entry
    app.get('/usercontent/entries/add/prompt', function(req, res) {
        res.render('_userContent/createNewEntry');
    });

    //Render the page for editing an existing entry
    app.post('/usercontent/entries/edit/prompt/', function(req, res) {
        let docToEditId = req.body.idToEdit
        let passToView = [];
        entriespool.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                if(x.id === docToEditId) {
                    passToView.push(x)
                }
                console.log(x)
            });
            res.render('_userContent/editEntry', {
                entries: passToView
            });
        });
    });
    
    //Process changes to an existing entry
    app.post('/usercontent/entries/edit/process/', function(req, res) {
        let docToEditId = req.body.id;
        console.log(docToEditId)
        var incomingData = {
            date: req.body.date,
            hours: req.body.hours,
            comments: req.body.comments,
            proglang: req.body.proglang,
        }
        console.log(incomingData)
        var docRef = entriespool.doc(docToEditId);
        console.log(docRef)
        docRef.update(incomingData);
        res.redirect('/usercontent/entries/show')
    });
    
    //Show statistics
    app.get('/usercontent/entries/show/stats', function(req, res) {
        let cookiedEmail = req.cookies['email']
        var query = entriespool.orderBy('date', 'desc');;
        let hoursSum = 0;
        query.get().then(recordsRetrieved => {
            recordsRetrieved.forEach(record => {
                let x = record.data()
                let y = record.id
                x.id = y
                if (x.email === cookiedEmail){
                    hoursSum = hoursSum + x.hours
                };
            });
            res.render('_userContent/showStats', {
                hoursSum: hoursSum
            });
        });
    });

    //Add an entry for the logged in user
    app.post('/usercontent/entries/add/process', function(req, res) {
        let cookiedEmail = req.cookies['email']

        entriespool.add({
            email: cookiedEmail,
            date: req.body.date,
            hours: req.body.hours,
            comments: req.body.comments,
            proglang: req.body.proglang,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        res.redirect('/usercontent/entries/show')
    });

    //Process entry deletion request
    app.post('/usercontent/entries/delete/process', function(req, res) {
        let docToDeleteId = req.body.idToDelete
        entriespool.doc(`${docToDeleteId}`).delete();
        res.redirect('/usercontent/entries/show')
    });

//Logout routes__________________________________________________________________________________________________

    //Render the page confirming that the user has logged out, use the unauthorized layout
    app.get('/logout/process', function(req, res) {
        res.render('_logout/processingLogout', {layout: 'unauthorized'});
    });

    //Render the page confirming that the user has logged out, use the unauthorized layout
    app.get('/logout/success', function(req, res) {
        res.render('_logout/logoutSuccess', {layout: 'unauthorized'});
    });

//START SERVER================================================================

app.listen(port, function(){
    console.log(`Server listening on Port ${port}...`)
})