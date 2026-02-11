/* リモートコントロール送信用関数 */

import { Hono } from 'hono';

// ESP32が受け付ける有効なコマンド一覧
const VALID_COMMANDS = [
    'AIR_HOT',
    'AIR_COLD',
    'AIR_OFF',
    'AIR_HIGH',
    'LIGHT_ON',
    'LIGHT_OFF',
    'LIGHT_NIGHT',
] as const;

type ControlCommand = (typeof VALID_COMMANDS)[number];

export const controlSender = new Hono().post('/send', async (c) => {
    const { command } = await c.req.json<{ command: string }>();

    if (!command) {
        return c.json({ success: false, message: 'コマンドは必須です' }, 400);
    }

    if (!VALID_COMMANDS.includes(command as ControlCommand)) {
        return c.json({ success: false, message: '無効なコマンドです' }, 400);
    }

    const username = process.env.ADAFRUIT_IO_USERNAME;
    const aioKey = process.env.ADAFRUIT_IO_KEY;
    const feedKey = process.env.ADAFRUIT_FEED_KEY;
    const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`;

    if (!username || !aioKey) {
        return c.json({ success: false, message: 'MQTTエラーが発生しました' }, 500);
    }

    const adafruitBody = {
        value: command,
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AIO-Key': aioKey,
            },
            body: JSON.stringify(adafruitBody),
        });

        const resData = await res.json();

        if (res.ok) {
            return c.json(
                { success: true, message: 'コントロール信号を送信しました！', data: resData },
                200
            );
        } else {
            return c.json({ success: false, message: `送信に失敗しました: ${resData}` });
        }
    } catch (error) {
        return c.json({ success: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
