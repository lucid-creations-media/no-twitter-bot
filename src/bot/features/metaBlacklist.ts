import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

feature.hears(
  /(facebook.com|meta.com|instagram.com|threads.net|whatsapp.com)/gi,
  logHandle("blacklist-detection-meta"),
  async (ctx: Context) => {
    const GROUP_IDS = process.env.GROUP_IDS
      ? process.env.GROUP_IDS.split(",")
      : undefined;

    if (ctx.chat && ctx.msg) {
      if (GROUP_IDS !== undefined) {
        const groupID = ctx.chat.id;
        const flag = GROUP_IDS.includes(`${groupID}`);
        const username = ctx.msg.from?.username;

        if (flag) {
          ctx.msg.delete();
          await ctx.reply(
            `@${username} Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`,
            { parse_mode: "MarkdownV2" }
          );
        }
      }

      if (!GROUP_IDS) {
        console.info("Group IDS:", process.env.GROUP_IDS);
        await ctx.reply(
          `There was a problem retrieving the whitelist\\. Check the env variables and try again\\.`,
          {
            parse_mode: "MarkdownV2",
            reply_parameters: { message_id: ctx.msg.message_id }
          }
        );
      }
    }
  }
);

export { composer as metaBlacklist };
