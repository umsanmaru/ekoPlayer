'use strict';

import ekoStudioIntro from './js/intro';
import developerIntro from '../js/intro';


function safeCall(f) {
    if (typeof f === 'function') {
        const args = Array.prototype.slice.call(arguments, 1);
        return f.apply(null, args);
    }

    return true;
}

// Studio Intro Nodes in preview contain also the RTS nodes which are needed for the
// RTS Preview plugin. Because of this scenario we always add the intro nodes from studio.
function consolidateIntroNodes(developerNodes, studioNodes) {
    if (developerNodes) {
        developerNodes = Array.isArray(developerNodes) ? developerNodes : [developerNodes];
    } else {
        developerNodes = [];
    }
    return Array.from(new Set(developerNodes.concat(studioNodes)));
}

function runDefault(ctx) {
    return ekoStudioIntro.loadIntroNodes(ctx)
            .then(function() {
                return ekoStudioIntro.addRtsMappings(ctx);
            })
            .then(function() {
                ekoStudioIntro.addListeners(ctx);
            })
            .then(function() {
                return ekoStudioIntro.getHead(ctx, developerIntro);
            })
            .then(function(head) {
                ekoStudioIntro.appendHead(head);            
                ctx.intro.head = head;
            });
}

function runDelayed(ctx){
    return ekoStudioIntro.loadIntroNodes(ctx)
            .then(function() {
                return ekoStudioIntro.addRtsMappings(ctx);
            })
            .then(function() {
                ctx.intro.addDecisionsPromise =  new Promise((resolve) => {    
                    ekoStudioIntro.addRestOfNodes(ctx, resolve)
                }
            )})
            .then(function() {
                return ekoStudioIntro.getHead(ctx, developerIntro);
            })
            .then(function(head) {
                ctx.intro.head = head;
            });
}


// Project essentials.
export default {
    
    // Developer hooks
    hooks: {
        onPreInit: function(ctx) {
            return safeCall(developerIntro.onPreInit, ctx);
        },
        onPostInit: function(ctx) {
            return safeCall(developerIntro.onPostInit, ctx.player, ctx);
        },
        onIntroReady: function(ctx) {
            return safeCall(developerIntro.onIntroReady, ctx.player, ctx);
        }
    },

    run: function(ctx) {
        let runPromise;
        ctx.introNodes = consolidateIntroNodes(developerIntro.introNodes,ekoStudioIntro.introNodes);

        // Normalize introNodes to be an array
        ctx.intro.introNodes =
            Array.isArray(ctx.introNodes) ?
                ctx.introNodes :
                [ctx.introNodes];

        if (ctx.delayPlay === true) {
            runPromise = runDelayed(ctx)
        } else {
            runPromise = runDefault(ctx)
        }

        return runPromise;     
    },

    studioPlayerOptions: ekoStudioIntro.playerOptions,
    devPlayerOptions: developerIntro.playerOptions,

    // Expose the promise so loader would know when plugins can be loaded
    addDecisionsPromise: Promise.resolve()
};
