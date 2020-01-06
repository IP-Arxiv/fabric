"use strict";

const { Contract, Context } = require("fabric-contract-api");
const ArticleList = require("./articleList.js");
const Article = require("./article.js");

class JournalContext extends Context {
  constructor() {
    super();
    this.articleList = new ArticleList(this);
  }
}

class JournalContract extends Contract {
  constructor() {
    super("journalContract");
  }

  /**
   * Define a custom context for commercial paper
   */
  createContext() {
    return new JournalContext();
  }

  async instantiate(ctx) {
    console.log("Instantiate the contract");
  }

  async addArticle(ctx, title) {
    let article = Article.createInstance(title);
    await ctx.articleList.addArticle(article);
    return article;
  }

  async getArticle(ctx, title) {
    let articleKey = Article.makeKey([title]);
    let article = await ctx.articleList.getArticle(articleKey);

    console.log("Article found");
    console.log(article);
    return article;
  }

  initCount(ctx) {
    ctx.stub.putState("count", Buffer.from(JSON.stringify({ count: 1 })));
  }

  async getCount(ctx) {
    const count = await ctx.stub.getState("count");
    const str = count.toString();
    return JSON.parse(str);
  }

  async incCount(ctx) {
    const count = await this.getCount(ctx);
    ctx.stub.putState(
      "count",
      Buffer.from(JSON.stringify({ count: count.count + 1 }))
    );
  }

  logCtx(ctx) {
    console.log("CTX jojojojo");
    console.log(ctx);
    console.log(ctx.stub);
  }
}

module.exports = JournalContract;
