import { Hono } from "hono";
import { useFetch } from "./lib/useFetch";

type Bindings = {
	SLACK_BOT_ACCESS_TOKEN: string;
	SLACK_BOT_ACCESS_CHANNEL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
	const result = await useFetch({
		url: "http://api.randomuser.me/",
		options: {},
	});

	const body = JSON.stringify(result);

	const payload = {
		channel: c.env.SLACK_BOT_ACCESS_CHANNEL,
		attachments: [
			{
				title: "Cloudflare Workers Cron Trigger",
				text: body,
				author_name: "workers-slack",
				color: "#00FF00",
			},
		],
	};

	await useFetch({
		url: "https://slack.com/api/chat.postMessage",
		options: {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Content-Length": payload.length,
				Authorization: `Bearer ${c.env.SLACK_BOT_ACCESS_TOKEN}`,
				Accept: "application/json",
			},
		},
	});

	return c.text(body);
});

export default app;
