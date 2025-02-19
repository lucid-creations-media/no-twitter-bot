import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

const GROUP_IDS = process.env.GROUP_IDS
  ? process.env.GROUP_IDS.split(",")
  : undefined;

feature.hears(
  /(x.com|twitter.com)/g,
  logHandle("blacklist-detection"),
  async (ctx: Context) => {
    if (ctx.chat && ctx.msg) {
      if (GROUP_IDS !== undefined) {
        const groupID = ctx.chat.id;
        const flag = GROUP_IDS.includes(`${groupID}`);
        const username = ctx.msg.from?.username;

        if (flag) {
          ctx.msg.delete();
          await ctx.reply(
            ctx.t(
              `@${username} Twitter and X links are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`
            ),
            { parse_mode: "MarkdownV2" }
          );
        }
      }

      if (!GROUP_IDS) {
        await ctx.reply(
          ctx.t(
            `There was a problem retrieving the whitelist. Check the env variables and try again\\.`
          ),
          {
            parse_mode: "MarkdownV2",
            reply_parameters: { message_id: ctx.msg.message_id }
          }
        );
      }
    }
  }
);

export { composer as blacklistDetection };
