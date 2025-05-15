import { CommentCardProps, CommentPlatform } from "@/components/comments/CommentCard";

// Simple deterministic random number generator
const seedRandom = (seed: string): (() => number) => {
  let state = seed.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0);

  return () => {
    const x = Math.sin(state++) * 10000;
    return x - Math.floor(x);
  };
};

// Generate a random number between min and max (inclusive) with a seed
const randomInt = (min: number, max: number, random: () => number): number => {
  return Math.floor(random() * (max - min + 1)) + min;
};

// Generate timestamp within the last week with deterministic output
const randomTimestamp = (random: () => number): string => {
  // Generate a fixed timestamp for SSR consistency
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const randomOffset = Math.floor(random() * oneWeekMs);

  // Format as "X days/hours ago" in a deterministic way
  const diffInHours = Math.floor((oneWeekMs - randomOffset) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }
};

// Sample post data
const samplePosts = [
  {
    id: "post1",
    title: "How to increase your social media engagement in 2025",
    thumbnail: "https://picsum.photos/seed/post1/200/200",
  },
  {
    id: "post2",
    title: "Top 10 TikTok trends you need to know about",
    thumbnail: "https://picsum.photos/seed/post2/200/200",
  },
  {
    id: "post3",
    title: "The complete guide to Instagram analytics",
    thumbnail: "https://picsum.photos/seed/post3/200/200",
  },
  {
    id: "post4",
    title: "Content creation tools every creator should be using",
    thumbnail: "https://picsum.photos/seed/post4/200/200",
  },
];

// Sample comment content
const commentContents = [
  "Love this content! Very insightful and helpful.",
  "I've been following your channel for a while now, and I'm always impressed by the quality of your content. Keep up the great work!",
  "Could you do a video on social media trends for small businesses?",
  "This is exactly what I needed to hear today. Thank you for sharing your expertise!",
  "I disagree with some points here. In my experience, focusing on engagement rather than followers has been more effective.",
  "First time watching your content and I'm already a fan. Subscribed!",
  "Can you explain more about the algorithm changes you mentioned? I'm confused about how they impact reach.",
  "This video changed my entire social media strategy. I've already seen a 20% increase in engagement.",
  "Great tips! I implemented these strategies last month and my account has grown significantly.",
  "Interesting perspective. I think there's definitely a balance between focusing on trends and staying authentic to your brand.",
  "I've been struggling with content creation burnout. Any advice on how to stay consistent without burning out?",
  "What tools do you recommend for scheduling posts across multiple platforms?",
  "Your content is always so practical and actionable. I appreciate that you don't just give vague advice.",
  "This is good advice for larger accounts, but what about those of us just starting out with zero followers?",
  "Thanks for addressing the recent platform changes. It's been confusing trying to adapt my strategy.",
];

// Sample names
const firstNames = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "Elijah",
  "Sophia",
  "Lucas",
  "Isabella",
  "Mason",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];

// Generate avatar URL with fixed seed
const getAvatar = (name: string): string => {
  // Use a fixed seed for deterministic rendering
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
};

// Simple deterministic UUID-like generator
const generateDeterministicId = (seed: string): string => {
  const random = seedRandom(seed);
  const segments = [8, 4, 4, 4, 12]; // uuid-like format

  return segments
    .map((length) => {
      let result = "";
      const characters = "abcdef0123456789";

      for (let i = 0; i < length; i++) {
        const index = Math.floor(random() * characters.length);
        result += characters.charAt(index);
      }

      return result;
    })
    .join("-");
};

// Generate a deterministic comment with a seed
const generateComment = (id: string): CommentCardProps => {
  const random = seedRandom(id);

  const firstNameIndex = randomInt(0, firstNames.length - 1, random);
  const lastNameIndex = randomInt(0, lastNames.length - 1, random);
  const firstName = firstNames[firstNameIndex];
  const lastName = lastNames[lastNameIndex];
  const fullName = `${firstName} ${lastName}`;

  // Deterministic platform selection
  const platformIndex = randomInt(0, 2, random);
  const platform: CommentPlatform =
    platformIndex === 0 ? "youtube" : platformIndex === 1 ? "instagram" : "twitter";

  const contentIndex = randomInt(0, commentContents.length - 1, random);
  const content = commentContents[contentIndex] || "Nice post!";

  // Post preview - deterministically added
  const hasPostPreview = random() > 0.5;
  const postPreview = hasPostPreview
    ? (() => {
        // Ensure we pick a valid post by clamping the index
        const postIndex = Math.min(
          randomInt(0, samplePosts.length - 1, random),
          samplePosts.length - 1
        );
        const selectedPost = samplePosts[postIndex];
        return selectedPost
          ? {
              title: selectedPost.title,
              thumbnail: selectedPost.thumbnail,
            }
          : undefined;
      })()
    : undefined;

  const isFlagged = random() > 0.85;
  const attentionValue = randomInt(0, 2, random);
  const hasAttention = attentionValue === 0 ? "none" : attentionValue === 1 ? "high" : "warning";

  return {
    id,
    author: {
      name: fullName,
      avatar: getAvatar(fullName),
    },
    content,
    platform,
    postPreview,
    metadata: {
      likes: randomInt(0, 500, random),
      replies: randomInt(0, 20, random),
      timestamp: randomTimestamp(random),
    },
    isFlagged,
    isSelected: false,
    isExpanded: false,
    hasAttention,
  };
};

// Generate a set of mock comments with deterministic values
export const generateMockComments = (
  count: number = 20,
  baseSeed: string = "fixed-seed"
): CommentCardProps[] => {
  const comments: CommentCardProps[] = [];

  for (let i = 0; i < count; i++) {
    // Create a unique ID for each comment
    const uniqueId = generateDeterministicId(`${baseSeed}-${i}`);
    comments.push(generateComment(uniqueId));
  }

  return comments;
};

// Generate replies for a comment with deterministic values
export const generateMockReplies = (
  commentId: string,
  count: number = 0
): Omit<CommentCardProps, "onSelect">[] => {
  const random = seedRandom(commentId + "-replies");

  if (count === 0) {
    count = randomInt(1, 5, random);
  }

  const replies: Omit<CommentCardProps, "onSelect">[] = [];

  for (let i = 0; i < count; i++) {
    // Create unique IDs for reply comments as well
    const replyId = generateDeterministicId(`${commentId}-reply-${i}`);
    const reply = generateComment(replyId);
    // Replies should not have their own replies
    reply.metadata.replies = 0;
    replies.push(reply);
  }

  return replies;
};

// Initial mock data with fixed seed for consistent SSR/client rendering
export const mockComments = generateMockComments(20, "initial-comments");
export const mockRepliesMap: Record<string, Omit<CommentCardProps, "onSelect">[]> = {};

// Generate replies for some comments
mockComments.forEach((comment) => {
  if (comment.metadata.replies > 0) {
    mockRepliesMap[comment.id] = generateMockReplies(comment.id, comment.metadata.replies);
  }
});
