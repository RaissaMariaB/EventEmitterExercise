module.exports = {
  create() {
    const eventsEmitter = {
      events: {},
      on: function (event, callback) {
        if (callback === undefined) {
          throw new Error("Expected a function as the second argument")

        }else if (this.events[event] === undefined) {
          this.events[event] = [callback]

          const callbackIndex = this.events[event].indexOf(callback)
          const removeCallback = () => this.events[event].splice(callbackIndex, 1)
          const cancel = removeCallback

          return cancel

        }else if (!this.events[event].includes(callback)) {
          const ev = this.events[event]
          ev.push(callback)

          const callbackIndex = ev.indexOf(callback)
          const removeCallback = () => ev.splice(callbackIndex, 1)
          const cancel = removeCallback

          return cancel
        }
      },
      off: function (event, callback) {
        if (callback) {
          const callbackIndex =  this.events[event].indexOf(callback)
          this.events[event].splice(callbackIndex, 1)
        }
    },
      emit: () => {},
      once: () => {},
      race: () => {},
    }
    return eventsEmitter
  }
}
