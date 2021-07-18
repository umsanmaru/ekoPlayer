var firebase = require("firebase/app");

export default {
    /*Sanmaru Um*/
    /**S
     *
     * @function onReady
     * @param {InterludePlayer} player
     * @param {object} ctx
     */
    onReady: function (player, ctx) {
        // See https://developer.helloeko.com for API documentation. Place your code here:
        var key = "student0";
        var config = {
            apiKey: "AIzaSyDKN-rtjbTLv1gsPbVuDd_jZCROM9wgeTI",
            authDomain: "eko-test-5fa72.firebaseapp.com",
            databaseURL: "https://eko-test-5fa72-default-rtdb.firebaseio.com",
            projectId: "eko-test-5fa72",
            storageBucket: "eko-test-5fa72.appspot.com",
            messagingSenderId: "127795070315",
            appId: "1:127795070315:web:79668e902906672f7ab82e",
            measurementId: "G-H58CTDDHDK"
          };
        firebase.initializeApp(config);

        function writeNewResult(question, correct, key) {
            var data = {
              [question]: correct
            };
            var updates = {};
            updates['/questions/' + key] = data;
          
            return firebase.database().ref().update(updates);
          }
        //-------------react 연동 start-----------------------//
        console.log(InterludePlayer.environment.queryParams.result);
        let checkBoxList;
        let tempNodeList = [];
        // let checkboxResult = InterludePlayer.environment.queryParams.result;
        let checkboxResult = "1-1:1 1-2:2 1-3:x 1-4:x 2-1:x 2-2:x 2-3:x 2-4:4 "
        checkBoxList = checkboxResult.split(' ');
        checkBoxList = checkBoxList.slice(0, checkBoxList.length-1);
        console.log(checkBoxList) 
        checkBoxList.map(x => {
            if(x.includes('1-')){
                var temp = x.split(':');
                if(temp[1] != 'x')
                    tempNodeList.push(temp[1]);
            }
        });
        console.log(tempNodeList);
        

        const nodeMap = {
            "1": 'node_video1_017a95',
            "2": 'node_video2_178275',
            "3": 'node_node3_d1ba6f',
            "4": 'node_video4_6075e6'
        };


        function myHard(checkBoxList){
            return 2;
        }

        var myHard = myHard(checkBoxList);
        const nodeHard = [2, 1, 2, 0]

        //-------------react 연동 end-----------------------//

        let nodeList = tempNodeList.map(node => {
            return {num: node, nodeName: nodeMap[node], hardNess: nodeHard[node-1], pass: nodeHard[node-1]<myHard};
        });
        console.log(nodeList);
        var i;
        for (i = 0; i < nodeList.length; i++) {
            var decision_parent = player.decision.get(nodeList[i].nodeName);
            var decision_parent_id = nodeList[i].nodeName;
            var child_list = []
            let temp_i = i;
            console.log(i, nodeList[i].pass);

            if(!(temp_i == nodeList.length - 1)) child_list.push(nodeList[temp_i + 1]);

            if(nodeList[i].pass == true){
                player.decision.update(decision_parent_id, {
                    children: child_list, 
                    decider: function(p,c){
                        if(temp_i == nodeList.length - 1)
                            return false;
                        return nodeList[temp_i + 1].nodeName;
                    }
                });
            }

            else{
                var decision_child_list = decision_parent.children;
                if(nodeList[i].pass != false){
                    decision_child_list = decision_child_list[3-nodeList[i].pass].children;
                }
                while(!decision_child_list[0].id.includes("Z")){
                    decision_child_list = decision_child_list[0].children;
                }
                decision_child_list.map(child => {
                    var decision_child_id = child.id;
                    player.decision.update(decision_child_id, {
                        children: child_list, 
                        decider: function(p,c){
                            if(temp_i == nodeList.length - 1)
                                return false;
                            return nodeList[temp_i + 1].nodeName;
                            
                        }
                    });
                });
            }
            
        }
        
        player.variables.register("rA", {initialValue: [2, 3]});
        console.log(InterludePlayer.environment);
        window.addEventListener("keyup", event => {
            if((player.currentNodeRemainingTime<95) || event.isComposing)
                return;
            if(event.key ===  "ArrowRight"){
                player.currentTime +=5;
                let temp = player.variables.getValue("rA");
                player.variables.setValue("rA", temp+1);
                //console.log(player.variables.getValue("rA"));
            }
            if(event.key == "ArrowLeft") 
                player.currentTime -=5;
            console.log(player.playlist[0])
        });

        player.on('decision.made', function(node) {
            var playlist = player.playlist;
            var pushedNode = playlist[playlist.length-1];
            var questionNumber = node.id[2]
            var hard = '';
            if(node.id.length == 5 || (node.id.includes('Z') & node.id.length == 7))
                 hard = node.id[4]
            else if(node.id.length > 5){
                hard = node.id[4] + node.id[5];
            }
            var question = questionNumber + '_Q_' + hard
            writeNewResult(question, pushedNode.id, key);
        });
    }

};

