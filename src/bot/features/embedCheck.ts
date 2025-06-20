import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

feature.on(
  "message:entities:url",
  logHandle("embed-check"),
  async (ctx: Context) => {
    if (ctx.chat && ctx.msg) {
      const GROUP_IDS = process.env.GROUP_IDS
        ? process.env.GROUP_IDS.split(",")
        : undefined;

      if (ctx.chat && ctx.msg) {
        if (GROUP_IDS !== undefined) {
          const groupID = ctx.chat.id;
          const flag = GROUP_IDS.includes(`${groupID}`);
          const username = ctx.msg.from?.username;

          if (flag && ctx.msg.entities) {
            const embeds = ctx.msg.entities.filter(e => e.type === "text_link");

            if (embeds.length) {
              const metaLinks = embeds.filter(({ url }) =>
                url.match(
                  /(facebook.com|meta.com|instagram.com|threads.net|whatsapp.com)/gi
                )
              );
              const twitterLinks = embeds.filter(({ url }) =>
                url.match(/(x.com|twitter.com)/gi)
              );

              if (metaLinks.length && twitterLinks.length) {
                ctx.msg.delete();
                return await ctx.reply(
                  `@${username} Twitter and X links along with reformatting services for Twitter posts are not allowed here\\. Also Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`,
                  { parse_mode: "MarkdownV2" }
                );
              }

              if (metaLinks.length) {
                ctx.msg.delete();
                return await ctx.reply(
                  `@${username} Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`,
                  { parse_mode: "MarkdownV2" }
                );
              }

              if (twitterLinks.length) {
                ctx.msg.delete();
                return await ctx.reply(
                  `@${username} Twitter and X links along with reformatting services for Twitter posts are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`,
                  { parse_mode: "MarkdownV2" }
                );
              }
            }
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
  }
);

export { composer as embedCheck };
