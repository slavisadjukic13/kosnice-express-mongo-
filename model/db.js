var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://slavisauser:slavisapass@ds143737.mlab.com:43737/slavisa');
// mongoose.connect('mongodb://localhost:27017/mongo');
