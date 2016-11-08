var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); //mongo connection
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

//build the REST operations at the base for hives
//this will be accessible from http://127.0.0.1:3000/hives if the default route for / is left unchanged
router.route('/')
    //GET all hives
    .get(function(req, res, next) {
        //retrieve all hives from Monogo
        mongoose.model('Hive').find({}, function (err, hives) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    //HTML response will render the index.jade file in the views/hives folder. We are also setting "hives" to be an accessible variable in our jade view
                    html: function(){
                        res.render('hives/index', {
                            title: 'All my Hives kao',
                            "hives" : hives
                        });
                    },
                    //JSON response will show all hives in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
            }
        });
    })
    //POST a new hive
    .post(multer({ dest: './uploads/'}).single('upl'), function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var detailedInspection1 = req.body.detailedInspection1;


        //call the create function for our database
        mongoose.model('Hive').create({
            name : name,
            inspections: [{ detailedInspection1: detailedInspection1 }]
        }, function (err, hive) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Hive has been created
                console.log('POST creating new hive: ' + hive);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("hives");
                        // And forward to success page
                        res.redirect("/hives");
                    },
                    //JSON response will show the newly created hive
                    json: function(){
                        res.json(hive);
                    }
                });
            }
        })
    });

/* GET New Hive page. */
router.get('/new', function(req, res) {
    res.render('hives/new', { title: 'Add New Hive' });
});

router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Hive').findById(id, function (err, hive) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(hive);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Hive').findById(req.id, function (err, hive) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + hive._id);

                res.format({
                    html: function(){
                        res.render('hives/show', {
                            "hive" : hive
                        });
                    },
                    json: function(){
                        res.json(hive);
                    }
                });
            }
        });
    });


//GET the individual hive by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the hive within Mongo
    mongoose.model('Hive').findById(req.id, function (err, hive) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the hive
            console.log('GET Retrieving ID: ' + hive._id);
            //format the date properly for the value to show correctly in our edit form
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                    res.render('hives/edit', {
                        title: 'Hive' + hive._id,
                        "hive" : hive
                    });
                },
                //JSON response will return the JSON output
                json: function(){
                    res.json(hive);
                }
            });
        }
    });
});

//PUT to update a hive by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;

    //find the document by ID
    mongoose.model('Hive').findById(req.id, function (err, hive) {
        //update it
        hive.update({
            name : name
        }, function (err, hiveID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        res.redirect("/hives/" + hive._id);
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(hive);
                    }
                });
            }
        })
    });
});

//DELETE a Hive by ID
router.delete('/:id/edit', function (req, res){
    //find hive by ID
    mongoose.model('Hive').findById(req.id, function (err, hive) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            hive.remove(function (err, hive) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + hive._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function(){
                            res.redirect("/hives");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function(){
                            res.json({message : 'deleted',
                                item : hive
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;