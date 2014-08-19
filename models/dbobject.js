'use strict';

var Class = require('../lib/class');
var _ = require('lodash');

module.exports = Class.extend({

    // ORM Model
    _model: undefined,

    // ORM Model
    _modelRef: undefined,

    // Base array -- only on 'simple primitive'
    _properties: ['id', 'created_at', 'modified_at'],

    // Model base properties
    properties: [],

    /**
     * Save This Model To The DB
     */
    save: function (callback) {
        // TET
        var _this = this;

        // Do We Need a New Model?
        if (this._model === undefined) {
            this._model = new this._modelRef();
        }

        // Iterate And Set Properties
        _(this._properties).forEach(function (value) {
            _this._model[value] = _this[value];
        });

        _(this.properties).forEach(function (value) {
            _this._model[value] = _this[value];
        });

        // Call ORM Save
        this._model.save(function (err, ormItem) {
            _this._model = ormItem;
            callback(err, _this);
        });
    },

    /**
     * Load This Model By ID
     * @param id
     * @param callback
     */
    load: function (id, callback) {
        // TET
        var _this = this;

        // ORM Load and Populate
        this._modelRef.get(id, function (err, item) {
                if (!err) {
                    // Set Model
                    _this._model = item;
                    // Iterate And Set Properties
                    _(_this._properties).forEach(function (value) {
                        _this[value] = item[value];
                    });

                    _(_this.properties).forEach(function (value) {
                        _this[value] = item[value];
                    });
                }
                callback(err, _this);
            }
        );
    },

    /**
     * Populate This Model From JSON / Object
     * @param values
     */
    populateAttributes: function (values) {
        // TET
        var _this = this;
        // Iterate
        _(this.properties).forEach(function (value) {
            // Check Type - Only Set Strings
            if (values[value] && typeof values[value] === 'string') {
                _this[value] = values[value];
            }
        });
        // Return This For Chaining
        return this;
    },

    /**
     * Init Method
     * @param req
     */
    init: function (req) {
        // No Req?
        if (req === undefined) {
            throw new Error('This model requires a request object.');
        }
        // Test Model Ref
        if (this._modelRef === undefined) {
            throw new Error('You must specify an ORM model reference.');
        }

        /* jshint ignore:start */
        this._modelRef = eval(this._modelRef);
        /* jshint ignore:end */
    }
});