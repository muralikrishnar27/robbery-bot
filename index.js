require('http').createServer((req, res) => {
    res.write("Bot is alive");
    res.end();
}).listen(3000);
const { 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    REST, 
    Routes,
    EmbedBuilder
} = require('discord.js');

// 🔒 PUT YOUR NEW TOKEN AFTER RESETTING IT
const token = process.env.TOKEN;
const clientId = '1477338405540204564';
const guildId = '1460878532891643938';
const robberyChannelId = '1477349834124955758';

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ------------------
// SLASH COMMAND
// ------------------

const commands = [
    new SlashCommandBuilder()
        .setName('log')
        .setDescription('Log a robbery')

        .addStringOption(option =>
            option.setName('robbers')
                .setDescription('Names of robbers')
                .setRequired(true)
        )

        .addStringOption(option =>
            option.setName('robbery_type')
                .setDescription('Select robbery type')
                .setRequired(true)
                .addChoices(
                    { name: 'AMMUNATION Robbery', value: 'AMMUNATION Robbery' },
                    { name: 'STORE Robbery', value: 'STORE Robbery' },
                    { name: 'JEWELRY Robbery', value: 'JEWELRY Robbery' },
                    { name: 'FLECA Robbery', value: 'FLECA Robbery' },
                    { name: 'ATM Robbery', value: 'ATM Robbery' },
                    { name: 'OIL RIG Robbery', value: 'OIL RIG Robbery' },
                    { name: 'PACIFIC Robbery', value: 'PACIFIC Robbery' },
                    { name: 'MICHEAL HOUSE Robbery', value: 'MICHEAL HOUSE Robbery' },
                    { name: 'SHOOT OUT Robbery', value: 'SHOOT OUT Robbery' }
                )
        )

        .addStringOption(option =>
            option.setName('gun_used')
                .setDescription('Select gun used')
                .setRequired(true)
                .addChoices(
                    { name: 'ZETA Pistol', value: 'ZETA Pistol' },
                    { name: 'SMG', value: 'SMG' },
                    { name: 'AR', value: 'AR' },
                    { name: 'No Gun Used', value: 'No Gun Used' }
                )
        )

        .addStringOption(option =>
            option.setName('status')
                .setDescription('Select robbery status')
                .setRequired(true)
                .addChoices(
                    { name: '✅ Success', value: 'Success' },
                    { name: '❌ Failure', value: 'Failure' }
                )
        )

        .toJSON()
];

// ------------------
// REGISTER COMMAND
// ------------------

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('✅ Slash command registered.');
    } catch (error) {
        console.error(error);
    }
})();

// ------------------
// COMMAND HANDLER
// ------------------

client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'log') {

        await interaction.deferReply({ ephemeral: true });

        try {
            const robbers = interaction.options.getString('robbers');
            const robberyType = interaction.options.getString('robbery_type');
            const gunUsed = interaction.options.getString('gun_used');
            const status = interaction.options.getString('status');

            const robberyChannel = await client.channels.fetch(robberyChannelId);

            const embed = new EmbedBuilder()
                .setTitle('🚨 Robbery Log')
                .setColor(status === 'Success' ? 0x00ff00 : 0xff0000)
                .addFields(
                    { name: 'Robbers', value: robbers },
                    { name: 'Robbery Type', value: robberyType },
                    { name: 'Gun Used', value: gunUsed },
                    { name: 'Status', value: status }
                )
                .setTimestamp();

            await robberyChannel.send({ embeds: [embed] });

            await interaction.editReply({
                content: '✅ Robbery log sent to robbery channel.'
            });

        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: '❌ Something went wrong.'
            });
        }
    }
});

client.login(token);