
angular.module('PubsubModule', [])

.factory('PubsubFactory', ['$q',
    function($q) {
        return function(xmpp) {
            console.log("init pubsub", xmpp);

            function watch() {
                xmpp.socket.on('xmpp.pubsub.push.authorisation', function(response) {
                    xmpp.q.notify("xmpp.pubsub.push.authorisation");                
                })
                xmpp.socket.on('xmpp.pubsub.push.item', function(response) {
                    if(response.id){
                        push("remove","items",response.from,response.node,response.id);
                    }
                    push("push","items",response.from,response.node,response);
                    xmpp.q.notify("xmpp.pubsub.push.item");                
                })
                xmpp.socket.on('xmpp.pubsub.push.retract', function(response) {
                    push("remove","items",response.from,response.node,response.id);
                    xmpp.q.notify("xmpp.pubsub.push.retract",response);                
                })
                xmpp.socket.on('xmpp.pubsub.purge', function(response) {
                    xmpp.q.notify("xmpp.pubsub.purge");                
                })
                xmpp.socket.on('xmpp.pubsub.push.configuration', function(response) {
                    xmpp.q.notify("xmpp.pubsub.push.configuration");                
                })
            }



            function push(action,type,server,node,data){
                console.log(action,type,server,node,data);
                if(server && !api.data.server[server]){
                        api.data.server[server]={};
                }
                if(node && !api.data.server[server][node]){
                        api.data.server[server][node]={};
                }
                if(api.data.server[server] && api.data.server[server][node]){
                    var target=api.data.server[server][node];
                }
                if(target){
                    switch(action){
                        case "set":
                            target[type]=data;
                            break;
                        case "push":
                            if(!target[type])target[type]=[];
                            target[type].push(data);
                            break;
                        case "remove":
                            if(target[type]){
                                for(var i=0;i<target[type].length;i++){
                                    console.log(target[type][i]);
                                    if(target[type][i].id==data){
                                        console.log("hau weg die scheisse");
                                        target[type].splice(i,1)
                                        break;
                                    }
                                }
                            }
                    }
                    return target;
                }else{
                    return null;
                }

            }

            function itemMethods(item){
                console.log("no idea",item);
            }

            function send(command, request) {
                if(!request)request={};
                var q = $q.defer();
                xmpp.socket.send(
                    command,request,
                    function(error, response) {
                        if (error) {
                            api.data.errors.unshift(error);
                            xmpp.q.notify("error");
                            q.reject(error);
                        } else {

                            switch(command){
                                case 'xmpp.pubsub.unsubscribe':
                                    if(response){
                                        push("remove","subscriptions",request.to,request.node,request.id);
                                    }
                                    break;
                                case 'xmpp.pubsub.publish':
                                    console.log("das reinmurxen",request,response);
                                    //request.id=response.id;
                                    //var item={id:response.id,entry:{body:request.content}};
                                    //push("push","items",request.to,request.node,item);
                                    break;
                                case 'xmpp.pubsub.item.delete':
                                    break;
                                case 'xmpp.pubsub.config.get':
                                    push("set","config",request.to,request.node,response);
                                    break;
                                case 'xmpp.pubsub.subscriptions':
                                    push("set","subscriptions",request.to,request.node,response);
                                    break;
                                case 'xmpp.pubsub.affiliations':
                                    if(request.node){
                                        push("set","affilitations",request.to,request.node,response);
                                    }else{
                                        api.data.affiliations=response;
                                    }
                                    break;
                                case 'xmpp.pubsub.retrieve':
                                    var items=push("set","items",request.to,request.node,response);
                                    for(var i=0;i<items.length;i++){
                                        itemMethods(items[i]);
                                    }
                                    break;
                                default:
                                    //nix 
                            }
                            q.resolve(response);
                            xmpp.q.notify(response);
                        }
                    }
                );
                return q.promise;
                
            }



            var api = {
                version:"0.0.1",
                data: {
                    affiliations: [],
                    server: {},
                    errors:[]
                },
                xmpp: xmpp,
                send: function(command, data) {
                    return send(command, data);
                }
            }
            watch();
            return api;

        }
    }
]);
