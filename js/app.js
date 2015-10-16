angular.module('emailParser', [])
    //.config(['$interpolateProvider',
    //    function($interpolateProvider) {
    //        $interpolateProvider.startSymbol('__');
    //        $interpolateProvider.endSymbol('__');
    //    }
    //])
    .factory('EmailParser', ['$interpolate',
        function($interpolate) {
            return {
                parse: function(text, context) {
                    var template = $interpolate(text);
                    return template(context);
                }
            }
        }
    ]);

var myApp = angular.module('myApp', ['emailParser']);

myApp.controller('MyController',
    ['$scope', 'EmailParser',
        function($scope, EmailParser) {
            $scope.name = "Ari";

            $scope.person = {
                name: "Anton Yefremov"
            };

            $scope.$watch('expr', function(newVal, oldVal, scope) {
                if (newVal !== oldVal) {
                    var parseFun = $parse(newVal);
                    $scope.parsedValue = parseFun(scope);
                    console.log(oldVal, newVal, scope);
                }
            });

            $scope.to = 'ari@fullstack.io';
            $scope.emailBody = 'Hello {{ to }}';
             //Set up a watch
            $scope.$watch('emailBody', function(body) {
                if (body) {
                    $scope.previewText =
                        EmailParser.parse(body, {
                            to: $scope.to
                        });
                }
            });

        }
    ]);

myApp.controller('FirstController', function($scope) {
    $scope.counter = 0;
    $scope.add = function(amount) {$scope.counter += amount;};
    $scope.subtract = function(amount) {$scope.counter -= amount;};
});

myApp.controller('ParentController', function($scope) {
    $scope.person = {greeted: false};
});

myApp.controller('ChildController', function($scope) {
    $scope.sayHello = function() {
        $scope.person.name = "Eddie Murphy";
        $scope.person.greeted = true;
    };
});