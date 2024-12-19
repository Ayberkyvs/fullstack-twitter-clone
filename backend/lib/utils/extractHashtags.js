export const extractHashtags = (text) => {
    if (!text) return [];
    const regex = /#([\wçşüöğıİ]+)/g;
    const hashtags = new Set();
    let match;
    while ((match = regex.exec(text)) !== null) {
        hashtags.add(match[1]);
    }
    return Array.from(hashtags);
};
