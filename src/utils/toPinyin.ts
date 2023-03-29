import pinyin from 'pinyin';

export const toPinyin = (text: string) => {
    const pinyinText = pinyin(text, {
        style: pinyin.STYLE_NORMAL, // 拼音风格，可选值：STYLE_NORMAL（普通风格）、STYLE_TONE（声调风格）、STYLE_FIRST_LETTER（首字母风格）
        heteronym: false // 是否启用多音字模式
    }).join('').replace(/·/g, '');
    return pinyinText
}