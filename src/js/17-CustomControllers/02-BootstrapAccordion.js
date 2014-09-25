Cimentarius.controller('SiteOverviewAccordion', function ($scope, $timeout) {
    $scope.init = function () {
        $scope.reload();
    };

    $scope.reload = function() {
//        $timeout(function () {
            console.log("time up");
            $scope.redraw([
                {
                    title: 'First Site - Fakey!',
                    comment: 'Comment about shite',
                    pages: [
                        {
                            "id": 1,
                            "title": "1. dragon-breath",
                            "pages": []
                        },
                        {
                            "id": 2,
                            "title": "2. moiré-vision",
                            "pages": [
                                {
                                    "id": 21,
                                    "title": "2.1. tofu-animation",
                                    "pages": [
                                        {
                                            "id": 211,
                                            "title": "2.1.1. spooky-giraffe",
                                            "pages": []
                                        },
                                        {
                                            "id": 212,
                                            "title": "2.1.2. bubble-burst",
                                            "pages": []
                                        }
                                    ]
                                },
                                {
                                    "id": 22,
                                    "title": "2.2. barehand-atomsplitting",
                                    "pages": []
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "title": "3. unicorn-zapper",
                            "pages": []
                        },
                        {
                            "id": 4,
                            "title": "4. romantic-transclusion",
                            "pages": []
                        }]
                },
                {
                    title: 'Dynamic Group Header - 2',
                    comment: 'Dynamic Group Body - 2',
                    pages: []
                }
            ]);
//        }, 1000);
    };

    $scope.redraw = function(data) {
        console.log(data);
        $scope.sites = data;
    }

    $scope.oneAtATime = true;

    $scope.sites = [];
});