import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup", "private"]);

// const GROUP_IDS = process.env.GROUP_IDS
//   ? process.env.GROUP_IDS.split(",")
//   : undefined;

feature.hears(
  "/botInfo",
  logHandle("bot-info-command"),
  async (ctx: Context) => {
    console.info(
      "BOT INFO! BOT INFO! BOT INFO! BOT INFO! BOT INFO! BOT INFO! BOT INFO! BOT INFO!"
    );
    if (ctx.chat && ctx.msg) {
      await ctx.reply(
        `I am a bot designed to delete any Twitter/X links and reformatting services within groups\\. By default I only work with whitelisted group IDs\\.\n\nYou can fork me from this link: https://github\\.com/lucid\\-creations\\-media/no\\-twitter\\-bot and deploy me for use in your own groups\\!`,
        {
          parse_mode: "MarkdownV2",
          reply_parameters: { message_id: ctx.msg.message_id }
        }
      );
    }
  }
);

export { composer as botInfoCommand };
