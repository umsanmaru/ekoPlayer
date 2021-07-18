import ui from '../ui.json';
import subtitlesMap from '../subtitlesMap.json';
import settings from '../config/settings.json';
import playerOptions from '../config/playerOptions.json';

let player;

export default {
    settings: settings,

    run: function(ctx) {
        player = ctx.player;

        // Some plugins are async and we need to wait for their promise
        // to resolve before continuing.
        let pluginsPromises = [];
        if (player.rtsPreview && player.rtsPreview.promise) {
            pluginsPromises.push(player.rtsPreview.promise);
        }

        return ctx.when.all(pluginsPromises).then(function() {

            // replayNode
            if (player.control) {
                player.control.replayNode = ctx.intro.head;
            }

            // UI
            if (player.ui && typeof player.ui.createFromConfig === 'function') {
                player.ui.createFromConfig(ui);
            }

            // Subtitles
            if (player.subtitles) {
                const languageKeys = Object.keys(subtitlesMap.languageMap);
                languageKeys.forEach((langKey) => {
                    player.subtitles.registerLanguage(langKey, subtitlesMap.languageMap[langKey]);
                });

                const nodesWithSubtitles = Object.keys(subtitlesMap.subtitlesMap);
                nodesWithSubtitles.forEach((nodeId) => {
                    player.subtitles.attach(nodeId, subtitlesMap.subtitlesMap[nodeId]);
                });

                // If single language exists in languages keys, set it as the current language.
                // Quick fix for: https://app.asana.com/0/1192536983420284/1198182297334225/f
                if (languageKeys.length === 1) {
                    player.subtitles.language = languageKeys[0];
                }
            }

                        // Set share button visibility in end screen.
                if (player.controlbar) {
                    player.controlbar.setOptions({
                        components: {
                            endOverlay: {
                                ctaButton: true ? { type: 'share' } : false
                            }
                        }
                    });
                }
            
                    });
    }
};