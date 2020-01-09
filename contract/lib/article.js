const State = require("../ledger-api/state.js");

class Article extends State {
  constructor(obj) {
    super(Article.getClass(), [obj.title]);
    Object.assign(this, obj);
  }

  /**
   * Basic getters and setters
   */
  getTitle() {
    return this.title;
  }
  setTitle(newTitle) {
    this.title = newTitle;
  }
  getCID() {
    return this.cid;
  }
  setCID(newCID) {
    this.cid = newCID;
  }

  publish() {
    this.isPublished = true;
  }

  static createInstance(title, cid) {
    return new Article({ title, cid, isPublished: false });
  }

  static getClass() {
    return "org.ipa.article";
  }
}

module.exports = Article;
