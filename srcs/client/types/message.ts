import type { Prisma } from '@prisma/client';

const fullMessageInclude = {
  profiles: true,
} satisfies Prisma.messagesInclude;

type ChatMessage = Prisma.messagesGetPayload<{
  include: typeof fullMessageInclude;
}>;

export { type ChatMessage, fullMessageInclude };
