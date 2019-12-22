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
  trigger(eventName, ...args) {
    if (Events.bound[eventName]) {
      Events.bound[eventName].callbacks.forEach(c => c(...args));
    }
  }
};

export default Events;
