type Bindings = {
	SLACK_BOT_ACCESS_TOKEN: string;
	SLACK_BOT_ACCESS_CHANNEL: string;
};

type Attachment = {
	title: string;
	text: string;
	author_name: string;
	color: string;
};

type Payload = {
	channel: string;
	attachments: Attachment[];
};
