var express = require('express');
var mongoose = require('mongoose');
var bijective = require('./bijective.js');
var Urls = require('./models');

mongoose.connect('mongodb://localhost/url-shortner');

var app = express();
app.use(express.static('public'));

app.get('/url/:longUrl',function(req,res){
  var shortUrl = '';

  Urls.findOne({url:req.params.longUrl},function(err,doc){
    if(doc){
      res.send({'key':bijective.encode(doc._id)});
    }else{
      var newUrl = Urls({
        url:req.params.longUrl
      });

      newUrl.save(function(err){
        if(err) console.log(err);

        res.send({'key':bijective.encode(newUrl._id)});
      });
    }
  });
});

app.post('/url_list',function(req,res){
  Urls.find(function(err,result){
    if(result){
      var res_arr = new Array();

      result.forEach(
        function see(value,index){
          var aJson = new Object();
          aJson.count = value.count
          aJson._id = bijective.decode(value._id);
          aJson.url = value.url
          aJson.created_at = getFormatDate(value.created_at);
          console.log(value.url);
          res_arr.push(aJson);
        }
      )
      console.log(res_arr);
      res.send(res_arr);
    }
  });
});

function getFormatDate(date){

	var year = date.getFullYear();                                 //yyyy

	var month = (1 + date.getMonth());                     //M

	month = month >= 10 ? month : '0' + month;     // month 두자리로 저장

	var day = date.getDate();                                        //d

	day = day >= 10 ? day : '0' + day;                            //day 두자리로 저장

	return  year + '.' + month + '.' + day;

}

app.get('/:key',function(req,res){

  var id = bijective.decode(req.params.key);

  Urls.findOneAndUpdate({_id:id},{$inc:{count:1}},function(err,doc){
    if(doc){
      res.redirect(doc.url);
    }else{
      res.redirect('/');
    }
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
