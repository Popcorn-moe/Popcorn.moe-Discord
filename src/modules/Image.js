import command from '../decorators/command';
import { embeds, members, load, randomIn } from '../utils';
import { RichEmbed } from 'discord.js';

const { category, commands } = load('Image.json');

const COMMAND_MATCH = '^$command(?: <@!?(\\d+)>)?';

export default class Image {
	constructor() {
		this.category = category;

		this.setup();
	}

	setup() {
		Object.entries(commands).forEach(([name, cmd]) => this.setupOne(name, cmd));
	}

	setupOne(name, { desc, msg, gifs }) {
		const regex = new RegExp(COMMAND_MATCH.replace('$command', name), 'i');

		const value = (message, mention) => {
			const { member, guild } = message;

			return Promise.all([
				message.delete(),
				this.response(
					message,
					msg,
					gifs,
					mention ? message.member : message.guild.me,
					mention ? message.guild.members.get(mention) : message.member
				)
			]);
		};

		command(regex, { name, desc, usage: '[utilisateur]' })(this, name, {
			value
		});
	}

	response(message, msg, gifs, from, to) {
		if (!to) {
			const embed = embeds.err('Aucun utilisateur trouvé 😭');

			return message.channel
				.send({ embed })
				.then(message => embeds.timeDelete(message));
		}

		const send = msg
			.replace('{0}', from.displayName)
			.replace('{1}', to.displayName);

		const embed = new RichEmbed()
			.setTitle(send)
			.setColor(0x00ae86)
			.setImage(randomIn(gifs));

		return message.channel.send({ embed });
	}
}