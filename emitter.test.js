const EventEmitter = require("./emitter.js");

let emitter;

// create a event emitter for each test
beforeEach(() => (emitter = EventEmitter.create()));

describe("initializing", () => {
  test.only("should start with an empty `events` dictionary", () => {
    expect(emitter.events).toEqual({});
  });

  test.only('should have a "on()" method', () => {
    expect(typeof emitter.on).toBe("function");
  });

  test.only('should have a "off()" method', () => {
    expect(typeof emitter.off).toBe("function");
  });

  test.only('should have a "emit()" method', () => {
    expect(typeof emitter.emit).toBe("function");
  });

  test.only('should have a "once()" method', () => {
    expect(typeof emitter.once).toBe("function");
  });

  test.only('should have a "race()" method', () => {
    expect(typeof emitter.race).toBe("function");
  });
});

describe("listening and unlistening", () => {
  test.only(".on() - should register a event listener", () => {
    const callback = jest.fn();

    emitter.on("click", callback);

    expect(emitter.events.click).toBeInstanceOf(Array);
    expect(emitter.events.click).toContain(callback);
  });

  test.only(".on() - should register more than one event listener", () => {
    const [callback1, callback2] = [jest.fn(), jest.fn()];

    emitter.on("customEvent", callback1);
    emitter.on("customEvent", callback2);

    expect(emitter.events.customEvent).toContain(callback1);
    expect(emitter.events.customEvent).toContain(callback2);
  });

  test.only(".on() - should NOT register the same listener more than once", () => {
    const [callback1, callback2] = [jest.fn(), jest.fn()];

    emitter.on("success", callback1);
    emitter.on("success", callback1);
    emitter.on("success", callback2);

    expect(emitter.events.success).toHaveLength(2);
    expect(emitter.events.success).toContain(callback1);
    expect(emitter.events.success).toContain(callback2);
  });

  test.only(".on() - should throw an error if no callback is passed", () => {
    expect(() => {
      emitter.on("keyup");
    }).toThrow("Expected a function as the second argument");
  });

  test.only(".off() - should unregister a specific event listener", () => {
    const [callback1, callback2] = [jest.fn(), jest.fn()];

    emitter.on("click", callback1);
    emitter.on("click", callback2);

    emitter.off("click", callback1);

    expect(emitter.events.click).toContain(callback2);
    expect(emitter.events.click).not.toContain(callback1);
  });

  test.only(".off() - should not throw if event doesn't exist", () => {
    expect(() => emitter.off("some-event")).not.toThrow();
  });

  test.only(".on() - should return a method which unregisters the passed listener", () => {
    const [callback1, callback2] = [jest.fn(), jest.fn()];

    const cancel = emitter.on("load", callback1);
    emitter.on("load", callback2);

    cancel();

    expect(emitter.events.load).not.toContain(callback1);
  });
});

describe("emitting events", () => {
  test.only(".emit() - should emit an event and execute all listeners callbacks", () => {
    const [callback1, callback2] = [jest.fn(), jest.fn()];

    emitter.on("resize", callback1);
    emitter.on("resize", callback2);

    emitter.emit("resize");

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });

  test.only(".emit() - should pass event data, as the second argument, to all callbacks", () => {
    const callback = jest.fn();

    emitter.on("message_received", callback);
    emitter.emit("message_received", { message: "hello" });

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ message: "hello" })
    );
  });

  test.only(".emit() - should pass event `type` to all callbacks", () => {
    const callback = jest.fn();

    emitter.on("loading", callback);
    emitter.emit("loading");

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ type: "loading" })
    );
  });

  test.only(".emit() - should do nothing if event has no callbacks", () => {
    expect(() => emitter.emit("keyup")).not.toThrow();
  });
});

describe("special listeners", () => {
  describe("once()", () => {
    test.only("should listen to an event only once", () => {
      const callback = jest.fn();

      emitter.once("click", callback);
      expect(emitter.events.click).toHaveLength(1);

      emitter.emit("click");
      expect(emitter.events.click).toHaveLength(0);
    });

    test("should return a method to cancel the listener", () => {
      const callback = jest.fn();

      const cancel = emitter.once("click", callback);
      expect(emitter.events.click).toHaveLength(1);

      cancel();
      expect(emitter.events.click).toHaveLength(0);
    });

    test("listener should received the event data", () => {
      const callback = jest.fn(e => e);

      emitter.once("click", callback);
      emitter.emit("click", { element: "div" });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          element: "div",
          type: "click"
        })
      );
    });
  });

  describe("race()", () => {
    test("should accept an array of [event, callback], execute listeners of first emitted event and unlisten all of them", () => {
      const [callback1, callback2, callback3] = [
        jest.fn(),
        jest.fn(),
        jest.fn()
      ];

      emitter.race([
        ["click", callback1],
        ["click2", callback2],
        ["click3", callback3]
      ]);
      expect(emitter.events.click).toHaveLength(1);
      expect(emitter.events.click2).toHaveLength(1);
      expect(emitter.events.click2).toHaveLength(1);

      emitter.emit("click2");
      emitter.emit("click2");

      expect(callback1).toBeCalledTimes(0);
      expect(callback2).toBeCalledTimes(1);
      expect(callback3).toBeCalledTimes(0);

      expect(emitter.events.click).toHaveLength(0);
      expect(emitter.events.click2).toHaveLength(0);
      expect(emitter.events.click2).toHaveLength(0);
    });

    test("should return a method which cancels all listeners", () => {
      const [callback1, callback2, callback3] = [
        jest.fn(),
        jest.fn(),
        jest.fn()
      ];

      const cancel = emitter.race([
        ["click", callback1],
        ["click2", callback2],
        ["click3", callback3]
      ]);
      expect(emitter.events.click).toHaveLength(1);
      expect(emitter.events.click2).toHaveLength(1);
      expect(emitter.events.click2).toHaveLength(1);

      cancel();
      expect(emitter.events.click).toHaveLength(0);
      expect(emitter.events.click2).toHaveLength(0);
      expect(emitter.events.click2).toHaveLength(0);
    });

    test("listener should received the event data", () => {
      const callback = jest.fn();

      emitter.race([["click", callback]], { element: "div" });
      emitter.emit("click", { element: "div" });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          element: "div",
          type: "click"
        })
      );
    });
  });
});
