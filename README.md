# angular-xmpp-services

This is a library talks to a xmpp server and generates a model, ready to use for directives. 


![structure](https://raw.githubusercontent.com/robotnic/angular-xmpp-services/master/src/assets/docimg/structure.png)

The library send and receives xmpp stanzas.
Based on this messages a model (json tree) is build.
The lib also handels the rendering timing by sinding promise notify messages.
https://docs.angularjs.org/api/ng/service/$q

* No $rootScope messaging needed
* ready to use automatic updating model
* easy to use API

#install

bower install angular-xmpp-services

#scripts
```
<script type="text/javascript" src="assets/scripts/primus.js"></script>
<script type="text/javascript" src="assets/angular-xmpp-services.js"></script>

```

#getting started

```

    var host="http://loas.buddycloud.com/";
    $scope.xmpp=new Xmpp(host);

    $scope.xmpp.watch().then(function(data){
        console.log("end - should never be reached");
    },function(error){
        console.log(error);
    },function(notification){
        console.log("notification",notification);
        //$scope.$apply() not needed,empty function fires render process
    });

    $scope.xmpp.anonymouslogin().then(function(){
        console.log("THE MODEL",$scope.xmpp.data.me);
    });

```

###me
$scope.xmpp.data.me
```
{
  "status": "online",
  "jid": {
    "local": "robotnic",
    "domain": "laos.buddycloud.com",
    "resource": "angular-xmpp",
    "user": "robotnic"
  }
}

```
### template
```
<div>user: {{xmpp.data.me.jid.user}}</div>
<div>domain: {{xmpp.data.me.jid.domain}}</div>
<div>{{xmpp.data.me.status}}"</div>
```

#directives

If you are looking for ready to use directive collection, this is the place to go: angular-xmpp

Here we learn how to make an directive



## structure

There is an outher <xmpp></xmpp> the containes the other directives. It provides xmpp core https://xmpp-ftw.jit.su/manual/core/


```

<xmpp xmpp-ftw-host="https://laos.buddycloud.com" domain="laos.buddycloud.com">
    <xmpplogin></xmpplogin>
    <xmpproster></xmpproster>
    <xmppminichat></xmppminichat>
    <xmppmycoolapp></xmppmycoolapp>
</xmpp>

```

## build directives

```
.directive('roster', function() {
    return {
        'require': '^xmpp',
        'restrict': 'E',
        'scope': {
            oninit:'&oninit'
        },
        'transclude': false,
        'templateUrl': 'roster/template.tpl.html',
        'link': function(scope, element, attrs,xmppController) {
            scope.xmpp=xmppController.xmpp;  //this commes from <xmpp></xmpp>
            xmppController.on("connected",function(event,status){
                scope.xmpp.send("xmpp.roster.get");
            });
        }
    };
})

```
##template
roster/template.tpl.html

```
<style type="text/css">
.indicator{
width:20px;
height:20px
background-size:cover;
}

.online{
background-image:url('https://raw.githubusercontent.com/psi-im/psi/master/iconsets/roster/default/online.png');
}

.offline{
background-image:url('https://raw.githubusercontent.com/psi-im/psi/master/iconsets/roster/default/offline.png');
}
</style>

<div class="indicator {{xmpp.data.me.status}}"></div>

```



