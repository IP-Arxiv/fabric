"use strict";

const StateList = require("../ledger-api/stateList.js");
const Article = require("./article.js");

class ArticleList extends StateList {
  constructor(ctx) {
    super(ctx, "org.ipa.articlelist");
    this.use(Article);
  }

  async addArticle(article) {
    return this.addState(article);
  }

  async getArticle(articleKey) {
    return this.getState(articleKey);
  }

  async updateArticle(article) {
    return this.updateState(article);
  }

  async getAllArticles() {
    return this.getStates("A", "{");
  }
}

module.exports = ArticleList;
