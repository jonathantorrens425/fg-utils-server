
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
var d3 = require('d3');

var htmlparser = require("htmlparser");



module.exports.getEspnInjuries = function(req, res) {

    var sendJSONResponse = function (res, status, content) {
        res.status(status);
        res.json(content);
    };

    var url = "http://www.espn.com/nfl/injuries";

    http.get(url, function(htmlRes) {

        // console.log(htmlRes);
        var body = "";
        htmlRes.on('data', function(d) {
            body += d;
        })

        htmlRes.on('end', function() {
            // console.log("BODY!")
            // console.log(body);
            //
            // var handler = new htmlparser.DefaultHandler(
            //     function (error, dom) {
            //
            //         // console.log(JSON.stringify(dom))
            //         fs.writeFile("./espn.js", JSON.stringify(dom));
            //
            //         // d3.selectAll('.my-table-header', dom);
            //
            //     }, { verbose: false, ignoreWhitespace: true }
            // );
            // var parser = new htmlparser.Parser(handler);
            // var parsed = parser.parseComplete(body);


            // sendJSONResponse(res, 200, parsed);
            // sys.puts(sys.inspect(handler.dom, false, null));
        })
    })



    request(url, function (err, response, html) {
        // console.log(html);
        if (!err) {



            var $ = cheerio.load(html);

            var firstStatHead = $('tr.stathead');
            firstStatHead.each(function(statheadIndex, statheadElement){

                if (statheadIndex >= 1) { return false; }
                console.log("Index: " + statheadIndex);
                console.log($(this).length);
                // console.log($(this).text());
                console.log($(this).siblings('.oddrow').length);

                var tempPlayerArray = [];
                var tempPlayer = {};

                $(this).siblings(function(playerRowIndex, playerRowElement){
                    // console.log($(playerRowElement).attr('class'));
                    if($(playerRowElement).hasClass('stathead')) {
                        console.log('TEAM')
                        console.log($(playerRowElement).text());
                        if (!tempPlayer) {
                            tempPlayer = {}
                        } else {
                            tempPlayerArray.push(tempPlayer);
                            tempPlayer= {};
                            tempPlayer.cteam = $(playerRowElement).text();
                        }
                    }
                    if($(playerRowElement).hasClass('oddrow') || $(playerRowElement).hasClass('evenrow')) {

                        if($(playerRowElement).children().first().attr('colspan')) {
                            tempPlayer.injury_description = $(playerRowElement).children().first().text();
                            console.log($(playerRowElement).children().first().text());
                        } else {
                            if($(playerRowElement).children('a').first()) {
                                console.log('Player');
                                tempPlayer.player_page = $(playerRowElement).children('a').first().attr('href');

                                tempPlayer.player_name = $(playerRowElement).children('td').first().text().split(',')[0].trim();
                                tempPlayer.pos1 = $(playerRowElement).children('td').first().text().split(',').pop().trim();
                                tempPlayer.injury_status = $(playerRowElement).children('td').eq(1).text();
                                tempPlayer.status_date = $(playerRowElement).children('td').last(1).text();
                                tempPlayer.espn_id = $(playerRowElement).attr('class').split('-').pop();
                                // console.log($(playerRowElement).children().text());
                            }
                        }
                    }
                })
                console.log(tempPlayerArray);
                res.status(200);
                res.json(tempPlayerArray);
                // sendJSONReponse(res, 200, tempPlayerArray);
            })
        }
    });
};



