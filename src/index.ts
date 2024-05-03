import { Hono } from "hono";
import { useFetch } from "./lib/useFetch";
import { useParser } from "./lib/useParser";

const app = new Hono<{ Bindings: Bindings }>();

const targetUrl = "https://github.com/trending/typescript?since=daily"

const feeding = async (slackBotToken: string, slackBotTargetChannelName: string) => {
	const result = await useFetch({
		url: targetUrl,
		options: {},
	});

	const body = String(result);
	const repos = {
		articles: await useParser(body)
	}
	const attachment: Attachment = {
		title: "GitHub Trending [ TypeScript ] ",
		text: JSON.stringify(repos),
		author_name: "GitHub Trending Feeder",
		color: "#00FF00",
	};

	const payload: Payload = {
		channel: slackBotTargetChannelName,
		attachments: [attachment],
	};

	await useFetch({
		url: "https://slack.com/api/chat.postMessage",
		options: {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${slackBotToken}`,
				Accept: "application/json",
			},
		},
	});
}

app.get("/", async(c) => {
	await feeding(c.env.SLACK_BOT_ACCESS_TOKEN, c.env.SLACK_BOT_ACCESS_CHANNEL)

	return c.text("feeding done!");	
})

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (_, env, ctx) => {
	ctx.waitUntil(feeding(env.SLACK_BOT_ACCESS_TOKEN, env.SLACK_BOT_ACCESS_CHANNEL))
}
	

export default {
	fetch: app.fetch,
	scheduled
};
