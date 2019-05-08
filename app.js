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

    //Import all entries from JSON
    app.get('/importentries', function(req, res) {
        var recordsToImport = [{"comments":"Hello","date":"2019-05-08","email":"garykey3950@gmail.com","hours":"1","proglang":"","timestamp":{"seconds":1557297221,"nanoseconds":856000000},"id":"HRd7U6XlhOPzFODnDEl2"},{"comments":"As of 11:30PM. Converting MySQL version of study log into a Firebase version. Three hours of class. Splitting study log into a MySQL and Firebase version as well as cleaning up GitHub account.","date":"2019-05-07","email":"mfarmer5102@gmail.com","hours":"7","proglang":"Javascript","timestamp":{"seconds":1557286162,"nanoseconds":441000000},"id":"bf74L9Vj9nfSUDi9MKry"},{"comments":"As of 12:40AM. Implemented edit feature into Firestudy. Tweaked UI. Worked on homework involving html and css, then made a few minor tweaks to firestudy.","date":"2019-05-06","email":"mfarmer5102@gmail.com","hours":"3","proglang":"Javascript","timestamp":{"seconds":1557286141,"nanoseconds":44000000},"id":"xfNvJFk42aXbFE03dzzb"},{"ID":101,"category":null,"comments":"As of 10:30. Experimenting with Python and practicing it on Codecademy. Watching videos on Django.","date":"2019-05-05","email":"mfarmer5102@gmail.com","hours":4.5,"proglang":"Python","subtech":"undefined","timestamp":"2019-05-05 15:12:29","id":"zGaOWT8M1QKdlLkDfuW9"},{"ID":102,"category":null,"comments":"!!! Capturing totals by subject as of 5/5/19 at 10:30PM. 370 in JavaScript (75 in React), 30 in Swift, 20 in VBA, 10 in C, 4 in C#, 4.5 in Python.","date":"2019-05-05","email":"mfarmer5102@gmail.com","hours":"0","proglang":"","subtech":"undefined","timestamp":"2019-05-05 22:33:40","id":"rbeM1ZwXdlt71mFPd6Jt"},{"comments":"As of 1:15AM. Studying Javascript and working with CSS.","date":"2019-05-05","email":"mfarmer5102@gmail.com","hours":"2.75","proglang":"Javascript","timestamp":{"seconds":1557286118,"nanoseconds":798000000},"id":"ZQVVWJK9J5RLqVvcpJSG"},{"ID":97,"category":null,"comments":"4 hours of class, plus 4 hours of independent study time, largely studying Firebase and brushing up on CSS.","date":"2019-05-04","email":"mfarmer5102@gmail.com","hours":8,"proglang":"Javascript","subtech":"Firebase","timestamp":"2019-05-05 00:37:01","id":"n6KrVIP5L6OGq9LcpQJz"},{"ID":96,"category":null,"comments":"As of 7:30PM. Studying Firebase.","date":"2019-05-03","email":"mfarmer5102@gmail.com","hours":2,"proglang":"Javascript","subtech":null,"timestamp":"2019-05-03 19:29:28","id":"L33nytYNlqxJGLFXERmK"},{"ID":95,"category":null,"comments":"Class. HTML and CSS as well as Git.","date":"2019-05-02","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-05-03 19:29:11","id":"Xd8wXH1vuhFr5AeOtT79"},{"ID":94,"category":null,"comments":"Studied Firebase. Learned how to create a simple messaging app with reading/writing to DB as well as login with Google Account. Identified essential files that makeup a Firebase app. As of 1:55AM.","date":"2019-05-01","email":"mfarmer5102@gmail.com","hours":3.75,"proglang":"Javascript","subtech":null,"timestamp":"2019-05-01 22:08:16","id":"QwxA11kseYc8MyM10T37"},{"ID":93,"category":null,"comments":"First day of class (HTML), plus personal study. As of 11:00PM.","date":"2019-04-30","email":"mfarmer5102@gmail.com","hours":3.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-30 23:02:37","id":"sGxMiWMhtGDr2niFIWvg"},{"ID":92,"category":null,"comments":"New entry for Gary's account.","date":"2019-04-30","email":"garykey3950@gmail.com","hours":2.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-30 02:04:42","id":"UFxuITdGIXoPaL1jVcbr"},{"ID":91,"category":null,"comments":"As of 2:00AM.","date":"2019-04-29","email":"mfarmer5102@gmail.com","hours":7.6,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-30 02:01:34","id":"c3g4hUsM4ww5x8YyO01o"},{"ID":89,"category":null,"comments":"Made account for Gary.","date":"2019-04-29","email":"garykey3950@gmail.com","hours":1,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-30 00:57:52","id":"EHHjGhAb6qWmx2srOtt6"},{"ID":85,"category":null,"comments":"As of 12:55AM. Now working on a messaging app.","date":"2019-04-28","email":"mfarmer5102@gmail.com","hours":7.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-28 16:21:02","id":"SdezYa4Pz5ggs90DWKQT"},{"ID":84,"category":null,"comments":"As of 12:15AM. Working on Notebook app.","date":"2019-04-27","email":"mfarmer5102@gmail.com","hours":5.75,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-27 15:27:43","id":"jlIZgRfMlSGL8jChvg3F"},{"ID":83,"category":null,"comments":"As of 11:59PM. Studying user accounts.","date":"2019-04-26","email":"mfarmer5102@gmail.com","hours":5.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-26 22:31:40","id":"SJbNQLUAOUq9JjJGROMI"},{"ID":82,"category":null,"comments":"As of 8:45PM. 1.5 hours studying React. 7.5 hours studying user logins and cookies. Successfully created a basic application that allows logging in, viewing database entries specific to the logged in user, and logging out of the application.","date":"2019-04-25","email":"mfarmer5102@gmail.com","hours":9,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-25 09:56:07","id":"aUgKBQR5QzoUcwuxZPax"},{"ID":79,"category":null,"comments":"Studied React. Cleaning up code and restating code in a different way.","date":"2019-04-24","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-24 23:23:45","id":"Ge6rbb80e6A7TJ5GNhoV"},{"ID":81,"category":null,"comments":"Small amount of React studies, again.","date":"2019-04-23","email":"mfarmer5102@gmail.com","hours":1,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-24 23:24:28","id":"K7ioxf4aPUaND4LKAJqE"},{"ID":80,"category":null,"comments":"Small amount of React studies...","date":"2019-04-22","email":"mfarmer5102@gmail.com","hours":1,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-24 23:24:01","id":"CotfcdAWrSMc7B0aF0AA"},{"ID":78,"category":null,"comments":"Studied React.","date":"2019-04-21","email":"mfarmer5102@gmail.com","hours":3.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-21 17:55:36","id":"oqc7e4NwGZDt6TK7L2pA"},{"ID":77,"category":null,"comments":"Studied React. Focused on implementing workaround solutions to program shortcomings as well as eliminating need for page refresh through use of rerendering components by updating parent component state.","date":"2019-04-20","email":"mfarmer5102@gmail.com","hours":8,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-20 16:50:13","id":"1KhiLwC01KREDgyEnNEn"},{"ID":76,"category":null,"comments":"Studied React.","date":"2019-04-17","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-17 23:45:22","id":"iLwsZhI8OL6L22E6lwRd"},{"ID":75,"category":null,"comments":"Studied React, fixed some bugs in the flexible spreadsheet project.","date":"2019-04-16","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-16 23:33:27","id":"bZ6mxHjh6xqvTZSgiPWZ"},{"ID":74,"category":null,"comments":"Studied React.","date":"2019-04-14","email":"mfarmer5102@gmail.com","hours":6.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-14 15:36:08","id":"poE6NyiKDh76EaLVIz3a"},{"ID":73,"category":null,"comments":"Studied React for approximately nine hours in the context of a flexible spreadsheet program.","date":"2019-04-13","email":"mfarmer5102@gmail.com","hours":9,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-14 03:04:05","id":"DakTwvb27gZEQSe2zfYo"},{"ID":72,"category":null,"comments":"Studied React all night.","date":"2019-04-10","email":"mfarmer5102@gmail.com","hours":3.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-10 23:40:16","id":"TwHeKs5qT9ZlCk6PYFCL"},{"ID":71,"category":null,"comments":"Studied React all night, again.","date":"2019-04-09","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-10 00:14:54","id":"oWhu3vGTxqHxtkxqsWCh"},{"ID":70,"category":null,"comments":"Studied React all night.","date":"2019-04-08","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-08 23:58:24","id":"GOIQKwPe8iEMHhK2W4sY"},{"ID":69,"category":null,"comments":"As of 11:15PM. Spent the entire day studying React.","date":"2019-04-07","email":"mfarmer5102@gmail.com","hours":8,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-07 17:30:27","id":"5T6yqumkQBGWJM4N2V5b"},{"ID":68,"category":null,"comments":"As of 9:10PM. Studied mainly ReactJS as well as some C#.","date":"2019-04-06","email":"mfarmer5102@gmail.com","hours":7,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-06 18:03:06","id":"qyF0xqpDXLBGDdoq8HWb"},{"ID":67,"category":null,"comments":"Studied C#.","date":"2019-04-05","email":"mfarmer5102@gmail.com","hours":2.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-05 23:42:29","id":"ks3AOL2sSICPtZMZ7JNy"},{"ID":66,"category":null,"comments":"Studying transferring data in JSON format.","date":"2019-04-04","email":"mfarmer5102@gmail.com","hours":1,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-04 22:05:55","id":"eBeSMlopCorGxJ1Sg2Ec"},{"ID":65,"category":null,"comments":"Successfully connected React app to MySQL database via Express backend.","date":"2019-04-02","email":"mfarmer5102@gmail.com","hours":1.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-04-02 22:02:00","id":"C69mezhqyHSWyNWGSapN"},{"ID":59,"category":null,"comments":"Finished pre-work. Studied React and learned how to use Props as well as State. Learned structure of a React app when used in combination with Express. @4:30.","date":"2019-03-31","email":"mfarmer5102@gmail.com","hours":5.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-31 14:01:06","id":"UHY0gXG7gZJS0GeHe31N"},{"ID":57,"category":null,"comments":"Studied a lot of ReactJS and finished pre-work.","date":"2019-03-30","email":"mfarmer5102@gmail.com","hours":5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-31 12:06:49","id":"jxpECHx7AhLLOki8uflJ"},{"ID":58,"category":null,"comments":"Estimated combined study time for March 24th through March 29th.","date":"2019-03-29","email":"mfarmer5102@gmail.com","hours":5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-31 12:07:25","id":"4r7nNK6zJDt0U3EmATOT"},{"ID":56,"category":null,"comments":"Did Module 8, studied math, watched React video, worked on Portfolio.","date":"2019-03-23","email":"mfarmer5102@gmail.com","hours":7,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-23 17:56:48","id":"53P5L8Qkq5Wiah6We6UP"},{"ID":55,"category":null,"comments":"Everything from March 14th to March 22nd.","date":"2019-03-22","email":"mfarmer5102@gmail.com","hours":20,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-23 17:56:09","id":"ItIrf3oBe7YU5SiY14WH"},{"ID":54,"category":null,"comments":"Began designing UI of to-do list application.","date":"2019-03-13","email":"mfarmer5102@gmail.com","hours":2.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-13 22:55:23","id":"Z0U35sX7NG3VreFM9wqI"},{"ID":53,"category":null,"comments":"Placement of Google Charts into inline-block cards as well as other UI changes.","date":"2019-03-11","email":"mfarmer5102@gmail.com","hours":1,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-11 23:18:55","id":"AbA64yC0zNSV0txAGDvm"},{"ID":46,"category":null,"comments":"As of 3:00PM. Learned Git. Added edit feature to application. Set display for record ID to none. Figured out how to implement Google API by passing in data gathered through SQL through Express and Handlebars, then formatting templated content as JSON formatted data.","date":"2019-03-10","email":"mfarmer5102@gmail.com","hours":5.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 15:01:41","id":"jPULawMqdghHsHKYZ1Qb"},{"ID":47,"category":null,"comments":"Practiced with Express and MySQL. Learned HandleBars.","date":"2019-03-09","email":"mfarmer5102@gmail.com","hours":8.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 15:01:59","id":"kTsHJd8sgk9QgA4RDvLS"},{"ID":45,"category":null,"comments":"Includes everything from February 24th, 2019 to March 8th, 2019.","date":"2019-03-08","email":"mfarmer5102@gmail.com","hours":23,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 15:01:02","id":"jnyIJtAyhN4h1XZd6bjq"},{"ID":52,"category":null,"comments":"","date":"2019-02-28","email":"mfarmer5102@gmail.com","hours":3.5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 21:11:17","id":"pc50PhiewQT7PFnMSOho"},{"ID":51,"category":null,"comments":"","date":"2019-02-27","email":"mfarmer5102@gmail.com","hours":4,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 21:11:04","id":"a2Ftw7Yt54PvHdA0y4Eo"},{"ID":50,"category":null,"comments":"","date":"2019-02-26","email":"mfarmer5102@gmail.com","hours":3,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 21:10:55","id":"qmnEJLsYWaru5C0dyghh"},{"ID":49,"category":null,"comments":"","date":"2019-02-25","email":"mfarmer5102@gmail.com","hours":2,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 21:10:45","id":"C5x0oBQKXdhyvAZcY54l"},{"ID":48,"category":null,"comments":"","date":"2019-02-24","email":"mfarmer5102@gmail.com","hours":5,"proglang":"Javascript","subtech":null,"timestamp":"2019-03-10 21:10:36","id":"sKzCKuXwjbu97C6vaZEq"},{"ID":16,"category":null,"comments":"Verified sum of hours spent studying Javascript with multiple sub-techs from Nov 24th, 2018 to Feb 22, 2019.","date":"2019-02-23","email":"mfarmer5102@gmail.com","hours":150,"proglang":"Javascript","subtech":"","timestamp":"2019-03-09 13:16:07","id":"5J8v6D6RH9ybnujjyjW0"},{"ID":100,"category":null,"comments":"Estimated amount of time spent studying C from June 4th , 2018 to November 23rd, 2018.","date":"2018-06-04","email":"mfarmer5102@gmail.com","hours":"10","proglang":"C","subtech":"","timestamp":"2019-05-05 15:10:13","id":"mvEwZpU8M6XKha3AnInh"},{"ID":99,"category":null,"comments":"Estimated amount of time spent studying VBA from June 4th , 2018 to November 23rd, 2018.","date":"2018-06-04","email":"mfarmer5102@gmail.com","hours":"20","proglang":"VBA","subtech":"","timestamp":"2019-05-05 15:09:48","id":"hU5Zp7MH0DwSRiiEwTgP"},{"ID":98,"category":null,"comments":"Estimated amount of time spent studying Swift from June 4th , 2018 to November 23rd, 2018.","date":"2018-06-04","email":"mfarmer5102@gmail.com","hours":"30","proglang":"Swift","subtech":"","timestamp":"2019-05-05 15:09:25","id":"c5egQ27DYisWV5fwjyo0"},{"comments":"","date":{"seconds":1557201600,"nanoseconds":0},"email":"user@email.com","hours":0,"proglang":"","timestamp":{"seconds":1557251820,"nanoseconds":0},"id":"JQukLDPhbuoYxsGwUyQj"}]
        for (i=0; i<recordsToImport.length; i++) {
            entriespool.add(recordsToImport[i]);
        }
        res.redirect('/')
    });


    //Export all entries as JSON
    app.get('/exportentries', function(req, res) {
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
            res.send(passToView)
        });
    });

    //Import users from JSON
    app.get('/importusers', function(req, res) {
        var recordsToImport = [{"ID":1,"password":"watermelon","email":"mfarmer5102@gmail.com","firstname":"Matthew","lastname":"Farmer","city":"Raleigh","state":"NC","zip":"27604","country":"United States","profilephoto":"https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg"},{"ID":7,"password":"marilyn","email":"marilynmonroe@email.com","firstname":"Marilyn","lastname":"Monroe","city":"Los Angeles","state":"California","zip":"90001","country":"United States","profilephoto":"https://upload.wikimedia.org/wikipedia/commons/4/4e/Monroecirca1953.jpg"},{"ID":10,"password":"ladygaga","email":"ladygaga@email.com","firstname":"Lady","lastname":"Gaga","city":"New York","state":"New York","zip":"10001","country":"United States","profilephoto":"https://upload.wikimedia.org/wikipedia/commons/0/0e/Lady_Gaga_Glitter_and_Grease2.jpg"},{"ID":11,"password":"cocochanel","email":"cocochanel@email.com","firstname":"Coco","lastname":"Chanel","city":"Paris","state":"Paris","zip":"10000","country":"France","profilephoto":"https://upload.wikimedia.org/wikipedia/commons/9/90/Gabrielle_Chanel_en_marini%C3%A8re.jpg"},{"ID":12,"password":"kylie","email":"kylieminogue@email.com","firstname":"Kylie","lastname":"Minogue","city":"London","state":"London","zip":"10000","country":"England","profilephoto":"https://upload.wikimedia.org/wikipedia/commons/e/e1/Kylie_Minogue_in_Paris_2005-03-26.jpg"},{"ID":32,"password":"banana","email":"garykey3950@gmail.com","firstname":"Gary","lastname":"Key","city":"Raleigh","state":"NC","zip":"27604","country":"USA","profilephoto":""}]
        for (i=0; i<recordsToImport.length; i++) {
            useraccounts.add(recordsToImport[i]);
        }
        res.redirect('/')
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
    
    //Process entry deletion request
    app.post('/usercontent/entries/delete/process', function(req, res) {
        let docToDeleteId = req.body.idToDelete
        entriespool.doc(`${docToDeleteId}`).delete();
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
                if (x.email === cookiedEmail){
                    hoursSum = hoursSum + parseFloat(x.hours)
                };
            });
            res.render('_userContent/showStats', {
                hoursSum: hoursSum
            });
        });
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