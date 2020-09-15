module.exports = {
  create() {
    const eventsEmitter = {
      events: {},
      on: function (event, callback) {
        const cancelCreator = () => {
          const ev = this.events[event]
          const callbackIndex = ev.indexOf(callback)
          const removeCallback = () => ev.splice(callbackIndex, 1)
          return removeCallback
        }

        if (callback === undefined) {
          throw new Error("Expected a function as the second argument")
        } else if (this.events[event] === undefined) {
          this.events[event] = [callback]
          return cancelCreator()
        } else if (!this.events[event].includes(callback)) {
          this.events[event].push(callback)
          return cancelCreator()
        }
      },
      off: function (event, callback) {
        if (callback) {
          const callbackIndex =  this.events[event].indexOf(callback)
          this.events[event].splice(callbackIndex, 1)
        }
    },
      emit: function (event, message) {
        const eventsArr = this.events[event]
        eventsArr.forEach(element => {
          element(message)
        });

      },
      once: () => {},
      race: () => {},
    }
    return eventsEmitter
  }
}
