// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var $ = require("jquery");
var $$ = "";
var validateCooks = "";
var __VIEWSTATE;
var __VIEWSTATEGENERATOR;
var __EVENTVALIDATION;
var successCookie;
var count = 0;



function getValidate(){
  request
  .get('http://haijia.bjxueche.net/tools/CreateCode.ashx?key=ImgCode&random=0.4733762011711844')
  .on('error', function(err) {
    console.log(err)
  })
  .on('response', function(response) {
    validateCooks = response.headers["set-cookie"].join(" ");
    //console.log(validateCooks);
    $("#f4").attr('src',__dirname + "/validate.gif?r=" + new Date());
    getView();
  })
  .pipe(fs.createWriteStream(__dirname +'/validate.gif'))

}

function getView(){
  request.get({url:"http://haijia.bjxueche.net/"},function(error, response, body){
    $$ = cheerio.load(body);
    __VIEWSTATE = ($$("#__VIEWSTATE").val());
    __VIEWSTATEGENERATOR = ($$("#__VIEWSTATEGENERATOR").val());
    __EVENTVALIDATION = ($$("#__EVENTVALIDATION").val());

  });
}
function login(){
  request.post({
    url: "http://haijia.bjxueche.net/",
    form: {
      "__VIEWSTATE": __VIEWSTATE,
      "__VIEWSTATEGENERATOR": __VIEWSTATEGENERATOR,
      "__EVENTVALIDATION": __EVENTVALIDATION,
      "txtUserName": $("#f1").val(),
      "txtPassword": $("#f2").val(),
      "txtIMGCode": $("#f3").val(),
      "BtnLogin": "登  录"
    },
    headers : {
      "Cookie" : validateCooks.replace("HttpOnly","")
    }
  }, function(err, httpResponse, body) {
    // console.log(err);
    // console.log(httpResponse);
    //$ = cheerio.load(body);

    //console.log(httpResponse);

    // alert(body);
    if(body.indexOf('<h2>Object moved to <a href="/index.aspx">here</a>.</h2>')!=-1){
      successCookie = (httpResponse.req.res.headers["set-cookie"]);
      getYC(successCookie);

    }else{
      alert("登录出现问题");
    }
  });
}

function getYC(_successCookie){
  //console.log(_successCookie[0]);
  request.get({
    url:"http://haijia.bjxueche.net/ych2.aspx?r=" + Math.random(),
    headers:{
      "Cookie":_successCookie[0]
    }},function(error, response, body){
    var _jq = cheerio.load(body);
    $("#tblData").html(_jq("#tblMain").html());

    for (var i = 0; i < 3; i++) {
      if(_jq("#tblMain tr td[yyrq="+$('#f6').val()+"]").eq(i).text() != "无"){
        $("#result").removeClass("label-default").addClass("label-danger").html("有车啦，快来约车吧！ " + $('#f6').val() + " 时间：" + new Date());
        alert("有车啦，快来约车吧！ " + $('#f6').val() + " 时间：" + new Date());
      }else{
        $("#result").removeClass("label-danger").addClass("label-default").html("没车哦继续等吧");
      }
    }
    setTimeout(function(){
      $("#count").text(count);
      getYC(successCookie);
    },30000);
    count++;
  });
}


var OP = {
  init : function(){
    getView();
    getValidate();
    $("#f4").on("click",function(){
      getValidate();
    });
    $("#f5").on("click",function(){
      login();
    });
  }
};
$(function(){
  OP.init();
});
