/**
 *Copyright 2014 Yemasthui
 *Modifications (including forks) of the code to fit personal needs are allowed only for personal use and should refer back to the original source.
 *This software is not for profit, any extension, or unauthorised person providing this software is not authorised to be in a position of any monetary gain from this use of this software. Any and all money gained under the use of the software (which includes donations) must be passed on to the original author.
 */


(function () {

    var kill = function () {
        clearInterval(basicBot.room.autodisableInterval);
        clearInterval(basicBot.room.afkInterval);
        basicBot.status = false;
    };

    var storeToStorage = function () {
        localStorage.setItem("basicBotsettings", JSON.stringify(basicBot.settings));
        localStorage.setItem("basicBotRoom", JSON.stringify(basicBot.room));
        var basicBotStorageInfo = {
            time: Date.now(),
            stored: true,
            version: basicBot.version
        };
        localStorage.setItem("basicBotStorageInfo", JSON.stringify(basicBotStorageInfo));

    };

    var subChat = function(chat, obj){
        var lit = '%%';
        for(var prop in obj){
            chat = chat.replace(lit + prop.toUpperCase() + lit, obj[prop]);
        }
        return chat;
    };

    var loadChat = function(cb){
        if(!cb) cb = function(){};
        $.get("https://rawgit.com/Yemasthui/basicBot/master/lang/langIndex.json", function(json){
            var link = basicBot.chatLink;
            if(json !== null && typeof json !== "undefined"){
                langIndex = json;
                link = langIndex[basicBot.settings.language.toLowerCase()];
                if(basicBot.settings.chatLink !== basicBot.chatLink){
                    link = basicBot.settings.chatLink;
                }
                else{
                    if(typeof link === "undefined"){
                        link = basicBot.chatLink;
                    }
                }
                $.get(link, function (json) {
                    if (json !== null && typeof json !== "undefined") {
                        basicBot.chat = json;
                        cb();
                    }
                });
            }
            else{
                $.get(basicBot.chatLink, function (json) {
                    if (json !== null && typeof json !== "undefined") {
                        basicBot.chat = json;
                        cb();
                    }
                });
            }
        });
    };

    var retrieveSettings = function(){
        var settings = JSON.parse(localStorage.getItem("basicBotsettings"));
        if(settings !== null){
            for (var prop in settings) {
                basicBot.settings[prop] = settings[prop];
            }
        }
    };

    var retrieveFromStorage = function () {
        var info = localStorage.getItem("basicBotStorageInfo");
        if (info === null) API.chatLog(basicBot.chat.nodatafound);
        else {
            var settings = JSON.parse(localStorage.getItem("basicBotsettings"));
            var room = JSON.parse(localStorage.getItem("basicBotRoom"));
            var elapsed = Date.now() - JSON.parse(info).time;
            if ((elapsed < 1 * 60 * 60 * 1000)) {
                API.chatLog(basicBot.chat.retrievingdata);
                for (var prop in settings) {
                    basicBot.settings[prop] = settings[prop];
                }
                basicBot.room.users = room.users;
                basicBot.room.afkList = room.afkList;
                basicBot.room.historyList = room.historyList;
                basicBot.room.mutedUsers = room.mutedUsers;
                basicBot.room.autoskip = room.autoskip;
                basicBot.room.roomstats = room.roomstats;
                basicBot.room.messages = room.messages;
                basicBot.room.queue = room.queue;
                API.chatLog(basicBot.chat.datarestored);
            }
        }
        var json_sett = null;
        var roominfo = document.getElementById("room-info");
        info = roominfo.textContent;
        var ref_bot = "@basicBot=";
        var ind_ref = info.indexOf(ref_bot);
        if (ind_ref > 0) {
            var link = info.substring(ind_ref + ref_bot.length, info.length);
            var ind_space = null;
            if (link.indexOf(" ") < link.indexOf("\n")) ind_space = link.indexOf(" ");
            else ind_space = link.indexOf("\n");
            link = link.substring(0, ind_space);
            $.get(link, function (json) {
                if (json !== null && typeof json !== "undefined") {
                    json_sett = JSON.parse(json);
                    for (var prop in json_sett) {
                        basicBot.settings[prop] = json_sett[prop];
                    }
                }
            });
        }

    };

    var botCreator = "Matthew aka. Yemasthui . Edited by : Mr. Frosty TheBass";
    var botCreatorIDs = " [3930014] [3998944] ";

    var basicBot = {
        version: "2.5.1",
        status: false,
        name: "NEW SuperBot",
        loggedInID: null,
        scriptLink: "https://raw.githubusercontent.com/FrostyTheBass/NewSuperBot/master/NEWSuperBot.js",
        cmdLink: "http://git.io/245Ppg",
        chatLink: "https://raw.githubusercontent.com/FrostyTheBass/NewSuperBot/master/pt.json",
        chat: null,
        loadChat: loadChat,
        retrieveSettings: retrieveSettings,
        settings: {
            botName: "NEW SuperBot",
            language: "portuguese",
            chatLink: "https://raw.githubusercontent.com/FrostyTheBass/NewSuperBot/master/pt.json",
            maximumAfk: 120,
            afkRemoval: false,
            maximumDc: 120,
            bouncerPlus: true,
            lockdownEnabled: false,
            lockGuard: true,
            maximumLocktime: 5,
            cycleGuard: false,
            maximumCycletime: 10,
            timeGuard: true,
            maximumSongLength: 7,
            autodisable: true,
            commandCooldown: 30,
            usercommandsEnabled: true,
            lockskipPosition: 1,
            lockskipReasons: [ ["tema", "Esta música não entra nos temas da sala. "], 
                    ["op", "Esta Musica esta na lista OP. "], 
                    ["history", "Esta música esta no historico. "], 
                    ["mix", "You played a mix, which is against the rules. "], 
                    ["sound", "A música que você tocou tem má qualidade de som ou não tem som. "],
                    ["nsfw", "The song you contained was NSFW (image or sound). "], 
                    ["unavailable", "A música que você tocou, não está disponivel para algumas pessoas. "] 
                ],
            afkpositionCheck: 15,
            afkRankCheck: "ambassador",
            motdEnabled: false,
            motdInterval: 5,
            motd: "Vote para não ser removido :v: ",
            filterChat: false,
            etaRestriction: false,
            welcome: true,
            opLink: null,
            rulesLink: null,
            themeLink: null,
            fbLink: "https://www.facebook.com/hue.tiofrosty" ,
            youtubeLink: "https://www.youtube.com/user/MrFrostyTheBass" ,
            website: null,
            intervalMessages: [],
            messageInterval: 5,
            songstats: true,
            commandLiteral: "!"
        },
        room: {
            users: [],
            afkList: [],
            mutedUsers: [],
            bannedUsers: [],
            skippable: true,
            usercommand: true,
            allcommand: true,
            afkInterval: null,
            autoskip: false,
            autoskipTimer: null,
            autodisableInterval: null,
            autodisableFunc: function () {
                if (basicBot.status && basicBot.settings.autodisable) {
                    API.sendChat('!afkdisable');
                    API.sendChat('!joindisable');
                }
            },
            queueing: 0,
            queueable: true,
            currentDJID: null,
            historyList: [],
            cycleTimer: setTimeout(function () {
            }, 1),
            roomstats: {
                accountName: null,
                totalWoots: 0,
                totalCurates: 0,
                totalMehs: 0,
                launchTime: null,
                songCount: 0,
                chatmessages: 0
            },
            messages: {
                from: [],
                to: [],
                message: []
            },
            queue: {
                id: [],
                position: []
            },
            roulette: {
                rouletteStatus: false,
                participants: [],
                countdown: null,
                startRoulette: function () {
                    basicBot.room.roulette.rouletteStatus = true;
                    basicBot.room.roulette.countdown = setTimeout(function () {
                        basicBot.room.roulette.endRoulette();
                    }, 60 * 1000);
                    API.sendChat(basicBot.chat.isopen);
                },
                endRoulette: function () {
                    basicBot.room.roulette.rouletteStatus = false;
                    var ind = Math.floor(Math.random() * basicBot.room.roulette.participants.length);
                    var winner = basicBot.room.roulette.participants[ind];
                    basicBot.room.roulette.participants = [];
                    var pos = Math.floor((Math.random() * API.getWaitList().length) + 1);
                    var user = basicBot.userUtilities.lookupUser(winner);
                    var name = user.username;
                    API.sendChat(subChat(basicBot.chat.winnerpicked, {name: name, position: pos}));
                    setTimeout(function (winner, pos) {
                        basicBot.userUtilities.moveUser(winner, pos, false);
                    }, 1 * 1000, winner, pos);
                }
            }
        },
        User: function (id, name) {
            this.id = id;
            this.username = name;
            this.jointime = Date.now();
            this.lastActivity = Date.now();
            this.votes = {
                woot: 0,
                meh: 0,
                curate: 0
            };
            this.lastEta = null;
            this.afkWarningCount = 0;
            this.afkCountdown = null;
            this.inRoom = true;
            this.isMuted = false;
            this.lastDC = {
                time: null,
                position: null,
                songCount: 0
            };
            this.lastKnownPosition = null;
        },
        userUtilities: {
            getJointime: function (user) {
                return user.jointime;
            },
            getUser: function (user) {
                return API.getUser(user.id);
            },
            updatePosition: function (user, newPos) {
                user.lastKnownPosition = newPos;
            },
            updateDC: function (user) {
                user.lastDC.time = Date.now();
                user.lastDC.position = user.lastKnownPosition;
                user.lastDC.songCount = basicBot.room.roomstats.songCount;
            },
            setLastActivity: function (user) {
                user.lastActivity = Date.now();
                user.afkWarningCount = 0;
                clearTimeout(user.afkCountdown);
            },
            getLastActivity: function (user) {
                return user.lastActivity;
            },
            getWarningCount: function (user) {
                return user.afkWarningCount;
            },
            setWarningCount: function (user, value) {
                user.afkWarningCount = value;
            },
            lookupUser: function (id) {
                for (var i = 0; i < basicBot.room.users.length; i++) {
                    if (basicBot.room.users[i].id === id) {
                        return basicBot.room.users[i];
                    }
                }
                return false;
            },
            lookupUserName: function (name) {
                for (var i = 0; i < basicBot.room.users.length; i++) {
                    var match = basicBot.room.users[i].username.trim() == name.trim();
                    if (match) {
                        return basicBot.room.users[i];
                    }
                }
                return false;
            },
            voteRatio: function (id) {
                var user = basicBot.userUtilities.lookupUser(id);
                var votes = user.votes;
                if (votes.meh === 0) votes.ratio = 1;
                else votes.ratio = (votes.woot / votes.meh).toFixed(2);
                return votes;

            },
            getPermission: function (obj) { //1 requests
                var u;
                if (typeof obj === "object") u = obj;
                else u = API.getUser(obj);
                if(botCreatorIDs.indexOf(u.id) > -1) return 10;
                if (u.gRole < 2) return u.role;
                else {
                    switch (u.gRole) {
                        case 'Mr. Frosty TheBass':
                            return 7;
                        case 3:
                            return 8;
                        case 4:
                            return 9;
                        case 5:
                            return 10;
                    }
                }
                return 0;
            },
            moveUser: function (id, pos, priority) {
                var user = basicBot.userUtilities.lookupUser(id);
                var wlist = API.getWaitList();
                if (API.getWaitListPosition(id) === -1) {
                    if (wlist.length < 50) {
                        API.moderateAddDJ(id);
                        if (pos !== 0) setTimeout(function (id, pos) {
                            API.moderateMoveDJ(id, pos);
                        }, 1250, id, pos);
                    }
                    else {
                        var alreadyQueued = -1;
                        for (var i = 0; i < basicBot.room.queue.id.length; i++) {
                            if (basicBot.room.queue.id[i] === id) alreadyQueued = i;
                        }
                        if (alreadyQueued !== -1) {
                            basicBot.room.queue.position[alreadyQueued] = pos;
                            return API.sendChat(subChat(basicBot.chat.alreadyadding, {position: basicBot.room.queue.position[alreadyQueued]}));
                        }
                        basicBot.roomUtilities.booth.lockBooth();
                        if (priority) {
                            basicBot.room.queue.id.unshift(id);
                            basicBot.room.queue.position.unshift(pos);
                        }
                        else {
                            basicBot.room.queue.id.push(id);
                            basicBot.room.queue.position.push(pos);
                        }
                        var name = user.username;
                        return API.sendChat(subChat(basicBot.chat.adding, {name: name, position: basicBot.room.queue.position.length}));
                    }
                }
                else API.moderateMoveDJ(id, pos);
            },
            dclookup: function (id) {
                var user = basicBot.userUtilities.lookupUser(id);
                if (typeof user === 'boolean') return basicBot.chat.usernotfound;
                var name = user.username;
                if (user.lastDC.time === null) return subChat(basicBot.chat.notdisconnected, {name: name});
                var dc = user.lastDC.time;
                var pos = user.lastDC.position;
                if (pos === null) return basicBot.chat.noposition;
                var timeDc = Date.now() - dc;
                var validDC = false;
                if (basicBot.settings.maximumDc * 60 * 1000 > timeDc) {
                    validDC = true;
                }
                var time = basicBot.roomUtilities.msToStr(timeDc);
                if (!validDC) return (subChat(basicBot.chat.toolongago, {name: basicBot.userUtilities.getUser(user).username, time: time}));
                var songsPassed = basicBot.room.roomstats.songCount - user.lastDC.songCount;
                var afksRemoved = 0;
                var afkList = basicBot.room.afkList;
                for (var i = 0; i < afkList.length; i++) {
                    var timeAfk = afkList[i][1];
                    var posAfk = afkList[i][2];
                    if (dc < timeAfk && posAfk < pos) {
                        afksRemoved++;
                    }
                }
                var newPosition = user.lastDC.position - songsPassed - afksRemoved;
                if (newPosition <= 0) newPosition = 1;
                var msg = subChat(basicBot.chat.valid, {name: basicBot.userUtilities.getUser(user).username, time: time, position: newPosition});
                basicBot.userUtilities.moveUser(user.id, newPosition, true);
                return msg;
            }
        },

        roomUtilities: {
            rankToNumber: function (rankString) {
                var rankInt = null;
                switch (rankString) {
                    case "admin":
                        rankInt = 10;
                        break;
                    case "ambassador":
                        rankInt = 7;
                        break;
                    case "host":
                        rankInt = 5;
                        break;
                    case "cohost":
                        rankInt = 4;
                        break;
                    case "manager":
                        rankInt = 3;
                        break;
                    case "bouncer":
                        rankInt = 2;
                        break;
                    case "residentdj":
                        rankInt = 1;
                        break;
                    case "user":
                        rankInt = 0;
                        break;
                }
                return rankInt;
            },
            msToStr: function (msTime) {
                var ms, msg, timeAway;
                msg = '';
                timeAway = {
                    'days': 0,
                    'hours': 0,
                    'minutes': 0,
                    'seconds': 0
                };
                ms = {
                    'day': 24 * 60 * 60 * 1000,
                    'hour': 60 * 60 * 1000,
                    'minute': 60 * 1000,
                    'second': 1000
                };
                if (msTime > ms.day) {
                    timeAway.days = Math.floor(msTime / ms.day);
                    msTime = msTime % ms.day;
                }
                if (msTime > ms.hour) {
                    timeAway.hours = Math.floor(msTime / ms.hour);
                    msTime = msTime % ms.hour;
                }
                if (msTime > ms.minute) {
                    timeAway.minutes = Math.floor(msTime / ms.minute);
                    msTime = msTime % ms.minute;
                }
                if (msTime > ms.second) {
                    timeAway.seconds = Math.floor(msTime / ms.second);
                }
                if (timeAway.days !== 0) {
                    msg += timeAway.days.toString() + 'd';
                }
                if (timeAway.hours !== 0) {
                    msg += timeAway.hours.toString() + 'h';
                }
                if (timeAway.minutes !== 0) {
                    msg += timeAway.minutes.toString() + 'm';
                }
                if (timeAway.minutes < 1 && timeAway.hours < 1 && timeAway.days < 1) {
                    msg += timeAway.seconds.toString() + 's';
                }
                if (msg !== '') {
                    return msg;
                } else {
                    return false;
                }
            },
            booth: {
                lockTimer: setTimeout(function () {
                }, 1000),
                locked: false,
                lockBooth: function () {
                    API.moderateLockWaitList(!basicBot.roomUtilities.booth.locked);
                    basicBot.roomUtilities.booth.locked = false;
                    if (basicBot.settings.lockGuard) {
                        basicBot.roomUtilities.booth.lockTimer = setTimeout(function () {
                            API.moderateLockWaitList(basicBot.roomUtilities.booth.locked);
                        }, basicBot.settings.maximumLocktime * 60 * 1000);
                    }
                },
                unlockBooth: function () {
                    API.moderateLockWaitList(basicBot.roomUtilities.booth.locked);
                    clearTimeout(basicBot.roomUtilities.booth.lockTimer);
                }
            },
            afkCheck: function () {
                if (!basicBot.status || !basicBot.settings.afkRemoval) return void (0);
                var rank = basicBot.roomUtilities.rankToNumber(basicBot.settings.afkRankCheck);
                var djlist = API.getWaitList();
                var lastPos = Math.min(djlist.length, basicBot.settings.afkpositionCheck);
                if (lastPos - 1 > djlist.length) return void (0);
                for (var i = 0; i < lastPos; i++) {
                    if (typeof djlist[i] !== 'undefined') {
                        var id = djlist[i].id;
                        var user = basicBot.userUtilities.lookupUser(id);
                        if (typeof user !== 'boolean') {
                            var plugUser = basicBot.userUtilities.getUser(user);
                            if (rank !== null && basicBot.userUtilities.getPermission(plugUser) <= rank) {
                                var name = plugUser.username;
                                var lastActive = basicBot.userUtilities.getLastActivity(user);
                                var inactivity = Date.now() - lastActive;
                                var time = basicBot.roomUtilities.msToStr(inactivity);
                                var warncount = user.afkWarningCount;
                                if (inactivity > basicBot.settings.maximumAfk * 60 * 1000) {
                                    if (warncount === 0) {
                                        API.sendChat(subChat(basicBot.chat.warning1, {name: name, time: time}));
                                        user.afkWarningCount = 3;
                                        user.afkCountdown = setTimeout(function (userToChange) {
                                            userToChange.afkWarningCount = 1;
                                        }, 90 * 1000, user);
                                    }
                                    else if (warncount === 1) {
                                        API.sendChat(subChat(basicBot.chat.warning2, {name: name}));
                                        user.afkWarningCount = 3;
                                        user.afkCountdown = setTimeout(function (userToChange) {
                                            userToChange.afkWarningCount = 2;
                                        }, 30 * 1000, user);
                                    }
                                    else if (warncount === 2) {
                                        var pos = API.getWaitListPosition(id);
                                        if (pos !== -1) {
                                            pos++;
                                            basicBot.room.afkList.push([id, Date.now(), pos]);
                                            user.lastDC = {

                                                time: null,
                                                position: null,
                                                songCount: 0
                                            };
                                            API.moderateRemoveDJ(id);
                                            API.sendChat(subChat(basicBot.chat.afkremove, {name: name, time: time, position: pos, maximumafk: basicBot.settings.maximumAfk}));
                                        }
                                        user.afkWarningCount = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            changeDJCycle: function () {
                var toggle = $(".cycle-toggle");
                if (toggle.hasClass("disabled")) {
                    toggle.click();
                    if (basicBot.settings.cycleGuard) {
                        basicBot.room.cycleTimer = setTimeout(function () {
                            if (toggle.hasClass("enabled")) toggle.click();
                        }, basicBot.settings.cycleMaxTime * 60 * 1000);
                    }
                }
                else {
                    toggle.click();
                    clearTimeout(basicBot.room.cycleTimer);
                }
            },
            intervalMessage: function () {
                var interval;
                if (basicBot.settings.motdEnabled) interval = basicBot.settings.motdInterval;
                else interval = basicBot.settings.messageInterval;
                if ((basicBot.room.roomstats.songCount % interval) === 0 && basicBot.status) {
                    var msg;
                    if (basicBot.settings.motdEnabled) {
                        msg = basicBot.settings.motd;
                    }
                    else {
                        if (basicBot.settings.intervalMessages.length === 0) return void (0);
                        var messageNumber = basicBot.room.roomstats.songCount % basicBot.settings.intervalMessages.length;
                        msg = basicBot.settings.intervalMessages[messageNumber];
                    }
                    API.sendChat('/me ' + msg);
                }
            }
        },
        eventChat: function (chat) {
            chat.message = chat.message.trim();
            for (var i = 0; i < basicBot.room.users.length; i++) {
                if (basicBot.room.users[i].id === chat.uid) {
                    basicBot.userUtilities.setLastActivity(basicBot.room.users[i]);
                    if (basicBot.room.users[i].username !== chat.un) {
                        basicBot.room.users[i].username = chat.un;
                    }
                }
            }
            if (basicBot.chatUtilities.chatFilter(chat)) return void (0);
            if (!basicBot.chatUtilities.commandCheck(chat))
                basicBot.chatUtilities.action(chat);
        },
        eventUserjoin: function (user) {
            var known = false;
            var index = null;
            for (var i = 0; i < basicBot.room.users.length; i++) {
                if (basicBot.room.users[i].id === user.id) {
                    known = true;
                    index = i;
                }
            }
            var greet = true;
            var welcomeback = null;
            if (known) {
                basicBot.room.users[index].inRoom = true;
                var u = basicBot.userUtilities.lookupUser(user.id);
                var jt = u.jointime;
                var t = Date.now() - jt;
                if (t < 10 * 1000) greet = false;
                else welcomeback = true;
            }
            else {
                basicBot.room.users.push(new basicBot.User(user.id, user.username));
                welcomeback = false;
            }
            for (var j = 0; j < basicBot.room.users.length; j++) {
                if (basicBot.userUtilities.getUser(basicBot.room.users[j]).id === user.id) {
                    basicBot.userUtilities.setLastActivity(basicBot.room.users[j]);
                    basicBot.room.users[j].jointime = Date.now();
                }

            }
            if (basicBot.settings.welcome && greet) {
                welcomeback ?
                    setTimeout(function (user) {
                        API.sendChat(subChat(basicBot.chat.welcomeback, {name: user.username}));
                    }, 1 * 1000, user)
                :
                    setTimeout(function (user) {
                        API.sendChat(subChat(basicBot.chat.welcome, {name: user.username}));
                    }, 1 * 1000, user);
            }
        },
        eventUserleave: function (user) {
            for (var i = 0; i < basicBot.room.users.length; i++) {
                if (basicBot.room.users[i].id === user.id) {
                    basicBot.userUtilities.updateDC(basicBot.room.users[i]);
                    basicBot.room.users[i].inRoom = false;
                }
            }
        },
        eventVoteupdate: function (obj) {
            for (var i = 0; i < basicBot.room.users.length; i++) {
                if (basicBot.room.users[i].id === obj.user.id) {
                    if (obj.vote === 1) {
                        basicBot.room.users[i].votes.woot++;
                    }
                    else {
                        basicBot.room.users[i].votes.meh++;
                    }
                }
            }
        },
        eventCurateupdate: function (obj) {
            for (var i = 0; i < basicBot.room.users.length; i++) {
                if (basicBot.room.users[i].id === obj.user.id) {
                    basicBot.room.users[i].votes.curate++;
                }
            }
        },
        eventDjadvance: function (obj) {
            var lastplay = obj.lastPlay;
            if (typeof lastplay === 'undefined') return void (0);
            if (basicBot.settings.songstats) API.sendChat("/me " + lastplay.media.author + " - " + lastplay.media.title + ": " + lastplay.score.positive + "W/" + lastplay.score.grabs + "G/" + lastplay.score.negative + "M.")
            basicBot.room.roomstats.totalWoots += lastplay.score.positive;
            basicBot.room.roomstats.totalMehs += lastplay.score.negative;
            basicBot.room.roomstats.totalCurates += lastplay.score.grabs;
            basicBot.room.roomstats.songCount++;
            basicBot.roomUtilities.intervalMessage();
            basicBot.room.currentDJID = obj.dj.id;
            var alreadyPlayed = false;
            for (var i = 0; i < basicBot.room.historyList.length; i++) {
                if (basicBot.room.historyList[i][0] === obj.media.cid) {
                    var firstPlayed = basicBot.room.historyList[i][1];
                    var plays = basicBot.room.historyList[i].length - 1;
                    var lastPlayed = basicBot.room.historyList[i][plays];
                    API.sendChat(subChat(basicBot.chat.songknown, {plays: plays, timetotal: basicBot.roomUtilities.msToStr(Date.now() - firstPlayed), lasttime: basicBot.roomUtilities.msToStr(Date.now() - lastPlayed)}));
                    basicBot.room.historyList[i].push(+new Date());
                    alreadyPlayed = true;
                }
            }
            if (!alreadyPlayed) {
                basicBot.room.historyList.push([obj.media.cid, +new Date()]);
            }
            var newMedia = obj.media;
            if (basicBot.settings.timeGuard && newMedia.duration > basicBot.settings.maximumSongLength * 60 && !basicBot.room.roomevent) {
                var name = obj.dj.username;
                API.sendChat(subChat(chat.timelimit, {name: name, maxlength: basicBot.settings.maximumSongLength}));
                API.moderateForceSkip();
            }
            var user = basicBot.userUtilities.lookupUser(obj.dj.id);
            if (user.ownSong) {
                API.sendChat(subChat(basicBot.chat.permissionownsong, {name: user.username}));
                user.ownSong = false;
            }
            user.lastDC = {
                time: null,
                position: null,
                songCount: 0
            };
            clearTimeout(basicBot.room.autoskipTimer);
            if (basicBot.room.autoskip) {
                var remaining = media.duration * 1000;
                basicBot.room.autoskipTimer = setTimeout(function () {
                    API.moderateForceSkip();
                }, remaining - 500);
            }
            storeToStorage();

        },
        eventWaitlistupdate: function (users) {
            if (users.length < 50) {
                if (basicBot.room.queue.id.length > 0 && basicBot.room.queueable) {
                    basicBot.room.queueable = false;
                    setTimeout(function () {
                        basicBot.room.queueable = true;
                    }, 500);
                    basicBot.room.queueing++;
                    var id, pos;
                    setTimeout(
                        function () {
                            id = basicBot.room.queue.id.splice(0, 1)[0];
                            pos = basicBot.room.queue.position.splice(0, 1)[0];
                            API.moderateAddDJ(id, pos);
                            setTimeout(
                                function (id, pos) {
                                    API.moderateMoveDJ(id, pos);
                                    basicBot.room.queueing--;
                                    if (basicBot.room.queue.id.length === 0) setTimeout(function () {
                                        basicBot.roomUtilities.booth.unlockBooth();
                                    }, 1000);
                                }, 1000, id, pos);
                        }, 1000 + basicBot.room.queueing * 2500);
                }
            }
            for (var i = 0; i < users.length; i++) {
                var user = basicBot.userUtilities.lookupUser(users[i].id);
                basicBot.userUtilities.updatePosition(user, API.getWaitListPosition(users[i].id) + 1);
            }
        },
        chatcleaner: function (chat) {
            if (!basicBot.settings.filterChat) return false;
            if (basicBot.userUtilities.getPermission(chat.uid) > 1) return false;
            var msg = chat.message;
            var containsLetters = false;
            for (var i = 0; i < msg.length; i++) {
                ch = msg.charAt(i);
                if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === ':' || ch === '^') containsLetters = true;
            }
            if (msg === '') {
                return true;
            }
            if (!containsLetters && (msg.length === 1 || msg.length > 3)) return true;
            msg = msg.replace(/[ ,;.:\/=~+%^*\-\\"'&@#]/g, '');
            var capitals = 0;
            var ch;
            for (var i = 0; i < msg.length; i++) {
                ch = msg.charAt(i);
                if (ch >= 'A' && ch <= 'Z') capitals++;
            }
            if (capitals >= 40) {
                API.sendChat(subChat(basicBot.chat.caps, {name: chat.un}));
                return true;
            }
            msg = msg.toLowerCase();
            if (msg === 'skip') {
                API.sendChat(subChat(basicBot.chat.askskip, {name: chat.un}));
                return true;
            }
            for (var j = 0; j < basicBot.chatUtilities.spam.length; j++) {
                if (msg === basicBot.chatUtilities.spam[j]) {
                    API.sendChat(subChat(basicBot.chat.spam, {name: chat.un}));
                    return true;
                }
            }
            return false;
        },
        chatUtilities: {
            chatFilter: function (chat) {
                var msg = chat.message;
                var perm = basicBot.userUtilities.getPermission(chat.uid);
                var user = basicBot.userUtilities.lookupUser(chat.uid);
                var isMuted = false;
                for (var i = 0; i < basicBot.room.mutedUsers.length; i++) {
                    if (basicBot.room.mutedUsers[i] === chat.uid) isMuted = true;
                }
                if (isMuted) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                if (basicBot.settings.lockdownEnabled) {
                    if (perm === 0) {
                        API.moderateDeleteChat(chat.cid);
                        return true;
                    }
                }
                if (basicBot.chatcleaner(chat)) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                /**
                var plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                if (plugRoomLinkPatt.exec(msg)) {
                    if (perm === 0) {
                        API.sendChat(subChat(basicBot.chat.roomadvertising, {name: chat.un}));
                        API.moderateDeleteChat(chat.cid);
                        return true;
                    }
                }
                 **/
                if (msg.indexOf('http://adf.ly/') > -1) {
                    API.moderateDeleteChat(chat.cid);
                    API.sendChat(subChat(basicBot.chat.adfly, {name: chat.un}));
                    return true;
                }
                if (msg.indexOf('autojoin was not enabled') > 0 || msg.indexOf('AFK message was not enabled') > 0 || msg.indexOf('!afkdisable') > 0 || msg.indexOf('!joindisable') > 0 || msg.indexOf('autojoin disabled') > 0 || msg.indexOf('AFK message disabled') > 0) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                var joinedroulette = basicBot.chat.roulettejoin.split('%%NAME%%');
                if(joinedroulette[1].length > joinedroulette[0].length) joinedroulette = joinedroulette[1];
                else joinedroulette = joinedroulette[0];

                var leftroulette = basicBot.chat.rouletteleave.split('%%NAME%%');
                if(leftroulette[1].length > leftroulette[0].length) leftroulette = leftroulette[1];
                else leftroulette = leftroulette[0];

                if ((msg.indexOf(joinedroulette) > -1 || msg.indexOf(leftroulette) > -1) && chat.uid === basicBot.loggedInID) {
                    setTimeout(function (id) {
                        API.moderateDeleteChat(id);
                    }, 2 * 1000, chat.cid);
                    return true;
                }
                return false;
            },
            commandCheck: function (chat) {
                var cmd;
                if (chat.message.charAt(0) === '!') {
                    var space = chat.message.indexOf(' ');
                    if (space === -1) {
                        cmd = chat.message;
                    }
                    else cmd = chat.message.substring(0, space);
                }
                else return false;
                var userPerm = basicBot.userUtilities.getPermission(chat.uid);
                //console.log("name: " + chat.un + ", perm: " + userPerm);
                if (chat.message !== "!join" && chat.message !== "!leave") {
                    if (userPerm === 0 && !basicBot.room.usercommand) return void (0);
                    if (!basicBot.room.allcommand) return void (0);
                }
                if (chat.message === '!eta' && basicBot.settings.etaRestriction) {
                    if (userPerm < 2) {
                        var u = basicBot.userUtilities.lookupUser(chat.uid);
                        if (u.lastEta !== null && (Date.now() - u.lastEta) < 1 * 60 * 60 * 1000) {
                            API.moderateDeleteChat(chat.cid);
                            return void (0);
                        }
                        else u.lastEta = Date.now();
                    }
                }
                var executed = false;

                for (var comm in basicBot.commands) {
                    var cmdCall = basicBot.commands[comm].command;
                    if(!Array.isArray(cmdCall)){cmdCall = [cmdCall]}
                    for(var i = 0; i < cmdCall.length; i++){
                        if (basicBot.settings.commandLiteral + cmdCall[i] === cmd) {
                            basicBot.commands[comm].functionality(chat, basicBot.settings.commandLiteral + cmdCall[i]);
                            executed = true;
                            break;
                        }
                    }
                }

                if (executed && userPerm === 0) {
                    basicBot.room.usercommand = false;
                    setTimeout(function () {
                        basicBot.room.usercommand = true;
                    }, basicBot.settings.commandCooldown * 1000);
                }
                if (executed) {
                    API.moderateDeleteChat(chat.cid);
                    basicBot.room.allcommand = false;
                    setTimeout(function () {
                        basicBot.room.allcommand = true;
                    }, 5 * 1000);
                }
                return executed;
            },
            action: function (chat) {
                var user = basicBot.userUtilities.lookupUser(chat.uid);
                if (chat.type === 'message') {
                    for (var j = 0; j < basicBot.room.users.length; j++) {
                        if (basicBot.userUtilities.getUser(basicBot.room.users[j]).id === chat.uid) {
                            basicBot.userUtilities.setLastActivity(basicBot.room.users[j]);
                        }

                    }
                }
                basicBot.room.roomstats.chatmessages++;
            },
            spam: [
                'hueh', 'hu3', 'brbr', 'heu', 'brbr', 'kkkk', 'spoder', 'mafia', 'zuera', 'zueira',
                'zueria', 'aehoo', 'aheu', 'alguem', 'algum', 'brazil', 'zoeira', 'fuckadmins', 'affff', 'vaisefoder', 'huenaarea',
                'hitler', 'ashua', 'ahsu', 'ashau', 'lulz', 'huehue', 'hue', 'huehuehue', 'merda', 'pqp', 'puta', 'mulher', 'pula', 'retarda', 'caralho', 'filha', 'ppk',
                'gringo', 'fuder', 'foder', 'hua', 'ahue', 'modafuka', 'modafoka', 'mudafuka', 'mudafoka', 'ooooooooooooooo', 'foda'
            ],
            curses: [
                'nigger', 'faggot', 'nigga', 'niqqa', 'motherfucker', 'modafocka'
            ]
        },
        connectAPI: function () {
            this.proxy = {
                eventChat: $.proxy(this.eventChat, this),
                eventUserskip: $.proxy(this.eventUserskip, this),
                eventUserjoin: $.proxy(this.eventUserjoin, this),
                eventUserleave: $.proxy(this.eventUserleave, this),
                eventUserfan: $.proxy(this.eventUserfan, this),
                eventFriendjoin: $.proxy(this.eventFriendjoin, this),
                eventFanjoin: $.proxy(this.eventFanjoin, this),
                eventVoteupdate: $.proxy(this.eventVoteupdate, this),
                eventCurateupdate: $.proxy(this.eventCurateupdate, this),
                eventRoomscoreupdate: $.proxy(this.eventRoomscoreupdate, this),
                eventDjadvance: $.proxy(this.eventDjadvance, this),
                eventDjupdate: $.proxy(this.eventDjupdate, this),
                eventWaitlistupdate: $.proxy(this.eventWaitlistupdate, this),
                eventVoteskip: $.proxy(this.eventVoteskip, this),
                eventModskip: $.proxy(this.eventModskip, this),
                eventChatcommand: $.proxy(this.eventChatcommand, this),
                eventHistoryupdate: $.proxy(this.eventHistoryupdate, this)

            };
            API.on(API.CHAT, this.proxy.eventChat);
            API.on(API.USER_SKIP, this.proxy.eventUserskip);
            API.on(API.USER_JOIN, this.proxy.eventUserjoin);
            API.on(API.USER_LEAVE, this.proxy.eventUserleave);
            API.on(API.USER_FAN, this.proxy.eventUserfan);
            API.on(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
            API.on(API.GRAB_UPDATE, this.proxy.eventCurateupdate);
            API.on(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
            API.on(API.ADVANCE, this.proxy.eventDjadvance);
            API.on(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
            API.on(API.MOD_SKIP, this.proxy.eventModskip);
            API.on(API.CHAT_COMMAND, this.proxy.eventChatcommand);
            API.on(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        disconnectAPI: function () {
            API.off(API.CHAT, this.proxy.eventChat);
            API.off(API.USER_SKIP, this.proxy.eventUserskip);
            API.off(API.USER_JOIN, this.proxy.eventUserjoin);
            API.off(API.USER_LEAVE, this.proxy.eventUserleave);
            API.off(API.USER_FAN, this.proxy.eventUserfan);
            API.off(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
            API.off(API.CURATE_UPDATE, this.proxy.eventCurateupdate);
            API.off(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
            API.off(API.ADVANCE, this.proxy.eventDjadvance);
            API.off(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
            API.off(API.MOD_SKIP, this.proxy.eventModskip);
            API.off(API.CHAT_COMMAND, this.proxy.eventChatcommand);
            API.off(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        startup: function () {
            var u = API.getUser();
            if (basicBot.userUtilities.getPermission(u) < 2) return API.chatLog(basicBot.chat.greyuser);
            if (basicBot.userUtilities.getPermission(u) === 2) API.chatLog(basicBot.chat.bouncer);
            basicBot.connectAPI();
            retrieveSettings();
            retrieveFromStorage();
            if (basicBot.room.roomstats.launchTime === null) {
                basicBot.room.roomstats.launchTime = Date.now();
            }

            for (var j = 0; j < basicBot.room.users.length; j++) {
                basicBot.room.users[j].inRoom = false;
            }
            var userlist = API.getUsers();
            for (var i = 0; i < userlist.length; i++) {
                var known = false;
                var ind = null;
                for (var j = 0; j < basicBot.room.users.length; j++) {
                    if (basicBot.room.users[j].id === userlist[i].id) {
                        known = true;
                        ind = j;
                    }
                }
                if (known) {
                    basicBot.room.users[ind].inRoom = true;
                }
                else {
                    basicBot.room.users.push(new basicBot.User(userlist[i].id, userlist[i].username));
                    ind = basicBot.room.users.length - 1;
                }
                var wlIndex = API.getWaitListPosition(basicBot.room.users[ind].id) + 1;
                basicBot.userUtilities.updatePosition(basicBot.room.users[ind], wlIndex);
            }
            basicBot.room.afkInterval = setInterval(function () {
                basicBot.roomUtilities.afkCheck()
            }, 10 * 1000);
            basicBot.room.autodisableInterval = setInterval(function () {
                basicBot.room.autodisableFunc();
            }, 60 * 60 * 1000);
            basicBot.loggedInID = API.getUser().id;
            basicBot.status = true;
            API.sendChat('/cap 1');
            API.setVolume(0);
            var emojibutton = $(".icon-emoji-on");
            if(emojibutton.length > 0){
                emojibutton[0].click();
            }
            loadChat(API.sendChat(subChat(basicBot.chat.online, {botname: basicBot.settings.botName, version: basicBot.version})));
            window.bot = basicBot;
        },
        commands: {
            executable: function (minRank, chat) {
                var id = chat.uid;
                var perm = basicBot.userUtilities.getPermission(id);
                var minPerm;
                switch (minRank) {
                    case 'admin':
                        minPerm = 10;
                        break;
                    case 'ambassador':
                        minPerm = 7;
                        break;
                    case 'host':
                        minPerm = 5;
                        break;
                    case 'cohost':
                        minPerm = 4;
                        break;
                    case 'manager':
                        minPerm = 3;
                        break;
                    case 'mod':
                        if (basicBot.settings.bouncerPlus) {
                            minPerm = 2;
                        }
                        else {
                            minPerm = 3;
                        }
                        break;
                    case 'bouncer':
                        minPerm = 2;
                        break;
                    case 'residentdj':
                        minPerm = 1;
                        break;
                    case 'user':
                        minPerm = 0;
                        break;
                    default:
                        API.chatLog('error assigning minimum permission');
                }
                return perm >= minPerm;

            },
            /**
             command: {
                        command: 'cmd',
                        rank: 'user/bouncer/mod/manager',
                        type: 'startsWith/exact',
                        functionality: function(chat, cmd){
                                if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                                if( !basicBot.commands.executable(this.rank, chat) ) return void (0);
                                else{
                                
                                }
                        }
                },
             **/

            activeCommand: {
                command: 'active',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var now = Date.now();
                        var chatters = 0;
                        var time;
                        if (msg.length === cmd.length) time = 60;
                        else {
                            time = msg.substring(cmd.length + 1);
                            if (isNaN(time)) return API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                        }
                        for (var i = 0; i < basicBot.room.users.length; i++) {
                            userTime = basicBot.userUtilities.getLastActivity(basicBot.room.users[i]);
                            if ((now - userTime) <= (time * 60 * 1000)) {
                                chatters++;
                            }
                        }
                        API.sendChat(subChat(basicBot.chat.activeusersintime, {name: chat.un, amount: chatters, time: time}));
                    }
                }
            },

            addCommand: {
                command: 'add',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substr(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (msg.length > cmd.length + 2) {
                            if (typeof user !== 'undefined') {
                                if (basicBot.room.roomevent) {
                                    basicBot.room.eventArtists.push(user.id);
                                }
                                API.moderateAddDJ(user.id);
                            } else API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        }
                    }
                }
            },

            afklimitCommand: {
                command: 'afklimit',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nolimitspecified, {name: chat.un}));
                        var limit = msg.substring(cmd.length + 1);
                        if (!isNaN(limit)) {
                            basicBot.settings.maximumAfk = parseInt(limit, 10);
                            API.sendChat(subChat(basicBot.chat.maximumafktimeset, {name: chat.un, time: basicBot.settings.maximumAfk}));
                        }
                        else API.sendChat(subChat(basicBot.chat.invalidlimitspecified, {name: chat.un}));
                    }
                }
            },

            afkremovalCommand: {
                command: 'afkremoval',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.afkRemoval) {
                            basicBot.settings.afkRemoval = !basicBot.settings.afkRemoval;
                            clearInterval(basicBot.room.afkInterval);
                            API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.afkremoval}));
                        }
                        else {
                            basicBot.settings.afkRemoval = !basicBot.settings.afkRemoval;
                            basicBot.room.afkInterval = setInterval(function () {
                                basicBot.roomUtilities.afkCheck()
                            }, 2 * 1000);
                            API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.afkremoval}));
                        }
                    }
                }
            },

            afkresetCommand: {
                command: 'afkreset',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        basicBot.userUtilities.setLastActivity(user);
                        API.sendChat(subChat(basicBot.chat.afkstatusreset, {name: chat.un, username: name}));
                    }
                }
            },

            afktimeCommand: {
                command: 'afktime',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var lastActive = basicBot.userUtilities.getLastActivity(user);
                        var inactivity = Date.now() - lastActive;
                        var time = basicBot.roomUtilities.msToStr(inactivity);
                        API.sendChat(subChat(basicBot.chat.inactivefor, {name: chat.un, username: name, time: time}));
                    }
                }
            },

            autoskipCommand: {
                command: 'autoskip',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.autoskip) {
                            basicBot.settings.autoskip = !basicBot.settings.autoskip;
                            clearTimeout(basicBot.room.autoskipTimer);
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.autoskip}));
                        }
                        else {
                            basicBot.settings.autoskip = !basicBot.settings.autoskip;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.autoskip}));
                        }
                    }
                }
            },

            autowootCommand: {
                command: 'autowoot',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(basicBot.chat.autowoot);
                    }
                }
            },

            baCommand: {
                command: 'ba',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(basicBot.chat.brandambassador);
                    }
                }
            },

            banCommand: {
                command: 'ban',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substr(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        API.moderateBanUser(user.id, 1, API.BAN.DAY);
                    }
                }
            },

            bouncerPlusCommand: {
                command: 'bouncer+',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (basicBot.settings.bouncerPlus) {
                            basicBot.settings.bouncerPlus = false;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': 'Bouncer+'}));
                        }
                        else {
                            if (!basicBot.settings.bouncerPlus) {
                                var id = chat.uid;
                                var perm = basicBot.userUtilities.getPermission(id);
                                if (perm > 2) {
                                    basicBot.settings.bouncerPlus = true;
                                    return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': 'Bouncer+'}));
                                }
                            }
                            else return API.sendChat(subChat(basicBot.chat.bouncerplusrank, {name: chat.un}));
                        }
                    }
                }
            },

            clearchatCommand: {
                command: 'clearchat',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var currentchat = $('#chat-messages').children();
                        for (var i = 0; i < currentchat.length; i++) {
                            for (var j = 0; j < currentchat[i].classList.length; j++) {
                                if (currentchat[i].classList[j].indexOf('cid-') == 0)
                                    API.moderateDeleteChat(currentchat[i].classList[j].substr(4));
                            }
                        }
                        return API.sendChat(subChat(basicBot.chat.chatcleared,{name: chat.un}));
                    }
                }
            },

            commandsCommand: {
                command: 'commands',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(subChat(basicBot.chat.commandslink, {botname: basicBot.settings.botName, link: basicBot.cmdLink}));
                    }
                }
            },

            cookieCommand: {
                command: 'pao',
                rank: 'user',
                type: 'startsWith',
                cookies: ['lhe deu um pão com chocolate!',
                        'lhe deu um pão de aveia caseiro macio!',
                        'lhe deu um simples e seco, pão de idade. Ele foi o último na bolsa. . Gross ',
                        'Dá-lhe um pão com açúcar. O que, sem geada e polvilha? 0/10 não tocaria',
                        'Dá-lhe um pão com chocolate. Oh, espere, não é pão. Bleck!',
                        'Dá-lhe um enorme pão. Picar que lhe dá mais. Estranho.',
                        'Dá-lhe um pão da sorte. Lê-se "Por que você não esta trabalhando em algum projeto?',
                        'Dá-lhe um pão da sorte. Lê-se "Dê aquela pessoa especial um elogio" ',
                        'Dá-lhe um pão da sorte. Lê "Tome um risco!',
                        'Dá-lhe um pão da sorte. Lê "Vá para fora" ',
                        'Dá-lhe um pão da sorte. Lê-se "Não se esqueça de comer seus legumes! ',
                        'Dá-lhe um pão da sorte. Lê "Você levanta mesmo?" ',
                        'Dá-lhe um pão da sorte. Lê "M808 pls" ',
                        'Dá-lhe um pão da sorte. Lê "Se você mover os quadris, você vai obter todas as senhoras." ',
                        'Dá-lhe um pão da sorte. Lê o "eu te amo". ',
                        'Dá-lhe um pão de Ouro. Você pode não comer, porque ela é feita de ouro. Droga',
                        'Dá-lhe um pão com um copo de leite! ',
                        'Dá-lhe um pão arco-íris feito com amor: coração:',
                        'Dá-lhe um pão velho que foi deixado de fora na chuva, ele está bolorento.',
                        'Bakes você pão fresco, cheira incrível. '
                ],
                getCookie: function () {
                    var c = Math.floor(Math.random() * this.cookies.length);
                    return this.cookies[c];
                },
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;

                        var space = msg.indexOf(' ');
                        if (space === -1) {
                            API.sendChat(basicBot.chat.eatcookie);
                            return false;
                        }
                        else {
                            var name = msg.substring(space + 2);
                            var user = basicBot.userUtilities.lookupUserName(name);
                            if (user === false || !user.inRoom) {
                                return API.sendChat(subChat(basicBot.chat.nousercookie, {name: name}));
                            }
                            else if (user.username === chat.un) {
                                return API.sendChat(subChat(basicBot.chat.selfcookie, {name: name}));
                            }
                            else {
                                return API.sendChat(subChat(basicBot.chat.cookie, {nameto: user.username, namefrom: chat.un, cookie: this.getCookie()}));
                            }
                        }
                    }
                }
            },

            cycleCommand: {
                command: 'cycle',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.changeDJCycle();
                    }
                }
            },

            cycleguardCommand: {
                command: 'cycleguard',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.cycleGuard) {
                            basicBot.settings.cycleGuard = !basicBot.settings.cycleGuard;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.cycleguard}));
                        }
                        else {
                            basicBot.settings.cycleGuard = !basicBot.settings.cycleGuard;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.cycleguard}));
                        }

                    }
                }
            },

            cycletimerCommand: {
                command: 'cycletimer',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var cycleTime = msg.substring(cmd.length + 1);
                        if (!isNaN(cycleTime)) {
                            basicBot.settings.maximumCycletime = cycleTime;
                            return API.sendChat(subChat(basicBot.chat.cycleguardtime, {name: chat.un, time: basicBot.settings.maximumCycletime}));
                        }
                        else return API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));

                    }
                }
            },

            dclookupCommand: {
                command: ['dclookup','dc'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substring(cmd.length + 2);
                            var perm = basicBot.userUtilities.getPermission(chat.uid);
                            if (perm < 2) return API.sendChat(subChat(basicBot.chat.dclookuprank, {name: chat.un}));
                        }
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var toChat = basicBot.userUtilities.dclookup(user.id);
                        API.sendChat(toChat);
                    }
                }
            },

            emojiCommand: {
                command: 'emoji',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var link = 'http://www.emoji-cheat-sheet.com/';
                        API.sendChat(subChat(basicBot.chat.emojilist, {link: link}));
                    }
                }
            },

            etaCommand: {
                command: 'eta',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var perm = basicBot.userUtilities.getPermission(chat.uid);
                        var msg = chat.message;
                        var name;
                        if (msg.length > cmd.length) {
                            if (perm < 2) return void (0);
                            name = msg.substring(cmd.length + 2);
                        } else name = chat.un;
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var pos = API.getWaitListPosition(user.id);
                        if (pos < 0) return API.sendChat(subChat(basicBot.chat.notinwaitlist, {name: name}));
                        var timeRemaining = API.getTimeRemaining();
                        var estimateMS = ((pos + 1) * 4 * 60 + timeRemaining) * 1000;
                        var estimateString = basicBot.roomUtilities.msToStr(estimateMS);
                        API.sendChat(subChat(basicBot.chat.eta, {name: name, time: estimateString}));
                    }
                }
            },

            fbCommand: {
                command: 'fb',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.fbLink === "string")
                            API.sendChat(subChat(basicBot.chat.facebook, {link: basicBot.settings.fbLink}));
                    }
                }
            },

            filterCommand: {
                command: 'filter',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.filterChat) {
                            basicBot.settings.filterChat = !basicBot.settings.filterChat;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.chatfilter}));
                        }
                        else {
                            basicBot.settings.filterChat = !basicBot.settings.filterChat;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.chatfilter}));
                        }
                    }
                }
            },

            helpCommand: {
                command: 'help',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var link = "http://i.imgur.com/SBAso1N.jpg";
                        API.sendChat(subChat(basicBot.chat.starterhelp, {link: link}));
                    }
                }
            },

            joinCommand: {
                command: 'join',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.room.roulette.rouletteStatus && basicBot.room.roulette.participants.indexOf(chat.uid) < 0) {
                            basicBot.room.roulette.participants.push(chat.uid);
                            API.sendChat(subChat(basicBot.chat.roulettejoin, {name: chat.un}));
                        }
                    }
                }
            },

            jointimeCommand: {
                command: 'jointime',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var join = basicBot.userUtilities.getJointime(user);
                        var time = Date.now() - join;
                        var timeString = basicBot.roomUtilities.msToStr(time);
                        API.sendChat(subChat(basicBot.chat.jointime, {namefrom: chat.un, username: name, time: timeString}));
                    }
                }
            },

            kickCommand: {
                command: 'kick',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var lastSpace = msg.lastIndexOf(' ');
                        var time;
                        var name;
                        if (lastSpace === msg.indexOf(' ')) {
                            time = 0.25;
                            name = msg.substring(cmd.length + 2);
                        }
                        else {
                            time = msg.substring(lastSpace + 1);
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }

                        var user = basicBot.userUtilities.lookupUserName(name);
                        var from = chat.un;
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));

                        var permFrom = basicBot.userUtilities.getPermission(chat.uid);
                        var permTokick = basicBot.userUtilities.getPermission(user.id);

                        if (permFrom <= permTokick)
                            return API.sendChat(subChat(basicBot.chat.kickrank, {name: chat.un}));

                        if (!isNaN(time)) {
                            API.sendChat(subChat(basicBot.chat.kick, {name: chat.un, username: name, time: time}));
                            if (time > 24 * 60 * 60) API.moderateBanUser(user.id, 1, API.BAN.PERMA);
                            else API.moderateBanUser(user.id, 1, API.BAN.DAY);
                            setTimeout(function (id, name) {
                                API.moderateUnbanUser(id);
                                console.log('Unbanned @' + name + '.');
                            }, time * 60 * 1000, user.id, name);
                        }
                        else API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            killCommand: {
                command: 'kill',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        storeToStorage();
                        API.sendChat(basicBot.chat.kill);
                        basicBot.disconnectAPI();
                        setTimeout(function () {
                            kill();
                        }, 1000);
                    }
                }
            },

            leaveCommand: {
                command: 'leave',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var ind = basicBot.room.roulette.participants.indexOf(chat.uid);
                        if (ind > -1) {
                            basicBot.room.roulette.participants.splice(ind, 1);
                            API.sendChat(subChat(basicBot.chat.rouletteleave, {name: chat.un}));
                        }
                    }
                }
            },

            linkCommand: {
                command: 'link',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var media = API.getMedia();
                        var from = chat.un;
                        var user = basicBot.userUtilities.lookupUser(chat.uid);
                        var perm = basicBot.userUtilities.getPermission(chat.uid);
                        var dj = API.getDJ().id;
                        var isDj = false;
                        if (dj === chat.uid) isDj = true;
                        if (perm >= 1 || isDj) {
                            if (media.format === 1) {
                                var linkToSong = "https://www.youtube.com/watch?v=" + media.cid;
                                API.sendChat(subChat(basicBot.chat.songlink, {name: from, link: linkToSong}));
                            }
                            if (media.format === 2) {
                                SC.get('/tracks/' + media.cid, function (sound) {
                                    API.sendChat(subChat(basicBot.chat.songlink, {name: from, link: sound.permalink_url}));
                                });
                            }
                        }
                    }
                }
            },

            lockCommand: {
                command: 'lock',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.booth.lockBooth();
                    }
                }
            },

            lockdownCommand: {
                command: 'lockdown',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var temp = basicBot.settings.lockdownEnabled;
                        basicBot.settings.lockdownEnabled = !temp;
                        if (basicBot.settings.lockdownEnabled) {
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.lockdown}));
                        }
                        else return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.lockdown}));
                    }
                }
            },

            lockguardCommand: {
                command: 'lockguard',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.lockGuard) {
                            basicBot.settings.lockGuard = !basicBot.settings.lockGuard;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.lockdown}));
                        }
                        else {
                            basicBot.settings.lockGuard = !basicBot.settings.lockGuard;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.lockguard}));
                        }
                    }
                }
            },

            lockskipCommand: {
                command: 'lockskip',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.room.skippable) {
                            var dj = API.getDJ();
                            var id = dj.id;
                            var name = dj.username;
                            var msgSend = '@' + name + ': ';
                            basicBot.room.queueable = false;

                            if (chat.message.length === cmd.length) {
                                API.sendChat(subChat(basicBot.chat.usedlockskip, {name: chat.un}));
                                basicBot.roomUtilities.booth.lockBooth();
                                setTimeout(function (id) {
                                    API.moderateForceSkip();
                                    basicBot.room.skippable = false;
                                    setTimeout(function () {
                                        basicBot.room.skippable = true
                                    }, 5 * 1000);
                                    setTimeout(function (id) {
                                        basicBot.userUtilities.moveUser(id, basicBot.settings.lockskipPosition, false);
                                        basicBot.room.queueable = true;
                                        setTimeout(function () {
                                            basicBot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1500, id);
                                }, 1000, id);
                                return void (0);
                            }
                            var validReason = false;
                            var msg = chat.message;
                            var reason = msg.substring(cmd.length + 1);
                            for (var i = 0; i < basicBot.settings.lockskipReasons.length; i++) {
                                var r = basicBot.settings.lockskipReasons[i][0];
                                if (reason.indexOf(r) !== -1) {
                                    validReason = true;
                                    msgSend += basicBot.settings.lockskipReasons[i][1];
                                }
                            }
                            if (validReason) {
                                API.sendChat(subChat(basicBot.chat.usedlockskip, {name: chat.un}));
                                basicBot.roomUtilities.booth.lockBooth();
                                setTimeout(function (id) {
                                    API.moderateForceSkip();
                                    basicBot.room.skippable = false;
                                    API.sendChat(msgSend);
                                    setTimeout(function () {
                                        basicBot.room.skippable = true
                                    }, 5 * 1000);
                                    setTimeout(function (id) {
                                        basicBot.userUtilities.moveUser(id, basicBot.settings.lockskipPosition, false);
                                        basicBot.room.queueable = true;
                                        setTimeout(function () {
                                            basicBot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1500, id);
                                }, 1000, id);
                                return void (0);
                            }
                        }
                    }
                }
            },

            lockskipposCommand: {
                command: 'lockskippos',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var pos = msg.substring(cmd.length + 1);
                        if (!isNaN(pos)) {
                            basicBot.settings.lockskipPosition = pos;
                            return API.sendChat(subChat(basicBot.chat.lockskippos, {name: chat.un, position: basicBot.settings.lockskipPosition}));
                        }
                        else return API.sendChat(subChat(basicBot.chat.invalidpositionspecified, {name: chat.un}));
                    }
                }
            },

            locktimerCommand: {
                command: 'locktimer',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var lockTime = msg.substring(cmd.length + 1);
                        if (!isNaN(lockTime)) {
                            basicBot.settings.maximumLocktime = lockTime;
                            return API.sendChat(subChat(basicBot.chat.lockguardtime, {name: chat.un, position: basicBot.settings.maximumLocktime}));
                        }
                        else return API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            maxlengthCommand: {
                command: 'maxlength',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var maxTime = msg.substring(cmd.length + 1);
                        if (!isNaN(maxTime)) {
                            basicBot.settings.maximumSongLength = maxTime;
                            return API.sendChat(subChat(basicBot.chat.maxlengthtime, {name: chat.un, time: basicBot.settings.maximumSongLength}));
                        }
                        else return API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            motdCommand: {
                command: 'motd',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length <= cmd.length + 1) return API.sendChat('/me MotD: ' + basicBot.settings.motd);
                        var argument = msg.substring(cmd.length + 1);
                        if (!basicBot.settings.motdEnabled) basicBot.settings.motdEnabled = !basicBot.settings.motdEnabled;
                        if (isNaN(argument)) {
                            basicBot.settings.motd = argument;
                            API.sendChat(subChat(basicBot.chat.motdset, {msg: basicBot.settings.motd}));
                        }
                        else {
                            basicBot.settings.motdInterval = argument;
                            API.sendChat(subChat(basicBot.chat.motdintervalset, {interval: basicBot.settings.motdInterval}));
                        }
                    }
                }
            },

            moveCommand: {
                command: 'move',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var firstSpace = msg.indexOf(' ');
                        var lastSpace = msg.lastIndexOf(' ');
                        var pos;
                        var name;
                        if (isNaN(parseInt(msg.substring(lastSpace + 1)))) {
                            pos = 1;
                            name = msg.substring(cmd.length + 2);
                        }
                        else {
                            pos = parseInt(msg.substring(lastSpace + 1));
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        if (user.id === basicBot.loggedInID) return API.sendChat(subChat(basicBot.chat.addbotwaitlist, {name: chat.un}));
                        if (!isNaN(pos)) {
                            API.sendChat(subChat(basicBot.chat.move, {name: chat.un}));
                            basicBot.userUtilities.moveUser(user.id, pos, false);
                        } else return API.sendChat(subChat(basicBot.chat.invalidpositionspecified, {name: chat.un}));
                    }
                }
            },

            muteCommand: {
                command: 'mute',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var lastSpace = msg.lastIndexOf(' ');
                        var time = null;
                        var name;
                        if (lastSpace === msg.indexOf(' ')) {
                            name = msg.substring(cmd.length + 2);
                            time = 45;
                        }
                        else {
                            time = msg.substring(lastSpace + 1);
                            if (isNaN(time) || time == "" || time == null || typeof time == "undefined") {
                                return API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                            }
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }
                        var from = chat.un;
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var permFrom = basicBot.userUtilities.getPermission(chat.uid);
                        var permUser = basicBot.userUtilities.getPermission(user.id);
                        if (permFrom > permUser) {
                            /*
                            basicBot.room.mutedUsers.push(user.id);
                            if (time === null) API.sendChat(subChat(basicBot.chat.mutednotime, {name: chat.un, username: name}));
                            else {
                                API.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                                setTimeout(function (id) {
                                    var muted = basicBot.room.mutedUsers;
                                    var wasMuted = false;
                                    var indexMuted = -1;
                                    for (var i = 0; i < muted.length; i++) {
                                        if (muted[i] === id) {
                                            indexMuted = i;
                                            wasMuted = true;
                                        }
                                    }
                                    if (indexMuted > -1) {
                                        basicBot.room.mutedUsers.splice(indexMuted);
                                        var u = basicBot.userUtilities.lookupUser(id);
                                        var name = u.username;
                                        API.sendChat(subChat(basicBot.chat.unmuted, {name: chat.un, username: name}));
                                    }
                                }, time * 60 * 1000, user.id);
                            }
                            */
                            if(time > 45){
                                API.sendChat(subChat(basicBot.chat.mutedmaxtime, {name: chat.un, time: "45"}));
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                            }
                            else if(time === 45){
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                                API.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));

                            }
                            else if(time > 30){
                                API.moderateMuteUser(user.id, 1, API.MUTE.MEDIUM);
                                API.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                                setTimeout(function(id){
                                    API.moderateUnmuteUser(id);
                                }, time * 60 * 1000, user.id);
                            }
                            else {
                                API.moderateMuteUser(user.id, 1, API.MUTE.SHORT);
                                API.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                                setTimeout(function(id){
                                    API.moderateUnmuteUser(id);
                                }, time * 60 * 1000, user.id);
                            }
                        }
                        else API.sendChat(subChat(basicBot.chat.muterank, {name: chat.un}));
                    }
                }
            },

            opCommand: {
                command: 'op',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.opLink === "string")
                            return API.sendChat(subChat(basicBot.chat.oplist, {link: basicBot.settings.opLink}));
                    }
                }
            },

            pingCommand: {
                command: 'ping',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(basicBot.chat.pong)
                    }
                }
            },

            refreshCommand: {
                command: 'refresh',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        storeToStorage();
                        basicBot.disconnectAPI();
                        setTimeout(function () {
                            window.location.reload(false);
                        }, 1000);

                    }
                }
            },

            reloadCommand: {
                command: 'reload',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(basicBot.chat.reload);
                        storeToStorage();
                        basicBot.disconnectAPI();
                        kill();
                        setTimeout(function () {
                            $.getScript(basicBot.scriptLink);
                        }, 2000);
                    }
                }
            },

            removeCommand: {
                command: 'remove',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length > cmd.length + 2) {
                            var name = msg.substr(cmd.length + 2);
                            var user = basicBot.userUtilities.lookupUserName(name);
                            if (typeof user !== 'boolean') {
                                user.lastDC = {
                                    time: null,
                                    position: null,
                                    songCount: 0
                                };
                                API.moderateRemoveDJ(user.id);
                            } else API.sendChat(subChat(basicBot.chat.removenotinwl, {name: chat.un, username: name}));
                        } else API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                    }
                }
            },

            restrictetaCommand: {
                command: 'restricteta',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.etaRestriction) {
                            basicBot.settings.etaRestriction = !basicBot.settings.etaRestriction;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.etarestriction}));
                        }
                        else {
                            basicBot.settings.etaRestriction = !basicBot.settings.etaRestriction;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.etarestriction}));
                        }
                    }
                }
            },

            rouletteCommand: {
                command: 'roulette',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (!basicBot.room.roulette.rouletteStatus) {
                            basicBot.room.roulette.startRoulette();
                        }
                    }
                }
            },

            rulesCommand: {
                command: 'rules',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.rulesLink === "string")
                            return API.sendChat(subChat(basicBot.chat.roomrules, {link: basicBot.settings.rulesLink}));
                    }
                }
            },

            sessionstatsCommand: {
                command: 'sessionstats',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var from = chat.un;
                        var woots = basicBot.room.roomstats.totalWoots;
                        var mehs = basicBot.room.roomstats.totalMehs;
                        var grabs = basicBot.room.roomstats.totalCurates;
                        API.sendChat(subChat(basicBot.chat.sessionstats, {name: from, woots: woots, mehs: mehs, grabs: grabs}));
                    }
                }
            },

            skipCommand: {
                command: 'skip',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(subChat(basicBot.chat.skip, {name: chat.un}));
                        API.moderateForceSkip();
                        basicBot.room.skippable = false;
                        setTimeout(function () {
                            basicBot.room.skippable = true
                        }, 5 * 1000);

                    }
                }
            },

            songstatsCommand: {
                command: 'songstats',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.songstats) {
                            basicBot.settings.songstats = !basicBot.settings.songstats;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.songstats}));
                        }
                        else {
                            basicBot.settings.songstats = !basicBot.settings.songstats;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.songstats}));
                        }
                    }
                }
            },

            sourceCommand: {
                command: 'source',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat('/me This bot was made by ' + botCreator + '.');
                    }
                }
            },

            statusCommand: {
                command: 'status',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var from = chat.un;
                        var msg = '/me [@' + from + '] ';

                        msg += basicBot.chat.afkremoval + ': ';
                        if (basicBot.settings.afkRemoval) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
                        msg += basicBot.chat.afksremoved + ": " + basicBot.room.afkList.length + '. ';
                        msg += basicBot.chat.afklimit + ': ' + basicBot.settings.maximumAfk + '. ';

                        msg += 'Bouncer+: ';
                        if (basicBot.settings.bouncerPlus) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.lockguard + ': ';
                        if (basicBot.settings.lockGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.cycleguard + ': ';
                        if (basicBot.settings.cycleGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.timeguard + ': ';
                        if (basicBot.settings.timeGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.chatfilter + ': ';
                        if (basicBot.settings.filterChat) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        var launchT = basicBot.room.roomstats.launchTime;
                        var durationOnline = Date.now() - launchT;
                        var since = basicBot.roomUtilities.msToStr(durationOnline);
                        msg += subChat(basicBot.chat.activefor, {time: since});

                        return API.sendChat(msg);
                    }
                }
            },

            swapCommand: {
                command: 'swap',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var firstSpace = msg.indexOf(' ');
                        var lastSpace = msg.lastIndexOf(' ');
                        var name1 = msg.substring(cmd.length + 2, lastSpace);
                        var name2 = msg.substring(lastSpace + 2);
                        var user1 = basicBot.userUtilities.lookupUserName(name1);
                        var user2 = basicBot.userUtilities.lookupUserName(name2);
                        if (typeof user1 === 'boolean' || typeof user2 === 'boolean') return API.sendChat(subChat(basicBot.chat.swapinvalid, {name: chat.un}));
                        if (user1.id === basicBot.loggedInID || user2.id === basicBot.loggedInID) return API.sendChat(subChat(basicBot.chat.addbottowaitlist, {name: chat.un}));
                        var p1 = API.getWaitListPosition(user1.id) +1;
                        var p2 = API.getWaitListPosition(user2.id) +1;
                        if (p1 < 0 || p2 < 0) return API.sendChat(subChat(basicBot.chat.swapwlonly, {name: chat.un}));
                        API.sendChat(subChat(basicBot.chat.swapping, {'name1': name1, 'name2': name2}));
                        if (p1 < p2) {
                            basicBot.userUtilities.moveUser(user2.id, p1, false);
                            setTimeout(function (user1, p2) {
                                basicBot.userUtilities.moveUser(user1.id, p2, false);
                            }, 2000, user1, p2);
                        }
                        else {
                            basicBot.userUtilities.moveUser(user1.id, p2, false);
                            setTimeout(function (user2, p1) {
                                basicBot.userUtilities.moveUser(user2.id, p1, false);
                            }, 2000, user2, p1);
                        }
                    }
                }
            },

            themeCommand: {
                command: 'theme',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.themeLink === "string")
                            API.sendChat(subChat(basicBot.chat.genres, {link: basicBot.settings.themeLink}));
                    }
                }
            },

            timeguardCommand: {
                command: 'timeguard',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.timeGuard) {
                            basicBot.settings.timeGuard = !basicBot.settings.timeGuard;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.timeguard}));
                        }
                        else {
                            basicBot.settings.timeGuard = !basicBot.settings.timeGuard;
                            return API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.timeguard}));
                        }

                    }
                }
            },

            togglemotdCommand: {
                command: 'togglemotd',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.motdEnabled) {
                            basicBot.settings.motdEnabled = !basicBot.settings.motdEnabled;
                            API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.motd}));
                        }
                        else {
                            basicBot.settings.motdEnabled = !basicBot.settings.motdEnabled;
                            API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.motd}));
                        }
                    }
                }
            },

            unbanCommand: {
                command: 'unban',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        $(".icon-population").click();
                        $(".icon-ban").click();
                        setTimeout(function (chat) {
                            var msg = chat.message;
                            if (msg.length === cmd.length) return API.sendChat()
                            var name = msg.substring(cmd.length + 2);
                            var bannedUsers = API.getBannedUsers();
                            var found = false;
                            for (var i = 0; i < bannedUsers.length; i++) {
                                var user = bannedUsers[i];
                                if (user.username === name) {
                                    id = user.id;
                                    found = true;
                                }
                            }
                            if (!found) {
                                $(".icon-chat").click();
                                return API.sendChat(subChat(basicBot.chat.notbanned, {name: chat.un}));
                            }
                            API.moderateUnbanUser(user.id);
                            console.log("Unbanned " + name);
                            setTimeout(function () {
                                $(".icon-chat").click();
                            }, 1000);
                        }, 1000, chat);
                    }
                }
            },

            unlockCommand: {
                command: 'unlock',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.booth.unlockBooth();
                    }
                }
            },

            unmuteCommand: {
                command: 'unmute',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var permFrom = basicBot.userUtilities.getPermission(chat.uid);
                        /**
                        if (msg.indexOf('@') === -1 && msg.indexOf('all') !== -1) {
                            if (permFrom > 2) {
                                basicBot.room.mutedUsers = [];
                                return API.sendChat(subChat(basicBot.chat.unmutedeveryone, {name: chat.un}));
                            }
                            else return API.sendChat(subChat(basicBot.chat.unmuteeveryonerank, {name: chat.un}));
                        }
                        **/
                        var from = chat.un;
                        var name = msg.substr(cmd.length + 2);

                        var user = basicBot.userUtilities.lookupUserName(name);

                        if (typeof user === 'boolean') return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));

                        var permUser = basicBot.userUtilities.getPermission(user.id);
                        if (permFrom > permUser) {
                            /*
                            var muted = basicBot.room.mutedUsers;
                            var wasMuted = false;
                            var indexMuted = -1;
                            for (var i = 0; i < muted.length; i++) {
                                if (muted[i] === user.id) {
                                    indexMuted = i;
                                    wasMuted = true;
                                }

                            }
                            if (!wasMuted) return API.sendChat(subChat(basicBot.chat.notmuted, {name: chat.un}));
                            basicBot.room.mutedUsers.splice(indexMuted);
                            API.sendChat(subChat(basicBot.chat.unmuted, {name: chat.un, username: name}));
                            */
                            try{
                                API.moderateUnmuteUser(user.id);
                                API.sendChat(subChat(basicBot.chat.unmuted, {name: chat.un, username: name}));
                            }
                            catch(e){
                                API.sendChat(subChat(basicBot.chat.notmuted, {name: chat.un}));
                            }
                        }
                        else API.sendChat(subChat(basicBot.chat.unmuterank, {name: chat.un}));
                    }
                }
            },

            usercmdcdCommand: {
                command: 'usercmdcd',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var cd = msg.substring(cmd.length + 1);
                        if (!isNaN(cd)) {
                            basicBot.settings.commandCooldown = cd;
                            return API.sendChat(subChat(basicBot.chat.commandscd, {name: chat.un, time: basicBot.settings.commandCooldown}));
                        }
                        else return API.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            usercommandsCommand: {
                command: 'usercommands',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.usercommandsEnabled) {
                            API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.usercommands}));
                            basicBot.settings.usercommandsEnabled = !basicBot.settings.usercommandsEnabled;
                        }
                        else {
                            API.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.usercommands}));
                            basicBot.settings.usercommandsEnabled = !basicBot.settings.usercommandsEnabled;
                        }
                    }
                }
            },

            voteratioCommand: {
                command: 'voteratio',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (user === false) return API.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var vratio = user.votes;
                        var ratio = vratio.woot / vratio.meh;
                        API.sendChat(subChat(basicBot.chat.voteratio, {name: chat.un, username: name, woot: vratio.woot, mehs: vratio.meh, ratio: ratio.toFixed(2)}));
                    }
                }
            },

            welcomeCommand: {
                command: 'welcome',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.welcome) {
                            basicBot.settings.welcome = !basicBot.settings.welcome;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.welcomemsg}));
                        }
                        else {
                            basicBot.settings.welcome = !basicBot.settings.welcome;
                            return API.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.welcomemsg}));
                        }
                    }
                }
            },

            websiteCommand: {
                command: 'website',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.website === "string")
                            API.sendChat(subChat(basicBot.chat.website, {link: basicBot.settings.website}));
                    }
                }
            },

            youtubeCommand: {
                command: 'youtube',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.youtubeLink === "string")
                            API.sendChat(subChat(basicBot.chat.youtube, {name: chat.un, link: basicBot.settings.youtubeLink}));
                    }
                }
            }
        }
    };

    loadChat(basicBot.startup);
}).call(this);
