(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'ee'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('ee'));
    } else {
        // Browser globals (root is window)
        root.eec = factory(root._, root.ee);
    }

}(this, function (_, ee) {
    'use strict';

    function createEventName(channel, event) {
        if (!channel && !event) return;
        return channel + "|" + event;
    }

    return function() {
        var emitter = ee();
        var events = {};

        function on(channel, event, callback) {
            var name = createEventName(channel, event);

            events[channel] = events[channel] || [];
            events[channel].push({ name: name, callback: callback });

            emitter.on(name, callback);
        }

        function off(channel, event, callback) {
            var name = createEventName(channel, event);

            if (events[channel] && !event && !callback) {
                _.each(events[channel], function(e) {
                    emitter.off(e.name, e.callback);
                });
            } else if (events[channel]) {
                var e = _.findWhere(events[channel], { name: name, callback: callback });

                if (e) events[channel] = _.without(events[channel], e);
            }

            emitter.off(name, callback);
        }

        function has(channel, event, callback) {
            var name = createEventName(channel, event);
            return emitter.has(name, callback);
        }

        function emit(channel, event) {
            var args = _.rest(arguments, 2);
            var name = createEventName(channel, event);

            emitter.emit.apply(emitter, [name, null].concat(args));
        }

        return {
            on: on,
            off: off,
            has: has,
            emit: emit
        };
    };

}));

