var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'View/home.html',
            controller: 'myController'
        })
        .when('/id/:id', {
            templateUrl: 'View/product.html',
            controller: 'MyProduct'
        })
        .when('/checkout/:id', {
            templateUrl: 'View/checkout.html',
            controller: 'MyProduct'
        })
        .when('/checkout', {
            templateUrl: 'View/checkout.html',
        })
        .when('/contactUs', {
            templateUrl: 'Components/contactUs.html',
            controller: 'myController'
        })
        .otherwise({
            redirectTo: '/'
        })

}])
//-----------------------------Factory For fetching products--------------------------
//---json-Server is running on port 8080 --------------------------
myApp.factory('myFactory', ['$http', '$log', function ($http, $log) {
    $log.log("Initiating Factory.....");
    var productService = {};
    productService.getProduct = function (cb) {
        var url = "http://localhost:8080/products";
        $http.get(url)
            .then(function (response) {
                // response.data;
                $log.log(response.data, "Hello");
                cb(response.data);
            }, function (error) {
                $log.log(error, "Some error occured!");
            });
    };
    return productService;
}])
//-----------------------------Main Controller--------------------------
myApp.controller('myController', ['$scope', '$location', 'myFactory', function ($scope, $location, myFactory) {

    var url = "http://localhost:8080/products";
    $scope.isVisible = false;
    $scope.isHide = false;
    $scope.slider = function () {
        console.log('clicked');
        $scope.isVisible = $scope.isVisible ? false : true;
        $scope.isHide = $scope.isHide ? false : true;
    }
    $scope.closeBtn = function () {
        console.log('clicked btn');

    }
    $scope.goToProduct = function (id) {
        console.log(id, 'clicked')
        $location.path("id/" + id);
    }
    $scope.goToCheckout = function (id) {
        console.log(id, 'clicked checkout')
        $location.path("checkout/" + id);
    }
    //Calling Factory
    myFactory.getProduct(function (result) {
        $scope.products = result;
    })
    // Getting data from server
    // $http.get(url)
    //     .then(function (res) {
    //         $scope.products = res.data;
    //         console.log($scope.products);
    //     }, function (err) {
    //         console.log(err, "Error");
    //     })
    // Setting links-----
    $scope.states = {};   //wrapper Object for activeItem
    $scope.states.activeItem = 'item1';
    $scope.items = [{ id: 'item1', title: "Overview" }, { id: 'item2', title: "Details" }, { id: 'item3', title: "Review" }]
}]);
//-----------------------------Product Factory--------------------------
myApp.factory('productFactory', ['$http', '$log', function ($http, $log) {

    var showProduct = {};
    showProduct.getDetails = function (id, cb) {
        var myUrl = "http://localhost:8080/products" + "/" + id;
        $http.get(myUrl)
            .then(function (res) {
                $log.log(res.data)
                cb(res.data);
            }, function (err) {
                $log.log(err, 'error');
            })
    }
    // showProduct.getCheckout = function (id, cb) {
    //     var myUrl = "http://localhost:8080/products" + "/" + id;
    //     $http.get(myUrl)
    //         .then(function (res) {
    //             $log.log(res.data)
    //             cb(res.data);
    //         }, function (err) {
    //             $log.log(err, 'error');
    //         })
    // }
    return showProduct;
}])

//-----------------------------Product Controller--------------------------
myApp.controller('MyProduct', ['$scope', 'productFactory', '$routeParams', function ($scope, productFactory, $routeParams) {

    productFactory.getDetails($routeParams.id, function (result) {
        $scope.product = result;
        console.log($scope.product, "Product");
    })
}])

//-----------------------------Random Carousal--------------------------
myApp.directive('cards', [function () {
    return {
        restrict: 'E',
        scope: {
            products: '='
        },
        templateUrl: "View/randomCards.html",
        controller: function ($scope) {
            $scope.random = Math.floor(Math.random() * 18);
        }
    }
}])
//-----------------------------Slideshow Controller--------------------------
myApp.controller('slideshowC', function ($scope) {
    $scope.images = [{ src: 'cover3.webp', title: 'image1' }, { src: 'iamge1.jpg', title: 'image2' }, { src: 'iamge2.jpg', title: 'image3' }]
})
//-----------------------------Slideshow Directive--------------------------
myApp.directive('slider', function ($timeout) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            images: '='
        },
        //Used Direct binding
        // Function for next and prev proporty
        link: function (scope, elem, attrs) {

            scope.currentIndex = 0;     // Initially the index is at the first image

            scope.next = function () {
                scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;    //CurrentIndex++
            };

            scope.prev = function () {
                scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;    //CurrentIndex---
            };

            //show the image by setting visible true
            scope.$watch('currentIndex', function () {
                scope.images.forEach(function (image) {
                    image.visible = false;
                });
                scope.images[scope.currentIndex].visible = true;
            });

            // Start: For Automatic slideshow

            var timer;

            var sliderFunc = function () {
                timer = $timeout(function () {
                    scope.next();
                    timer = $timeout(sliderFunc, 2000);
                }, 2000);
            };

            sliderFunc();

            scope.$on('$destroy', function () {
                $timeout.cancel(timer);
            });

            // For Automatic slideshow

        },
        templateUrl: 'View/slideshow.html'
    }
});