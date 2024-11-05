import _ from 'lodash';
import googleTranslate from 'google-translate-api-x';
import BaiduTranslate from 'baidu-translate';
import settings from '../../settings.js';

const translator = String(settings.translator).toLowerCase();
const preferred_lang = String(settings.language).toLowerCase();

async function translate(message, opts) {
    if (translator === 'baidu') {
        const baiduTranslate = BaiduTranslate(settings.baiduTranslate.appid, settings.baiduTranslate.secret, opts.to);
        const trans_result = await baiduTranslate(message);
        return { text: _.get(trans_result, 'trans_result[0].dst', message) };
    }

    return await googleTranslate(message, opts);
}

export async function handleTranslation(message) {
    if (preferred_lang === 'en' || preferred_lang === 'english')
        return message;
    try {
        const translation = await translate(message, { to: preferred_lang });
        return translation.text || message;
    } catch (error) {
        console.error('Error translating message:', error);
        return message;
    }
}

export async function handleEnglishTranslation(message) {
    if (preferred_lang === 'en' || preferred_lang === 'english')
        return message;
    try {
        const translation = await translate(message, { to: 'english' });
        return translation.text || message;
    } catch (error) {
        console.error('Error translating message:', error);
        return message;
    }
}
