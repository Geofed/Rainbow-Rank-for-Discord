var Discord = require("discord.js");
var fs = require('fs');
var data = require("./data.json");
var options = require("./options.json");
var auth = require("./auth.json");

var afgdRole;
var i = 0;

var colours = [];
var coloursIndex = 0;

var interpolation = 1 / options.nameColourInterpolation;

var bot = new Discord.Client();

setInterval(function() {
    if (afgdRole) {
        bot.updateRole(afgdRole, {
            color: colours[coloursIndex]
        });
        coloursIndex++;
        if (coloursIndex >= colours.length) coloursIndex = 0;
    }
}, options.nameColourSpeed)

bot.on("message", function(msg) {

    if (!afgdRole) {
        console.log("for");
        while (i < 1) {
            i = i + interpolation;
            console.log("for'd " + i + " " + interpolation);
            colours.push(Number("0x" + RGBToHex(HSVtoRGB(i, 1, 1).r, HSVtoRGB(i, 1, 1).g, HSVtoRGB(i, 1, 1).b)));
        } 
        var roles = msg.channel.server.rolesOfUser(bot.user).filter(function(role) {
            return role.name === "AFGD";
        });
        afgdRole = roles[0];
    }
});

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

RGBToHex = function(r,g,b){
    var bin = r << 16 | g << 8 | b;
    return (function(h){
        return new Array(7-h.length).join("0")+h
    })(bin.toString(16).toUpperCase())
}

bot.loginWithToken(auth.token);