angular.module('Helpers', [])


.filter('getUser', function() {
    return function(item) {
        if(typeof(item)!=="string")return "";
        var user="";
        if (item.indexOf("@") !== -1) {
            user= item.split("@")[0];
        } else {
            user= item;
        }
        if (user.indexOf("/") !== -1) {
            user=user.substring(user.lastIndexOf("/")+1);
        }
        return user;
    }
}) 

.filter('group',function(){
    return function(data,selector){
        //http://stackoverflow.com/questions/11090817/group-by-order-by-on-json-data-using-javascript-jquery
        var y=_.chain(data).sortBy(selector).groupBy(selector).value();  
        //console.log("Y",y);
        return y;
    }
})

//http://stackoverflow.com/questions/19992090/angularjs-group-by-directive

.filter('groupBy', ['$parse',
    function($parse) {
        return function(list, group_by) {

            var filtered = [];
            var prev_item = null;
            var group_changed = false;
            // this is a new field which is added to each item where we append "_CHANGED"
            // to indicate a field change in the list
            //was var new_field = group_by + '_CHANGED'; - JB 12/17/2013
            var new_field = 'group_by_CHANGED';

            // loop through each item in the list
            angular.forEach(list, function(item) {

                group_changed = false;

                // if not the first item
                if (prev_item !== null) {

                    // check if any of the group by field changed

                    //force group_by into Array
                    group_by = angular.isArray(group_by) ? group_by : [group_by];

                    //check each group by parameter
                    for (var i = 0, len = group_by.length; i < len; i++) {
                        if ($parse(group_by[i])(prev_item) !== $parse(group_by[i])(item)) {
                            group_changed = true;
                            break;
                        }
                    }


                } // otherwise we have the first item in the list which is new
                else {
                    group_changed = true;
                }

                // if the group changed, then add a new field to the item
                // to indicate this
                if (group_changed) {
                    item[new_field] = true;
                } else {
                    item[new_field] = false;
                }

                filtered.push(item);
                prev_item = item;

            });

            return filtered;
        };
    }
]);

