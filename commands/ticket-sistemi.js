const { Client, SlashCommandBuilder, EmbedBuilder,PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-sistemi')
        .setDescription('Ticket sistemini kurarsın')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Ticket mesajı hangi kanalda olsun?')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('kategori')
                .setDescription('Ticketler hangi kategoride açılsın?')
                .setRequired(true)
    ),

    run: async (client, interaction, args) => {

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "Bu komutu kullanmak için 'Kanalları Yönet' yetkisine sahip olmalısınız.", ephemeral: true });
        }

        const data = interaction.options.getChannel("kanal");
        const data2 = interaction.options.getChannel("kategori")

        const kanal = interaction.guild.channels.cache.get(`${data.id}`);
        const kategori = interaction.guild.channels.cache.get(`${data2.id}`)

        if (!kanal.viewable) {
            return interaction.reply({
                content: "Belirledigin kanalı göremiyorum !",
                ephemeral: true
            })
        }

        if (kategori.type !== ChannelType.GuildCategory) {
            return interaction.reply({
                content: "Seçtiğiniz kategori geçersiz !",
                ephemeral: true
            })
        }

        if (!kategori.viewable) {
            return interaction.reply({
                content: "Belirledigin kategoriyi göremiyorum !",
                ephemeral: true
            })
        }

        if (!kategori.permissionsFor(client.user.id).has("ManageChannels")) {
            return interaction.reply({
                content: "Ticket kanalı oluşturmak için kanalları yönetme yetkisine sahip değilim.",
                ephemeral: true
            })
        }

        
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`ticket-setup-${interaction.guild.id}-${kategori.id}`)
                    .setLabel('Ticket Oluştur')
                    .setStyle(ButtonStyle.Danger),
        );
        const embed = new EmbedBuilder()
            .setTitle('Ticket')
            .setDescription('Merhabalar, Bu Bot **Anistyle** Tarafından Özel Yapılmış, bir bottur. butona tıklayarak talep açabilirsiniz!');

        await interaction.reply({
            content: `Ticket sistemi başarıyla ${kanal} kanalına kuruldu.`,
            ephemeral: true
        })

        kanal.send({
            components: [button],
            embeds: [embed]
        })
    }
}