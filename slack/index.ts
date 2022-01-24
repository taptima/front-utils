/**
 * This util is for sending error reports to Slack messenger.
 *
 * You need to add this fields .env.template and fill it in .env:
 * NEXT_STATIC_SLACK_API_TOKEN=
 * NEXT_STATIC_SLACK_API_CHANNEL=
 *
 * Install slack: yarn add slack
 *
 * Add following function in util/Logger
 * (replace "async function ..." with "static async ...")
 * */

export type AdditionalInfoT = {
	title: string;
	value?: string;
};

async function sendErrorReportToSlack(
	title: string,
	route: string,
	error?: Error | null,
	additional?: AdditionalInfoT[],
): Promise<void> {
	if (
		!process.env.NEXT_STATIC_SLACK_API_TOKEN ||
		!process.env.NEXT_STATIC_SLACK_API_CHANNEL
	) {
		return;
	}

	try {
		let fields = [
			{ title: 'Message', value: error?.message, short: false },
			{ title: 'Error stacktrace', value: error?.stack, short: true },
		];

		if (additional) {
			fields = fields.concat(
				additional.map(({ title: fieldTitle, value }) => ({
					value,
					title: fieldTitle,
					short: true,
				})),
			);
		}

		await slack.chat.postMessage({
			token: process.env.NEXT_STATIC_SLACK_API_TOKEN,
			channel: process.env.NEXT_STATIC_SLACK_API_CHANNEL,
			text: '',
			attachments: JSON.stringify([
				{
					color: '#00FF00',
					title,
					author_name: route,
					fields,
				},
			]),
			icon_emoji: ':skull_and_crossbones',
		});
	} catch {
	}
}