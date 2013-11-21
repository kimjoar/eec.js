describe('eec', function() {

    it('has when same channel, event and callback', function() {
        var events = eec();
        var callback = function() {};

        events.on('channel', 'event', callback);

        expect(events.has('channel', 'event', callback)).toBe(true);
    });

    it('does not have when same channel and event, but different callback', function() {
        var events = eec();

        events.on('channel', 'event', function() {});

        expect(events.has('channel', 'event', function() {})).toBe(false);
    });

    it('does not have when same channel and callback, but different event', function() {
        var events = eec();
        var callback = function () {};

        events.on('channel', 'event', callback);

        expect(events.has('channel', 'other-event', callback)).toBe(false);
    });

    it('triggers when same channel and event', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);

        events.emit('channel', 'event');

        expect(spy.calledOnce).toBe(true);
    });

    it('does not trigger when same channel, but different events', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);

        events.emit('channel', 'event2');

        expect(spy.called).toBe(false);
    });

    it('does not trigger when different channels, but same events', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);

        events.emit('channel2', 'event');

        expect(spy.called).toBe(false);
    });

    it('removes event when same channel, event and callback', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.off('channel', 'event', spy);

        events.emit('channel', 'event');

        expect(spy.called).toBe(false);
    });

    it('does not remove event when same channel, event, but different callback', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.off('channel', 'event', function() {});

        events.emit('channel', 'event');

        expect(spy.calledOnce).toBe(true);
    });

    it('removes event when same channel, event, but no callback', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.off('channel', 'event');

        events.emit('channel', 'event');

        expect(spy.called).toBe(false);
    });

    it('removes all events on a given channel', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.on('channel', 'event2', spy);
        events.on('channel', 'event3', spy);
        events.off('channel');

        events.emit('channel', 'event');
        events.emit('channel', 'event2');
        events.emit('channel', 'event3');

        expect(spy.callCount).toEqual(0);
    });

    it('does not remove events from other channels when removing from a channel', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.on('channel', 'event2', spy);
        events.on('channel2', 'event3', spy);
        events.on('channel2', 'event4', spy);
        events.off('channel');

        events.emit('channel', 'event');
        events.emit('channel', 'event2');
        events.emit('channel2', 'event3');
        events.emit('channel2', 'event4');

        expect(spy.callCount).toEqual(2);
    });

    it('emits once when added, removed and added again', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.off('channel', 'event');

        events.on('channel', 'event', spy);

        events.emit('channel', 'event');

        expect(spy.calledOnce).toBe(true);
    });

    it('can remove all events', function() {
        var spy = sinon.spy();

        var events = eec();

        events.on('channel', 'event', spy);
        events.on('channel', 'event2', spy);
        events.on('channel2', 'event3', spy);
        events.on('channel2', 'event4', spy);

        events.off();

        events.emit('channel', 'event');
        events.emit('channel', 'event2');
        events.emit('channel2', 'event3');
        events.emit('channel2', 'event4');

        expect(spy.callCount).toEqual(0);
    });

});
