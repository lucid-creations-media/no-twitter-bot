import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), ctx => {
  return ctx.reply(
    `Welcome\\! I am a bot created by Lucid for [Lucid Creations Media groups\\.](https://community.lucidcreations.media/) I am designed to delete any Twitter/X and Facebook/Meta links, links to reformatting services for Twitter posts, and other Meta products within groups\\. I now check embedded links\\! By default I only work with whitelisted group IDs\\. You can fork me from this link: https://github\\.com/lucid\\-creations\\-media/no\\-twitter\\-bot and deploy me for use in your own groups\\!\n\nLucid would consider hosting this bot for public use if crowd\\-funding would cover the hosting cost of the bot\\. Reach out if you would like to help\\.`,
    { parse_mode: "MarkdownV2" }
  );
});

export { composer as welcomeFeature };
