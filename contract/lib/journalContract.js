"use strict";

const { Contract, Context } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;
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

  /**
   * TODO: chk for role
   */
  async addArticle(ctx, title, cid) {
    let article = Article.createInstance(title, cid);
    await ctx.articleList.addArticle(article);
    return article;
  }

  async getArticle(ctx, title) {
    let articleKey = Article.makeKey([title]);
    let article = await ctx.articleList.getArticle(articleKey);

    return article;
  }

  /**
   * TODO: chk for role
   */
  async publishArticle(ctx, title) {
    const article = await this.getArticle(ctx, title);
    article.publish();

    const updatedArticle = await ctx.articleList.updateArticle(article);

    return updatedArticle;
  }

  async getAllArticles(ctx) {
    const articles = await ctx.articleList.getAllArticles();
    return articles;
  }

  logCtx(ctx) {
    const cid = new ClientIdentity(ctx.stub);
    if (cid.assertAttributeValue("hf.Type", "author"))
      console.log("YEEEEEEEEEES");
    else console.log("NOOOOOOOOOOOOO");
  }
}

module.exports = JournalContract;
