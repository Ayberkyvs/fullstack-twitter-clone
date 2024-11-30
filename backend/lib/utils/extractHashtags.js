export const extractHashtags = (text) => {
    if (!text) return [];
    const regex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        hashtags.push(match[1]);
    }
    return hashtags;
} ;