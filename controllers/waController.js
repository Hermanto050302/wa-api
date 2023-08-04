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

client.initialize();

const api = async (req, res) => {
    let nohp = req.query.nohp || req.body.nohp;
    const pesan = req.query.pesan || req.body.pesan;

    if (!nohp || !pesan) {
        return res.status(400).json({
            status: "failed",
            pesan: "Parameter 'nohp' dan 'pesan' harus diisi."
        });
    }

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