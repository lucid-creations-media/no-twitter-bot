import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

const GROUP_IDS = process.env.GROUP_IDS
  ? process.env.GROUP_IDS.split(",")
  : undefined;

feature.hears(
  "/isLCMGroup",
  logHandle("is-LCM-group"),
  async (ctx: Context) => {
    if (ctx.chat && ctx.msg) {
      const groupID = ctx.chat.id;

      if (GROUP_IDS !== undefined) {
        const flag = GROUP_IDS.includes(`${groupID}`);

        if (flag) {
          await ctx.reply(
            `This group is in the whitelisted and is a part of the LCM Telegram groups/communities\\. I should be deleting any Twitter/X links and reformatting services within this group\\.`,
            {
              parse_mode: "MarkdownV2",
              reply_parameters: { message_id: ctx.msg.message_id }
            }
          );
        }

        if (!flag) {
          await ctx.reply(
            `This group is NOT in the whitelisted and is NOT a part of the LCM Telegram groups/communities\\. I am a bot designed to delete any Twitter/X links and reformatting services within groups\\. You can fork me from this link: https://github\\.com/lucid\\-creations\\-media/no\\-twitter\\-bot and deploy me for use in your own groups!`,
            {
              parse_mode: "MarkdownV2",
              reply_parameters: { message_id: ctx.msg.message_id }
            }
          );
        }
      }

      if (!GROUP_IDS) {
        await ctx.reply(
          `There was a problem retrieving the whitelist. Check the env variables and try again\\.`,
          {
            parse_mode: "MarkdownV2",
            reply_parameters: { message_id: ctx.msg.message_id }
          }
        );
      }
    }
  }
);

export { composer as isLCMGroup };
