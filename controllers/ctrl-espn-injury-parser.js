
var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
var d3 = require('d3');
var htmlparser = require("htmlparser");
var utils = require("./espn-utils");



module.exports.getEspnInjuries = function(req, res) {
    var url = "http://www.espn.com/nfl/injuries";


    request(url, function (err, response, html) {
        if (!err) {
            var $ = cheerio.load(html);
            var resultArray = [];
            console.log($('.stathead').first().siblings().length);
            var currentTeam= $('.stathead').first().text()
            console.log(currentTeam);
            for(var i=0; i<$('.stathead').first().siblings().length; i++) {
                var currentSibling = $('.stathead').first().siblings().eq(i)

                if($(currentSibling).hasClass('oddrow')) {
                    if($(currentSibling).children().first().children().first().attr('href')) {
                        tempPlayer = {};
                        tempPlayer.cteam = currentTeam;
                        // console.log($(currentSibling).children().first().children().first().attr('href'));
                        tempPlayer.player_page = $(currentSibling).children().first().children().first().attr('href');
                        tempPlayer.player_name = $(currentSibling).children('td').first().text().split(',')[0].trim();
                        tempPlayer.pos1 = $(currentSibling).children('td').first().text().split(',').pop().trim();
                        tempPlayer.injury_status = $(currentSibling).children('td').eq(1).text();
                        tempPlayer.status_date = $(currentSibling).children('td').last(1).text();
                        tempPlayer.espn_id = $(currentSibling).attr('class').split('-').pop();
                        // console.log(tempPlayer);
                        if($(currentSibling).next().children().first().attr('colspan')) {
                            tempPlayer.injury_description = $(currentSibling).next().text();
                        }
                        resultArray.push(tempPlayer);
                    }
                }
                if($(currentSibling).hasClass('evenrow')) {
                    if($(currentSibling).children().first().children().first().attr('href')) {
                        tempPlayer = {};
                        // console.log($(currentSibling).children().first().children().first().attr('href'));
                        tempPlayer.player_page = $(currentSibling).children().first().children().first().attr('href');
                        tempPlayer.player_name = $(currentSibling).children('td').first().text().split(',')[0].trim();
                        tempPlayer.pos1 = $(currentSibling).children('td').first().text().split(',').pop().trim();
                        tempPlayer.injury_status = $(currentSibling).children('td').eq(1).text();
                        tempPlayer.status_date = $(currentSibling).children('td').last(1).text();
                        tempPlayer.espn_id = $(currentSibling).attr('class').split('-').pop();
                        console.log(tempPlayer);
                        if($(currentSibling).next().children().first().attr('colspan')) {
                            tempPlayer.injury_description = $(currentSibling).next().text();
                        }
                        resultArray.push(tempPlayer);
                    }
                }
                if($(currentSibling).hasClass('stathead')) {
                    currentTeam = $(currentSibling).text()
                    // console.log(currentTeam);
                }
            }
            res.status(200);
            res.json(resultArray);
        }
    });
};



