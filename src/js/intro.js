import playerOptions from '../config/playerOptions';
export default {
    /**
     *
     * @function onPreInit
     * @param {object} ctx
     */


    onPreInit: function (ctx) {
        // See https://developer.helloeko.com for API documentation. Place your code here:
    },
    
    /**
     *
     * @function onPostInit
     * @param {InterludePlayer} player
     * @param {object} ctx
     */

    onPostInit: function (player, ctx) {
        // See https://developer.helloeko.com for API documentation. Place your code here:
    
    },



    /**
     *
     * @function onIntroReady
     * @param {InterludePlayer} player
     * @param {object} ctx
     */


    onIntroReady: function (player, ctx) {
        // See https://developer.helloeko.com for API documentation. Place your code here:
        

        var myNode = player.repository.get('node_video1_017a95');
        myNode.addPrefetch('node_video1_017a95');
        
        window.addEventListener('message', (event) => {
            const msg = event.data;
            switch (msg.type) {
                default:
                    break;
            }
        });
    },

    head: function(player){
        return 'node_video1_017a95';
    }, 
    introNodes: [
        'node_video4_6075e6'             ,  
        'node_video1_017a95'             ,  
        'node_video1_o_243f7f'             ,  
        'node_video1_x_cee731'             ,  
        'node_video2_178275'             ,  
        'node_node1_0ec4fc'             ,  
        'node_node2_ecc560'             ,  
        'node_node3_d1ba6f'             ,  
        'node_video3_1_39361d'             ,  
        'node_video3_2_8e7d69'            ,  
        'node_video3_3_fc7782'                         
    ], 
    playerOptions
};

