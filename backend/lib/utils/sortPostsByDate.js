export const sortPostsByDate = (posts) => {
  return posts.sort((a, b) => {
    const dateA = a.repostedAt || a.createdAt;
    const dateB = b.repostedAt || b.createdAt;
    return new Date(dateB) - new Date(dateA);
  });
};
