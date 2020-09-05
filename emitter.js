module.exports = {
  create() {
    const eventsEmitter = {
      events: {},
      on: function (event, callback) {
        if(callback === undefined){
          throw new Error("Expected a function as the second argument")

        }else if(this.events[event] == undefined){
          this.events[event] = [callback]

        }else if(!this.events[event].includes(callback)){
          this.events[event].push(callback)
        }
      },
      off: function (event, callback) {
        const callbackIndex =  this.events[event].indexOf(callback)
        this.events[event].splice(callbackIndex, 1)
    },
      emit: () => {},
      once: () => {},
      race: () => {},
    }
    return eventsEmitter
  }
}
