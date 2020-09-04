module.exports = {
  create() {
    const eventsEmitter = {
      events: {},
      on: function (event, callback) {
        if(this.events[event] == undefined) {
          this.events[event] = [callback]
        }else{
          this.events[event].push(callback)
        }
      },
      off: () => {},
      emit: () => {},
      once: () => {},
      race: () => {},
    }
    return eventsEmitter
  }
}
