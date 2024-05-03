import { Hono } from "hono";
import { useFetch } from "./lib/useFetch";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
	const result = await useFetch({
		url: "http://api.randomuser.me/",
		options: {},
	});

	const body = JSON.stringify(result);
	const attachment: Attachment = {
		title: "Cloudflare Workers Cron Trigger",
		text: body,
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

	return c.text(body);
});

export default app;
