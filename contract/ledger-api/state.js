"use strict";

class State {
  /**
   * @param {String|Object} class  An indentifiable class of the instance
   * @param {keyParts[]} elements to pull together to make a key for the objects
   */
  constructor(stateClass, keyParts) {
    this.class = stateClass;
    this.key = State.makeKey(keyParts);
    this.currentState = null;
  }

  getSplitKey() {
    return State.splitKey(this.key);
  }

  serialize() {
    return State.serialize(this);
  }

  /**
   * Convert object to buffer containing JSON data serialization
   * Typically used before putState() ledger API
   * @param {Object} JSON object to serialize
   * @return {buffer} buffer with the data to store
   */
  static serialize(object) {
    return Buffer.from(JSON.stringify(object));
  }

  /**
   * Deserialize object into one of a set of supported JSON classes
   * i.e. Covert serialized data to JSON object
   * Typically used after getState() ledger API
   * @param {data} data to deserialize into JSON object
   * @param (supportedClasses) the set of classes data can be serialized to
   * @return {json} json with the data to store
   */
  static deserialize(data, supportedClasses) {
    let json = JSON.parse(data.toString());
    let objClass = supportedClasses[json.class];
    if (!objClass) {
      throw new Error(`Uknown class of ${json.class}`);
    }
    let object = new objClass(json);

    return object;
  }

  /**
   * Join the keyParts to make a unified string
   * @param (String[]) keyParts
   */
  static makeKey(keyParts) {
    return keyParts.map(part => JSON.stringify(part)).join(":");
  }

  static splitKey(key) {
    return key.split(":");
  }
}

module.exports = State;
