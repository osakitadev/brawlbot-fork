const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require('discord.js')

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('fetchtip')
        .setDescription('Gets specified tip from tips channel')
        .addIntegerOption((option) =>
            option
                .setName('number')
                .setDescription('The tip number to fetch')
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to mention with the tip')
                .setRequired(false)
        ),

    async execute(interaction) {
        const allowedChannels = ['1163131511076311080', '1163131481720369324']
        if (!allowedChannels.includes(interaction.channelId)) {
            return interaction.reply({
                content: 'This command can only be used in specific channels.',
                ephemeral: true,
            })
        }

        const tipNumber = interaction.options.getInteger('number')
        const mentionedUser = interaction.options.getUser('user')

        const tipsChannel = await interaction.client.channels.fetch(
            '1246521455173173300'
        )

        if (!tipsChannel) {
            return interaction.reply({
                content: 'Tips channel not found or invalid.',
                ephemeral: true,
            })
        }

        try {
            const messages = await tipsChannel.messages.fetch({ limit: 100 })
            const tipMessage = messages.find((msg) =>
                msg.content.toLowerCase().startsWith(`# tip ${tipNumber}:`)
            )

            if (!tipMessage) {
                return interaction.reply({
                    content: `Tip ${tipNumber} not found.`,
                    ephemeral: true,
                })
            }

            const tipContent = tipMessage.content
                .split('\n')
                .slice(1)
                .join('\n')
            const replyContent = mentionedUser
                ? `${mentionedUser}, here's Tip ${tipNumber}:\n\n${tipContent}`
                : `### Tip ${tipNumber}:\n\n${tipContent}`

            await interaction.reply(replyContent)
        } catch (error) {
            console.error('Error fetching tip:', error)
            await interaction.reply({
                content: 'An error occurred while fetching the tip.',
                ephemeral: true,
            })
        }
    },
}
