Cimentarius.factory('cimentariusService', ['$modal', '$rootScope', function($modal, $rootScope) {
    var cimentariusService = {
        // Flash banners
        alerts: [],
        // Modal bits
        modalTitle: '',
        modalBody: '',
        // built controller stuffs
        options: {},

    // Methods = ALERTS
        addAlert: function(msg) {
            if(!msg.length) msg = [msg];
            while(msg.length) {
                cimentariusService.alerts.push(msg.pop());
            }
            cimentariusService.updateAlerts();
        },

        updateAlerts: function() {
            $rootScope.$broadcast('updateAlerts');
        },


    // Methods = MODAL
        modalSet: function (modalTitle, modalBody, modalCallback) {
            if(modalTitle) cimentariusService.modalTitle = modalTitle;
            if(modalBody) cimentariusService.modalBody = modalBody;
            if(modalCallback) cimentariusService.modalCallback = modalCallback;
        },

        modalOpen: function (size) {
            var bootstrapModal = $modal.open({
                template:
                    '<div class="modal-header">' +
                    '    <h3 class="modal-title">{{ header }}</h3>' +
                    '</div>' +
                    '<div class="modal-body" ng-bind-html="body | asHtml"></div>' +
                    '<div class="modal-footer">' +
                    '    <button class="btn btn-primary" ng-click="ok()">OK</button>' +
                    '    <button class="btn btn-warning" ng-click="cancel()">Cancel</button>' +
                    '</div>',
                controller: 'BootstrapModalController',
                size: size,
                resolve: {
                }
            });

            bootstrapModal.result.then(function (modalResult) {
                cimentariusService.modalCallback(modalResult);
            });
        },

        modalCallback: function(modalResult) {
            console.log(modalResult);
        }
    }

    return cimentariusService;
}]);