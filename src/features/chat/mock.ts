import { ChatMessage, Conversation, IStorage, MessageContentType, MessageDirection, MessageStatus, Participant, User } from "@chatscope/use-chat";
import { ConversationData, IMessage } from "./types";

const elonMarkAndMeMessages: IMessage[] = [
  {
    id: "1",
    conversationId: "2",
    from: "2",
    text: "Hi, Joshua!",
    createdAt: "2021-07-01T12:00:00.000Z",
  },
  {
    id: "2",
    conversationId: "2",
    from: "3",
    text: "Hello, Elon!",
    createdAt: "2021-07-01T12:01:00.000Z",
  },
  {
    id: "3",
    conversationId: "2",
    from: "1",
    text: "Hi, guys!",
    createdAt: "2021-07-01T12:02:00.000Z",
  },
  {
    id: "4",
    conversationId: "2",
    from: "1",
    text: "What's up?",
    createdAt: "2021-07-01T12:03:00.000Z",
  },
  {
    id: "5",
    conversationId: "2",
    from: "1",
    text: "We still need to talk about global digital detox?",
    createdAt: "2021-07-01T12:03:00.000Z",
  },
  {
    id: "6",
    conversationId: "2",
    from: "2",
    text: "Yeah, what're your plans?",
    createdAt: "2021-07-01T12:03:10.000Z",
  },
  {
    id: "7",
    conversationId: "2",
    from: "2",
    text: "I like the idea of a digital detox, but I don't think it's practical for most people. Consider the fact that most people have to use their phones for work and all",
    createdAt: "2021-07-01T12:03:10.000Z",
  },
  {
    id: "8",
    conversationId: "2",
    from: "2",
    text: "We need to find a way to make it easier for people to disconnect from their devices without having to give up their jobs or social lives.",
    createdAt: "2021-07-01T12:03:10.000Z",
  },
  {
    id: "9",
    conversationId: "2",
    from: "1",
    text: "Well there are better ways to atone for these inconveniences",
    createdAt: "2021-07-01T12:03:15.000Z",
  },
  {
    id: "10",
    conversationId: "2",
    from: "3",
    text: "You guys should just go straight to the point. This is about the Metaverse, right?",
    createdAt: "2021-07-01T12:03:20.000Z",
  },
  {
    id: "11",
    conversationId: "2",
    from: "3",
    text: "I can't make a product my conscience criticizes. I have a well funded team of expert researchers. We're looking for ways to balance the digital and real world",
    createdAt: "2021-07-01T12:03:20.000Z",
  },
  {
    id: "12",
    conversationId: "2",
    from: "3",
    text: "Of course, there has to be balance!",
    createdAt: "2021-07-01T12:03:21.000Z",
  },
  {
    id: "13",
    conversationId: "2",
    from: "1",
    text: "Don't take this too personal. Metaverse is part of our concerns, not entirely",
    createdAt: "2021-07-01T12:03:20.000Z",
  },
  {
    id: "14",
    conversationId: "2",
    from: "1",
    text: "Tims cook has to be here. Apple and their releases. Arghhh!",
    createdAt: "2021-07-01T12:03:21.000Z",
  },
  {
    id: "15",
    conversationId: "2",
    from: "2",
    text: "Hmmm",
    createdAt: "2021-07-01T12:03:22.000Z",
  }
]


export const seedStorage = (storage: IStorage) => {
  const joshua = new User({
    id: "1",
    username: "Joshua Nun"
  })

  const elon = new User({
    id: "2",
    username: "Elon Musk",
  })

  const mark = new User({
    id: "3",
    username: "Mark Zuckerberg",
  })

  const users = [joshua, elon, mark]
  for (const user of users) {
    storage.addUser(user)
  }

  storage.setCurrentUser(joshua)

  // create some conversations
  const conversations: Conversation<ConversationData>[] = [
    new Conversation({
      id: "1",
      participants: [
        new Participant({
          id: joshua.id,
        }),
        new Participant({
          id: elon.id,
        })
      ],
    }),
    new Conversation({
      id: "2",
      participants: [
        new Participant({
          id: elon.id,
        }),
        new Participant({
          id: mark.id,
        }),
      ],
      data: {
        name: "The Envoys",
        type: "group"
      }
    }),
  ]

  conversations.forEach(c => {
    storage.addConversation(c)
  });
  
  elonMarkAndMeMessages.forEach(m => {
    storage.addMessage(new ChatMessage({
      direction: m.from === joshua.id ? MessageDirection.Outgoing : MessageDirection.Incoming,
      senderId: m.from,
      content: {
        content: m.text,
      },
      contentType: MessageContentType.TextMarkdown,
      status: MessageStatus.Sent,
      createdTime: new Date(m.createdAt),
      id: m.id,
    }), m.conversationId, false)
  })
}