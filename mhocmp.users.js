// ==UserScript==
// @name         Labour Voting Filter
// @namespace    http://mhoc.co.uk/
// @version      0.1
// @description  Removes all non-labour votes from divisions, counts votes and shows absent MPs
// @author       jb567
// @match        https://www.reddit.com/r/MHOCMP/comments/*
// @grant        none
// @copyright   2016+, jb567 (http://mhoc.co.uk)
// @license     GNU GPLv3
// @version     2.9.0
// @run-at      document-end
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// ==/UserScript==


var node = document.createElement('div');
node.innerHTML = '<button id="lab-button" type="button" style="background-color:#d50032;">Labour Only</button><button id="count-button" type="button" >Count!</button><button id="mpmissing-button" type="button" >Missing MPs</button>';
$('.titlebox').prepend(node);

document.getElementById('lab-button').addEventListener ("click", labOnly, false);
document.getElementById('count-button').addEventListener ("click", count, false);
document.getElementById('mpmissing-button').addEventListener ("click", checkVoterList, false);


function labOnly(){
    $.each($('.flair'), function(i, val){
        if(!$(val).hasClass('flair-labour')&&!$(val).hasClass('flair-labspeaker')&&$(val).parent().parent().parent().hasClass('comment')){
            $(val).parent().parent().parent().css("display", "none");
        }
    });
}

function count(){
    var aye_pat = /aye/i;
    var no_pat  = /no|nay/i;
    var abs_pat = /abstain/i;
    var aye = 0;
    var no  = 0;
    var abs = 0;
    var dnv = 100;
    $.each($('.comment .entry .usertext .usertext-body .md'), function(i, val){
        if($(val).parent().parent().parent().text().indexOf('AutoModerator') !== -1){
            console.log($(val).parent().parent().parent().text());
        } else if(aye_pat.exec($(val).text()) !== null){
            aye++;
            dnv--;
        } else if (no_pat.exec($(val).text()) !== null){
            no++;
            dnv--;
        } else if (abs_pat.exec($(val).text()) !== null){
            abs++;
            dnv--;
        }
    });
    alert('AYES TO THE RIGHT: ' + aye + '\nNOES TO THE LEFT: ' + no + '\nABSTAINING: ' + abs + '\nDID NOT DIVIDE: ' + dnv);
}

function checkVoterList(){
    var voterTargets = ["names",];
    $.each($('.tagline'), function(i,val){
        for(var i = 0; i < voterTargets.length; i++){
            if(voterTargets[i] != "NULL" && $(val).text().toLowerCase().indexOf(voterTargets[i].toLowerCase()) !== -1){
                voterTargets[i] = "NULL";
            }
        }
    });
    var alertText = "THE FOLLOWING MPS HAVEN'T VOTED";
    for(var i = 0; i < voterTargets.length; i++){
            if(voterTargets[i] != "NULL"){
                alertText = alertText + "\n" + voterTargets[i];
            }
        }
    alert(alertText);
}
