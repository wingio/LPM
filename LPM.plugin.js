/**
 * @name LPM
 * @invite undefined
 * @authorLink undefined
 * @donate undefined
 * @patreon undefined
 * @website 
 * @source 
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"Link Previewer for Messages","authors":[{"name":"Wing","discord_id":"298295889720770563","github_username":"wingio","twitter_username":"WingCanTalk"}],"version":"0.1.0","description":"Adds a preview for messages containging a message link","github":"","github_raw":"","invite":""},"changelog":[{"title":"Grand Opening","items":["Thank you for downloading the first version of LPM"]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

    const {
        Logger,
        Patcher,
        Settings,
        Toasts,
        DiscordAPI
    } = Library;



    return class LPM extends Plugin {
        constructor() {
            super();
            this.defaultSettings = {};
        }
        applyMarkdown(string) {
            var boldRegex = /\*\*[\s\S]+?\*\*/igm
            var italicsRegex = /\*[\s\S]+?\*/igm
            var codeRegex = /`[\s\S]+?`/igm
            var tortn = string

            if (tortn.match(boldRegex)) {
                var toBold = tortn.match(boldRegex)
                toBold.forEach(text => {
                    tortn = tortn.replace(text, `<b>${text.slice(2, -2)}</b>`)
                })
            }
            if (tortn.match(italicsRegex)) {
                var toBold = tortn.match(italicsRegex)
                toBold.forEach(text => {
                    tortn = tortn.replace(text, `<i>${text.slice(1, -1)}</i>`)
                })
            }
            if (tortn.match(codeRegex)) {
                var toBold = tortn.match(codeRegex)
                toBold.forEach(text => {
                    tortn = tortn.replace(text, `<code class="inline" style="background: #181819;padding: 2px 2px 2px 2px;">${text.slice(1, -1)}</code>`)
                })
            }
            while (tortn.includes('\n')) {
                tortn = tortn.replace('\n', '<br>')
            }
            return tortn
        }
        onStart() {
            var cache = []
            Toasts.show('LPM has started :)', {
                type: 'success',
                timeout: 6000
            })
            Logger.log("Started");
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
            });
            var ch = DiscordAPI.currentChannel
            var urlRegex = /(http|https)[:][/][/](canary.)?discord(app)?[.]com[/]channels[/][0-9]*[/][0-9]*[/][0-9]*/igm;
            ch.messages.forEach(msg => {
                if (!msg.content) return
                var links = msg.content.match(urlRegex)
                if (links) {
                    links.forEach(link => {
                        var path = link.split('/channels/')[1].split('/')

                        if (DiscordAPI.currentUser.guilds.find(g => g.id == path[0])) {
                            var g = DiscordAPI.currentUser.guilds.find(g => g.id == path[0])
                            var c = g.channels.find(ch => ch.id == path[1])
                            if (c) {
                                var message = c.messages.find(m => m.id == path[2])
                                if (message) {
                                    var content = this.applyMarkdown(message.content)
                                    document.getElementById(`chat-messages-${msg.id}`).children[1].innerHTML = '<div class="wrapper-35wsBm userSelectNone-Iy6XEP cursorDefault-331ZcI da-wrapper da-userSelectNone da-cursorDefault" style="width: auto;"><h5 class="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ da-h5 da-title header-2BTCnc da-header">' + `Message sent by ${message.author.tag} in #${message.channel.name}` + '</h5><div class="content-2U5lSY da-content"><div class="icon-3o6xvg da-icon guildIconImage-3qTk45 guildIcon-lQ0uiM da-guildIconImage da-guildIcon iconSizeLarge-161qtT da-iconSizeLarge iconActiveLarge-2nzn9z da-iconActiveLarge" tabindex="0" role="button" style="background-image: url(&quot;' + message.author.avatarUrl + '&quot;); border-radius: 50%;"></div><div class="flex-1xMQg5 flex-1O1GKY da-flex da-flex vertical-V37hAW flex-1O1GKY directionColumn-35P_nr justifyCenter-3D2jYp alignStretch-DpGPf3 noWrap-3jynv6 guildInfo-1STtYi da-guildInfo" style="flex: 1 1 auto;"><div class="" role="button" tabindex="0"><h3 class="inviteDestinationJoined-3W7Gue inviteDestination-1fAcY7 da-inviteDestinationJoined da-inviteDestination base-1x0h_U da-base size16-1P40sf"><div class="guildNameWrapper-1RQYer da-guildNameWrapper"><span class="guildName-2hvnt_ da-guildName" style="overflow-wrap: break-word;overflow: visible;/* text-overflow: ellipsis; *//* flex-wrap: wrap; */font-size: 14px;font-weight: normal;flex: 0 0 auto;max-width: 520px;white-space: initial;">' + content + '</span></div></h3></div></div><button type="button" class="button-3To2tQ height20-mO2eIN da-button da-height20 button-38aScr da-button lookFilled-1Gx00P colorGreen-29iAKY buttonSize-DbrWhv da-buttonSize grow-q77ONN da-grow" style="align-self: auto;" ><div class="contents-18-Yxp da-contents">Jump</div></button></div></div>'
                                }
                            }
                        }
                    })
                }
            })

            setInterval(() => {
                var ch = DiscordAPI.currentChannel
                var urlRegex = /(http|https)[:][/][/](canary.)?discord(app)?[.]com[/]channels[/][0-9]*[/][0-9]*[/][0-9]*/igm;
                ch.messages.forEach(msg => {
                    if (!msg.content) return
                    var links = msg.content.match(urlRegex)
                    if (links) {
                        links.forEach(link => {
                            var path = link.split('/channels/')[1].split('/')

                            if (DiscordAPI.currentUser.guilds.find(g => g.id == path[0])) {
                                var g = DiscordAPI.currentUser.guilds.find(g => g.id == path[0])
                                var c = g.channels.find(ch => ch.id == path[1])
                                if (c) {
                                    var message = c.messages.find(m => m.id == path[2])

                                    if (message && !cache.includes(message)) {
                                        var content = this.applyMarkdown(message.content)
                                        cache.push(message)
                                        document.getElementById(`chat-messages-${msg.id}`).children[1].innerHTML = '<div class="wrapper-35wsBm userSelectNone-Iy6XEP cursorDefault-331ZcI da-wrapper da-userSelectNone da-cursorDefault" style="width: auto;"><h5 class="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ da-h5 da-title header-2BTCnc da-header">' + `Message sent by ${message.author.tag} in #${message.channel.name}` + '</h5><div class="content-2U5lSY da-content"><div class="icon-3o6xvg da-icon guildIconImage-3qTk45 guildIcon-lQ0uiM da-guildIconImage da-guildIcon iconSizeLarge-161qtT da-iconSizeLarge iconActiveLarge-2nzn9z da-iconActiveLarge" tabindex="0" role="button" style="background-image: url(&quot;' + message.author.avatarUrl + '&quot;); border-radius: 50%;"></div><div class="flex-1xMQg5 flex-1O1GKY da-flex da-flex vertical-V37hAW flex-1O1GKY directionColumn-35P_nr justifyCenter-3D2jYp alignStretch-DpGPf3 noWrap-3jynv6 guildInfo-1STtYi da-guildInfo" style="flex: 1 1 auto;"><div class="" role="button" tabindex="0"><h3 class="inviteDestinationJoined-3W7Gue inviteDestination-1fAcY7 da-inviteDestinationJoined da-inviteDestination base-1x0h_U da-base size16-1P40sf"><div class="guildNameWrapper-1RQYer da-guildNameWrapper"><span class="guildName-2hvnt_ da-guildName" style="overflow-wrap: break-word;overflow: visible;/* text-overflow: ellipsis; *//* flex-wrap: wrap; */font-size: 14px;font-weight: normal;flex: 0 0 auto;max-width: 520px;white-space: initial;">' + content + '</span></div></h3></div></div><button type="button" class="button-3To2tQ height20-mO2eIN da-button da-height20 button-38aScr da-button lookFilled-1Gx00P colorGreen-29iAKY buttonSize-DbrWhv da-buttonSize grow-q77ONN da-grow" style="align-self: auto;" ><div class="contents-18-Yxp da-contents">Jump</div></button></div></div>'
                                    }
                                }
                            }
                        })
                    }
                })
            }, 1000)
        }

        onStop() {
            Logger.log("Stopped");
            Patcher.unpatchAll();
        }

        getSettingsPanel() {}

        observer(e) {}

        onMessage() {
            console.log('message recieved')
        }


    };


};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/