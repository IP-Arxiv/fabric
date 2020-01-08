"use strict";
const State = require("./state.js");

class StateList {
  constructor(ctx, listName) {
    this.ctx = ctx;
    this.name = listName;
    this.supportedClasses = {};
  }

  /**
   * Add a state to the list. Creates a new state in worldstate with
   * appropriate composite key.  Note that state defines its own key.
   * State object is serialized before writing.
   */
  async addState(state) {
    let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
    console.log(key);
    let data = State.serialize(state);
    await this.ctx.stub.putState(key, data);
  }

  /**
   * Get a state from the list using supplied keys. Form composite
   * keys to retrieve state from world state. State data is deserialized
   * into JSON object before being returned.
   */
  async getState(key) {
    let ledgerKey = this.ctx.stub.createCompositeKey(
      this.name,
      State.splitKey(key)
    );
    console.log(ledgerKey);
    let data = await this.ctx.stub.getState(ledgerKey);
    if (data) {
      let state = State.deserialize(data, this.supportedClasses);
      return state;
    } else {
      return null;
    }
  }

  /** Stores the class for future deserialization */
  use(stateClass) {
    this.supportedClasses[stateClass.getClass()] = stateClass;
  }
}

module.exports = StateList;
