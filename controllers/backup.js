const {
    Client,
    LocalAuth
} = require('whatsapp-web.js');
const readline = require('readline');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const client = new Client({
    authStrategy: new LocalAuth()
});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


client.on('qr', (qr) => {
    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', () => {
    console.log('Ready bos....');
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    if (msg.body === '/info-bot') {

        await chat.sendMessage(`Halo @${contact.id.user}, bot ini dibuat oleh hermanto`, {
            mentions: [contact]
        });
    }

    if (msg.body === '/tag-all') {

        if (message.isGroupMsg) {
            // periksa apakah pesan mengandung teks '/tag-all'
            if (message.body.toLowerCase() === '/tag-all') {
                // panggil fungsi tagAllMembers untuk menandai semua anggota di grup
                await tagAllMembers(message.chat.id._serialized);
            }
        }
    }

    // try {
    //     // Mencoba untuk mengevaluasi ekspresi yang dimasukkan oleh pengguna
    //     const hasil = eval(msg.body);
    //     await chat.sendMessage(`Hasilnya adalah: ${hasil} `, {
    //         mentions: [contact]
    //     });
    //     rl.close();
    // } catch (e) {
    //     console.log(e);
    //     rl.close();
    // }

});

// client.on('message', async (msg) => {
//     const chat = await msg.getChat();
//     const contact = await msg.getContact();
//     console.log('human :'+msg.body);
//     axios.post('https://api.simsimi.vn/v1/simtalk', {
//             text: msg.body,
//             lc: 'id',
//             key: ''
//         }, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         })
//         .then(function (response) {
//             chat.sendMessage(response.data.message, {
//                 mentions: [contact]
//             });
//             console.log('bot :'+response.data.message);
//         })
//         .catch(function (error) {
//             console.error(error);
//         });
// });


client.initialize();

const api = async (req, res) => {
    let nohp = req.query.nohp || req.body.nohp;
    const pesan = req.query.pesan || req.body.pesan;

    try {
        if (nohp.startsWith("0")) {
            nohp = "62" + nohp.slice(1) + "@c.us";
        } else if (nohp.startsWith("62")) {
            nohp = nohp + "@c.us";
        } else {
            nohp = "62" + nohp + "@c.us";
        }

        const user = await client.isRegisteredUser(nohp);
        if (user) {
            client.sendMessage(nohp, pesan);
            res.json({
                status: "success",
                pesan
            });
        } else {
            res.json({
                status: "failed",
                pesan: "Nomor tidak terdaftar"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            pesan: "Internal Server Error"
        });
    }
}

module.exports = api;