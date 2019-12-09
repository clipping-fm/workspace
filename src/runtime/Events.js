const Events = {
  bound: {},
  on(eventName, callback) {
    if (Events.bound[eventName]) {
      Events.bound[eventName] = {
        callbacks: [...Events.bound[eventName], callback]
      }
    } else {
      Events.bound[eventName] = {
        callbacks: [callback]
      };
    }
  },
  trigger(eventName) {
    if (Events.bound[eventName]) {
      Events.bound[eventName].callbacks.forEach(c => c());
    }
  }
};

export default Events;
