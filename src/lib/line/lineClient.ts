import line from "@line/bot-sdk";

const {Client} = line;

let LINE_CHANNEL_ACCESS_TOKEN: string;
let LINE_CHANNEL_SECRET: string;

if (process.env.NODE_ENV === 'production') {
    // For production
    LINE_CHANNEL_ACCESS_TOKEN = String(process.env.LINE_CHANNEL_ACCESS_TOKEN);
    LINE_CHANNEL_SECRET = String(process.env.LINE_CHANNEL_SECRET);
} else {
    // For development
    LINE_CHANNEL_ACCESS_TOKEN = import.meta.env.VITE_LINE_CHANNEL_ACCESS_TOKEN;
    LINE_CHANNEL_SECRET = import.meta.env.VITE_LINE_CHANNEL_SECRET;
}

if (!LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error(
        'Please define the LINE_CHANNEL_ACCESS_TOKEN environment variable inside .env'
    )
}

if (!LINE_CHANNEL_SECRET) {
    throw new Error(
        'Please define the LINE_CHANNEL_SECRET environment variable inside .env'
    )
}

const config = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN, // add your channel access token
    channelSecret: LINE_CHANNEL_SECRET, // add your channel secret
};

const client = new Client(config);

export default client;
