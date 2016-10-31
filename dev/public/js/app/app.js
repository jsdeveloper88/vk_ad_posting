$(function () {
    var SendMessDivView = require('send_mess_div_view');
    var PageRouter = require('page_router');
    var router = new PageRouter();
    new SendMessDivView();
    //new UpdateDBDivView();
    //new PageRouter();
    Backbone.history.start();
});