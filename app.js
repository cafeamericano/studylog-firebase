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
        var recordsToImport = []
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
        var recordsToImport = []
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