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

  static createInstance(title) {
    return new Article({ title });
  }

  static getClass() {
    return "org.ipa.article";
  }
}

module.exports = Article;
