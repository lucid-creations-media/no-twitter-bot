import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import metaLinkCheck from "#root/lib/metaLinkCheck.js";
import twitterLinkCheck from "#root/lib/twitterLinkCheck.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["group", "supergroup"]);

/**
 * What triggers this feature and adds to the log when it has been triggered.
 * The trigger is anytime an embedded url is detected.
 */
feature.on("message::url", logHandle("embed-check"), async (ctx: Context) => {
  if (ctx.chat && ctx.msg) {
    // Pulling the group IDs from the env variables.
    const GROUP_IDS = process.env.GROUP_IDS
      ? process.env.GROUP_IDS.split(",")
      : undefined;

    if (ctx.chat && ctx.msg) {
      if (GROUP_IDS !== undefined) {
        // Checking if the message is from a whitelisted group.
        const groupID = ctx.chat.id;
        const flag = GROUP_IDS.includes(`${groupID}`);
        const username = ctx.msg.from?.username;

        if (flag) {
          // Filters every message/caption entity that is a url into a new array.
          const embeds = ctx.msg.entities
            ? ctx.msg.entities.filter(e => e.type === "text_link")
            : null;
          const captionEmbeds = ctx.msg.caption_entities
            ? ctx.msg.caption_entities.filter(e => e.type === "text_link")
            : null;

          // If the caption embeds array isn't empty filter through them to check if any is a Twitter/X or Meta url.
          if (captionEmbeds !== null && captionEmbeds.length) {
            const metaLinks = captionEmbeds.filter(({ url }) =>
              metaLinkCheck(url)
            );
            const twitterLinks = captionEmbeds.filter(({ url }) =>
              twitterLinkCheck(url)
            );

            // Handle action and response if both meta and Twitter/X links are detected.
            if (metaLinks.length && twitterLinks.length) {
              // Deletes the offending message.
              ctx.msg.delete();
              // Replies to the user informing them of the action.
              return await ctx.reply(
                `@${username} Twitter and X links along with reformatting services for Twitter posts are not allowed here\\. Also Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.\n\nIf this was forwarded from a channel consider forwarding without the caption so the media isn't deleted\\.`,
                { parse_mode: "MarkdownV2" }
              );
            }

            // Handle action and response if only meta links are detected.
            if (metaLinks.length) {
              // Deletes the offending message.
              ctx.msg.delete();
              // Replies to the user informing them of the action.
              return await ctx.reply(
                `@${username} Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\\n\nIf this was forwarded from a channel consider forwarding without the caption so the media isn't deleted\\.`,
                { parse_mode: "MarkdownV2" }
              );
            }

            // Handle action and response if only Twitter/X links are detected.
            if (twitterLinks.length) {
              // Deletes the offending message.
              ctx.msg.delete();
              // Replies to the user informing them of the action.
              return await ctx.reply(
                `@${username} Twitter and X links along with reformatting services for Twitter posts are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.\n\nIf this was forwarded from a channel consider forwarding without the caption so the media isn't deleted\\.`,
                { parse_mode: "MarkdownV2" }
              );
            }
          }
          // If the embeds array isn't empty filter through them to check if any is a Twitter/X or Meta url.
          if (embeds !== null && embeds.length) {
            const metaLinks = embeds.filter(({ url }) => metaLinkCheck(url));
            const twitterLinks = embeds.filter(({ url }) =>
              twitterLinkCheck(url)
            );

            // Handle action and response if both meta and Twitter/X links are detected.
            if (metaLinks.length && twitterLinks.length) {
              // Deletes the offending message.
              ctx.msg.delete();
              // Replies to the user informing them of the action.
              return await ctx.reply(
                `@${username} Twitter and X links along with reformatting services for Twitter posts are not allowed here\\. Also Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`,
                { parse_mode: "MarkdownV2" }
              );
            }

            // Handle action and response if only meta links are detected.
            if (metaLinks.length) {
              // Deletes the offending message.
              ctx.msg.delete();
              // Replies to the user informing them of the action.
              return await ctx.reply(
                `@${username} Facebook and meta links along with with links to meta\\-owned services are not allowed here\\. Please consider sharing the media directly or from other social media sources or websites\\. No administration action was taken against you other than the message being deleted\\.`,
                { parse_mode: "MarkdownV2" }
              );
            }

            // Handle action and response if only Twitter/X links are detected.
            if (twitterLinks.length) {
              // Deletes the offending message.
              ctx.msg.delete();
              // Replies to the user informing them of the action.
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
});

export { composer as embedCheck };
