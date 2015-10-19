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

myApp.controller('DemoController', ['$scope', '$filter',
    function($scope, $filter) {
        $scope.name = $filter('lowercase')('Ari');

        $scope.isCapitalized = function(str) {
            return str[0] == str[0].toUpperCase();
        }
}]);

myApp.filter('capitalize', function() {
        return function(input) {
            if (input)
                return input[0].toUpperCase() + input.slice(1);
        }
    }
);

myApp.directive('ensureUnique', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function(n) {
                if (!n) return;
                $http({
                    method: 'POST',
                    url: '/api/check/' + attrs.ensureUnique,
                    data: {'field': attrs.ensureUnique}
                }).success(function(data, status, headers, cfg) {
                    c.$setValidity('unique', data.isUnique);
                }).error(function(data, status, headers, cfg) {
                    c.$setValidity('unique', false);
                });
            })
        }
    };
});

myApp.directive('ngFocus', [function() {
    var FOCUS_CLASS = "ng-focused";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(event) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function() {
                    ctrl.$focused = true;
                });
            }).bind('blur', function(event) {
                element.removeClass(FOCUS_CLASS);
                scope.$apply(function() {
                    ctrl.$focused = false;
                });
            });
        }
    };
}]);

myApp.directive('oneToTen', function() {
    return {
        require: '?ngModel',
        link: function(scope, ele, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$parsers.unshift(
                function(viewValue) {
                    var i = parseInt(viewValue);

                    if (i >= 0 && i < 10) {
                        ngModel.$setValidity('oneToTen', true);
                        return viewValue;
                    }
                    else {
                        ngModel.$setValidity('oneToTen', false);
                        return undefined;
                    }
                }
            )
        }
    }
});

myApp.controller('SignupController', function($scope) {
    $scope.submitted = false;
    $scope.signupForm = function() {
        if ($scope.signup_form.$invalid)
            $scope.signup_form.submitted = true;
    }
});