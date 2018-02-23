var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SequencesSchema = Schema({
  _id:{type:String,required:true},
  seq:{type:Number,default:0}
})

var sequences = mongoose.model('sequences',SequencesSchema);

var UrlsSchema = new Schema({
  _id:{type:Number},
  url:String,
  created_at:Date,
  count:{type:Number,default:0}
});

UrlsSchema.pre('save',function(next){
  var self = this;
  sequences.findOneAndUpdate({_id:'url_count'},{$inc:{seq:1}},
  {upsert:true},function(err,result){
    console.log(result);
    if(err) return next(err);
    self.created_at = new Date();
    self._id = result.seq;
    next();
  });
});

var urls = mongoose.model('urls',UrlsSchema);

module.exports = urls;
