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

  async addCars(ctx) {
    for (let i = 0; i < 5; i++) {
      const key = ctx.stub.createCompositeKey("car.me", [JSON.stringify(i)]);
      console.log(key);
      await ctx.stub.putState(key, Buffer.from("lol"));
    }
  }

  async queryAllArticles(ctx, start, end) {
    const startKey = ctx.stub.createCompositeKey("org.ipa.articlelist", [
      start
    ]);
    const endKey = ctx.stub.createCompositeKey("org.ipa.articlelist", [end]);

    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const allResults = [];
    while (true) {
      const res = await iterator.next();
      console.log(res.value);

      if (res.value && res.value.value.toString()) {
        console.log(res.value.value.toString("utf8"));

        const Key = res.value.key;
        let Record;
        try {
          Record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          console.log(err);
          Record = res.value.value.toString("utf8");
        }
        allResults.push({ Key, Record });
      }
      if (res.done) {
        console.log("end of data");
        await iterator.close();
        console.info(allResults);
        return JSON.stringify(allResults);
      }
    }
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
    const cid = new ClientIdentity(ctx.stub);
    if (cid.assertAttributeValue("hf.Type", "author"))
      console.log("YEEEEEEEEEES");
    else console.log("NOOOOOOOOOOOOO");
  }
}

module.exports = JournalContract;
