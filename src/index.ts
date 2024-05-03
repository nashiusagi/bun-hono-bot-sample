import { Hono } from "hono";
import { useFetch } from "./lib/useFetch";
import { useParser } from "./lib/useParser";

const app = new Hono<{ Bindings: Bindings }>();

const targetUrl = "https://github.com/trending/typescript?since=daily"

app.get("/", async (c) => {
	const result = await useFetch({
		url: targetUrl,
		options: {},
	});

	const body = String(result);
	const repos = {
		articles: await useParser(body)
	}
	const attachment: Attachment = {
		title: "Cloudflare Workers Cron Trigger",
		text: JSON.stringify(repos),
		author_name: "workers-slack",
		color: "#00FF00",
	};

	const payload: Payload = {
		channel: c.env.SLACK_BOT_ACCESS_CHANNEL,
		attachments: [attachment],
	};

	await useFetch({
		url: "https://slack.com/api/chat.postMessage",
		options: {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${c.env.SLACK_BOT_ACCESS_TOKEN}`,
				Accept: "application/json",
			},
		},
	});

	return c.text(JSON.stringify(repos));
});

export default app;
