import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears("start", logHandle("command-start"), ctx => {
  return ctx.reply(
    ctx.t(
      "Welcome! I am a bot created by Lucid for Lucid Creations media groups. I am designed to delete any Twitter/X links and reformatting services within groups. By default I only work with whitelisted group IDs. You can fork me from this link: https://github\\.com/lucid\\-creations\\-media/no\\-twitter\\-bot and deploy me for use in your own groups!"
    ),
    { parse_mode: "MarkdownV2" }
  );
});

export { composer as welcomeFeature };
