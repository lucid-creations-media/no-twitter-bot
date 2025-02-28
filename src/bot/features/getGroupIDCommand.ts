import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

feature.hears(
  "/getGroupID",
  logHandle("get-group-id"),
  async (ctx: Context) => {
    const GROUP_IDS = process.env.GROUP_IDS
      ? process.env.GROUP_IDS.split(",")
      : undefined;

    if (ctx.chat && ctx.msg) {
      if (GROUP_IDS !== undefined) {
        const groupID = ctx.chat.id;
        const flag = GROUP_IDS.includes(`${groupID}`);
        if (flag) {
          await ctx.reply(`The group id is: \`${groupID}\``, {
            parse_mode: "MarkdownV2",
            reply_parameters: { message_id: ctx.msg.message_id }
          });
        }
      }
    }
  }
);

export { composer as getGroupIDCommand };
