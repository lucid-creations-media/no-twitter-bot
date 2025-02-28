import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

feature.hears(
  "/help",
  logHandle("blacklist-detection"),
  async (ctx: Context) => {
    const GROUP_IDS = process.env.GROUP_IDS
      ? process.env.GROUP_IDS.split(",")
      : undefined;

    if (ctx.chat && ctx.msg) {
      if (GROUP_IDS !== undefined) {
        const groupID = ctx.chat.id;
        const flag = GROUP_IDS.includes(`${groupID}`);
        // const username = ctx.msg.from?.username;

        if (flag) {
          await ctx.reply(
            `**Here are the availible commands you can use:**\n\n/getGroupID \\- replied with the ID of the group I am in\\.\n\n/isLCMGRoup \\- Checks if this group's ID is on the whitelist and responds accordingly\\.\n\n/botInfo \\- Info about me and how to fork me to deploy for your own use\\.\n\n/help \\- Displays this help message\\.`,
            {
              parse_mode: "MarkdownV2",
              reply_parameters: { message_id: ctx.msg.message_id }
            }
          );
        }

        if (!flag) {
          await ctx.reply(
            `**Since this is not a whitelisted group the features are limited\\!\\!**\n\nHere are the availible commands you can use:\n\n/isLCMGRoup \\- Checks if this group's ID is on the whitelist and responds accordingly\\.\n\n/botInfo \\- Info about me and how to fork me to deploy for your own use\\.\n\n/help \\- Displays this help message\\.`,
            {
              parse_mode: "MarkdownV2",
              reply_parameters: { message_id: ctx.msg.message_id }
            }
          );
          await ctx.reply(
            `This group is NOT in the whitelisted and is NOT a part of the LCM Telegram groups/communities\\. I am a bot designed to delete any Twitter/X links and reformatting services within groups\\. You can fork me from this link: https://github\\.com/lucid\\-creations\\-media/no\\-twitter\\-bot and deploy me for use in your own groups\\!`,
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

export { composer as helpCommand };
