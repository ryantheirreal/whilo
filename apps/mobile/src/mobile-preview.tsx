import {
  ArrowLeft,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  EllipsisVertical,
  Globe2,
  Mail,
  Mic,
  Phone,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button, Card, colors, Mascot, s } from "./ui";

type Agent = {
  id: string;
  name: string;
  role: string;
  tone: string;
  last: string;
  unread: number;
  avatar: "sky" | "sand" | "lilac";
};
type Message = {
  id: string;
  from: "user" | "agent";
  text: string;
  time: string;
  tool?: "mail" | "travel" | "purchase";
};
type Session = { id: string; title: string; agentId: string; messages: Message[] };

const agents: Agent[] = [
  {
    id: "whilo",
    name: "Whilo",
    role: "Personal agent",
    tone: "#DDEEF8",
    last: "I’m ready when you are.",
    unread: 0,
    avatar: "sky",
  },
  {
    id: "travel",
    name: "Atlas",
    role: "Travel planner",
    tone: "#DDF0E5",
    last: "I found 3 calm options for Lisboa.",
    unread: 2,
    avatar: "sand",
  },
  {
    id: "inbox",
    name: "Milo",
    role: "Inbox & email",
    tone: "#EEE4F8",
    last: "Your shortlist is ready to review.",
    unread: 1,
    avatar: "lilac",
  },
  {
    id: "scout",
    name: "Scout",
    role: "Research & web",
    tone: "#FFF0D9",
    last: "I’m watching that page for you.",
    unread: 0,
    avatar: "sand",
  },
];
const initialMessages: Message[] = [
  {
    id: "m1",
    from: "agent",
    text: "Hey — I’m Whilo. Think of me as the calm layer between what you mean and what needs doing.",
    time: "09:41",
  },
  {
    id: "m2",
    from: "agent",
    text: "I can plan your day, work with your apps, compare trips, or prepare an action for your approval.",
    time: "09:41",
  },
  { id: "m3", from: "user", text: "What can you help me with today?", time: "09:42" },
  {
    id: "m4",
    from: "agent",
    text: "A lot. Start with one of these and I’ll keep the thread moving.",
    time: "09:42",
  },
];

export function MobileChatPreview() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: "main", title: "Main conversation", agentId: "whilo", messages: initialMessages },
  ]);
  const [selectedId, setSelectedId] = useState("main");
  const [agentId, setAgentId] = useState("whilo");
  const [draft, setDraft] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [agentPicker, setAgentPicker] = useState(false);
  const [call, setCall] = useState(false);
  const [toast, setToast] = useState("");
  const session = sessions.find((x) => x.id === selectedId) || sessions[0];
  const agent = agents.find((x) => x.id === agentId) || agents[0];
  const activeMessages = session.messages;
  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2400);
  };
  const selectAgent = (next: Agent) => {
    const existing = sessions.find((x) => x.agentId === next.id);
    if (existing) setSelectedId(existing.id);
    else {
      const fresh = {
        id: `${next.id}-${Date.now()}`,
        title: `Chat with ${next.name}`,
        agentId: next.id,
        messages: [
          {
            id: `welcome-${Date.now()}`,
            from: "agent" as const,
            text: `Hi, I’m ${next.name}. ${next.role} is my thing. What should we work on?`,
            time: "now",
          },
        ],
      };
      setSessions((old) => [...old, fresh]);
      setSelectedId(fresh.id);
    }
    setAgentId(next.id);
    setAgentPicker(false);
    setDrawer(false);
  };
  const newSession = () => {
    const fresh = {
      id: `session-${Date.now()}`,
      title: "New conversation",
      agentId,
      messages: [
        {
          id: `welcome-${Date.now()}`,
          from: "agent" as const,
          text: `New thread started with ${agent.name}. I’ll keep this context separate.`,
          time: "now",
        },
      ],
    };
    setSessions((old) => [...old, fresh]);
    setSelectedId(fresh.id);
    setDrawer(false);
    notify("New conversation created");
  };
  const answerFor = (text: string): Message => {
    const lower = text.toLowerCase();
    if (lower.includes("email") || lower.includes("e-mail"))
      return {
        id: `a-${Date.now()}`,
        from: "agent",
        text: "I prepared the email. I’ll show the exact recipient, subject and body before anything is sent.",
        time: "now",
        tool: "mail",
      };
    if (lower.includes("compr") || lower.includes("buy") || lower.includes("pagamento"))
      return {
        id: `a-${Date.now()}`,
        from: "agent",
        text: "I found a checkout path. The total is visible and payment stays blocked until you approve it.",
        time: "now",
        tool: "purchase",
      };
    if (lower.includes("viagem") || lower.includes("trip") || lower.includes("lisboa"))
      return {
        id: `a-${Date.now()}`,
        from: "agent",
        text: "I’ll compare the trip first: price, timing, trade-offs and source links. No booking without you.",
        time: "now",
        tool: "travel",
      };
    return {
      id: `a-${Date.now()}`,
      from: "agent",
      text: "Got it. I’ll turn that into a small next step and keep the context in this conversation.",
      time: "now",
    };
  };
  const send = (value = draft) => {
    const text = value.trim();
    if (!text) return;
    const user: Message = { id: `u-${Date.now()}`, from: "user", text, time: "now" };
    const reply = answerFor(text);
    setSessions((old) =>
      old.map((x) => (x.id === selectedId ? { ...x, messages: [...x.messages, user, reply] } : x)),
    );
    setDraft("");
  };
  const quick = (text: string) => send(text);
  return (
    <View style={{ flex: 1, backgroundColor: "#F7FBFF" }}>
      <View
        style={{
          flex: 1,
          maxWidth: 620,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={[
            s.row,
            {
              paddingHorizontal: 17,
              paddingTop: 16,
              paddingBottom: 12,
              gap: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            },
          ]}
        >
          <Pressable
            onPress={() => setDrawer(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: agent.tone,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mascot size={28} variant={agent.avatar} />
          </Pressable>
          <Pressable onPress={() => setAgentPicker(true)} style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>
              {agent.name}
            </Text>
            <Text style={{ fontSize: 11, color: "#43815E", fontWeight: "700" }}>
              ● {agent.role} · online
            </Text>
          </Pressable>
          <Pressable onPress={() => setCall(true)} style={s.iconBox}>
            <Phone size={18} color={colors.blueDark} />
          </Pressable>
          <Pressable onPress={() => notify("Conversation actions opened")} style={s.iconBox}>
            <EllipsisVertical size={18} color={colors.muted} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 13, paddingBottom: 18 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: "center", gap: 7, paddingVertical: 8 }}>
            <Mascot size={55} variant={agent.avatar} />
            <Text style={{ fontWeight: "800", color: colors.text }}>{agent.name}</Text>
            <Text style={s.small}>{agent.role} · this conversation is private to this session</Text>
          </View>
          {activeMessages.map((message) => (
            <MessageBubble key={message.id} message={message} onAction={notify} />
          ))}
          <View style={{ gap: 8, marginTop: 8 }}>
            <Text style={[s.small, { fontWeight: "800", color: colors.muted }]}>TRY ASKING</Text>
            <View style={[s.row, { gap: 8, flexWrap: "wrap" }]}>
              {(agentId === "travel"
                ? ["Compare Lisboa flights", "Build an itinerary"]
                : agentId === "inbox"
                  ? ["Draft an email", "Summarize my inbox"]
                  : ["Plan my day", "Find a trip", "Prepare an email"]
              ).map((x) => (
                <Pressable
                  key={x}
                  onPress={() => quick(x)}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.line,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    borderRadius: 17,
                    backgroundColor: "#F7FBFF",
                  }}
                >
                  <Text style={{ color: colors.blueDark, fontSize: 12, fontWeight: "700" }}>
                    {x}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            padding: 10,
            paddingBottom: 14,
            borderTopWidth: 1,
            borderTopColor: colors.line,
            backgroundColor: "#FFF",
          }}
        >
          <View
            style={[s.row, { gap: 7, backgroundColor: "#F3F7FA", borderRadius: 24, padding: 6 }]}
          >
            <Pressable
              onPress={() => notify("Attachments are available in connected mode")}
              style={s.iconBox}
            >
              <Plus size={19} color={colors.muted} />
            </Pressable>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => send()}
              placeholder={`Message ${agent.name}…`}
              placeholderTextColor="#91A2AC"
              style={{
                flex: 1,
                color: colors.text,
                fontSize: 15,
                paddingHorizontal: 5,
                paddingVertical: 9,
              }}
            />
            <Pressable onPress={() => setCall(true)} style={s.iconBox}>
              <Mic size={18} color={colors.muted} />
            </Pressable>
            {draft.trim() ? (
              <Pressable
                onPress={() => send()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.blueDark,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send size={16} color="#FFF" />
              </Pressable>
            ) : null}
          </View>
          <Text style={{ textAlign: "center", color: colors.muted, fontSize: 10, marginTop: 7 }}>
            Whilo can use tools, but external actions always wait for your approval.
          </Text>
        </View>
      </View>
      {drawer && (
        <SessionDrawer
          sessions={sessions}
          selectedId={selectedId}
          agents={agents}
          close={() => setDrawer(false)}
          select={(id) => {
            const s = sessions.find((x) => x.id === id);
            if (s) {
              setSelectedId(id);
              setAgentId(s.agentId);
            }
            setDrawer(false);
          }}
          newSession={newSession}
          selectAgent={selectAgent}
        />
      )}
      {agentPicker && (
        <AgentPicker
          agents={agents}
          current={agentId}
          close={() => setAgentPicker(false)}
          select={selectAgent}
        />
      )}
      {call && <CallSheet agent={agent} close={() => setCall(false)} />}
      {toast ? (
        <View
          style={{
            position: "absolute",
            bottom: 88,
            alignSelf: "center",
            backgroundColor: colors.text,
            paddingHorizontal: 16,
            paddingVertical: 11,
            borderRadius: 18,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "700" }}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

function MessageBubble({ message, onAction }: { message: Message; onAction: (x: string) => void }) {
  const user = message.from === "user";
  return (
    <View style={{ alignSelf: user ? "flex-end" : "flex-start", maxWidth: "88%", gap: 6 }}>
      <View
        style={{
          backgroundColor: user ? colors.blueDark : "#F0F3F5",
          paddingHorizontal: 15,
          paddingVertical: 11,
          borderRadius: 20,
          borderBottomRightRadius: user ? 5 : 20,
          borderBottomLeftRadius: user ? 20 : 5,
        }}
      >
        <Text style={{ color: user ? "#FFF" : colors.text, fontSize: 15, lineHeight: 22 }}>
          {message.text}
        </Text>
        <Text
          style={{
            color: user ? "#DDEEF8" : colors.muted,
            fontSize: 10,
            marginTop: 5,
            textAlign: "right",
          }}
        >
          {message.time}
        </Text>
      </View>
      {message.tool === "mail" && (
        <ToolCard
          icon={Mail}
          title="Email draft ready"
          detail="Review recipient, subject and body"
          action="Review draft"
          onAction={onAction}
        />
      )}
      {message.tool === "travel" && (
        <ToolCard
          icon={Globe2}
          title="Trip comparison ready"
          detail="3 options · source links attached"
          action="Open comparison"
          onAction={onAction}
        />
      )}
      {message.tool === "purchase" && (
        <ToolCard
          icon={CircleDollarSign}
          title="Purchase handoff"
          detail="R$ 3.480 · approval required"
          action="Review safely"
          onAction={onAction}
        />
      )}
    </View>
  );
}
function ToolCard({
  icon: Icon,
  title,
  detail,
  action,
  onAction,
}: {
  icon: typeof Mail;
  title: string;
  detail: string;
  action: string;
  onAction: (x: string) => void;
}) {
  return (
    <Card
      style={{
        padding: 13,
        gap: 9,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: "#FFF",
      }}
    >
      <View style={s.row}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: "#DDEEF8",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} color={colors.blueDark} />
        </View>
        <View style={{ marginLeft: 9, flex: 1 }}>
          <Text style={{ fontWeight: "800", color: colors.text, fontSize: 13 }}>{title}</Text>
          <Text style={s.small}>{detail}</Text>
        </View>
        <ShieldCheck size={15} color="#43815E" />
      </View>
      <Button small onPress={() => onAction(`${title} opened`)}>
        {action}
      </Button>
    </Card>
  );
}
function SessionDrawer({
  sessions,
  selectedId,
  agents,
  close,
  select,
  newSession,
  selectAgent,
}: {
  sessions: Session[];
  selectedId: string;
  agents: Agent[];
  close: () => void;
  select: (x: string) => void;
  newSession: () => void;
  selectAgent: (x: Agent) => void;
}) {
  return (
    <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(20,35,45,.28)" }}>
      <View
        style={{
          width: "86%",
          maxWidth: 380,
          height: "100%",
          backgroundColor: "#FFF",
          paddingTop: 22,
          paddingHorizontal: 18,
          gap: 18,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 18,
        }}
      >
        <View style={s.between}>
          <View style={s.row}>
            <Mascot size={32} />
            <Text style={{ fontWeight: "800", fontSize: 19, marginLeft: 9 }}>Conversations</Text>
          </View>
          <Pressable onPress={close}>
            <ArrowLeft size={20} color={colors.muted} />
          </Pressable>
        </View>
        <Button primary icon={Plus} onPress={newSession}>
          New conversation
        </Button>
        <Text style={s.label}>RECENT AGENTS</Text>
        {agents.map((agent) => (
          <Pressable
            key={agent.id}
            onPress={() => selectAgent(agent)}
            style={[s.row, { gap: 11, paddingVertical: 9 }]}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: agent.tone,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mascot size={29} variant={agent.avatar} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800", color: colors.text }}>{agent.name}</Text>
              <Text style={s.small}>{agent.last}</Text>
            </View>
            {agent.unread ? (
              <View
                style={{
                  backgroundColor: colors.blueDark,
                  borderRadius: 10,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800" }}>
                  {agent.unread}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ))}
        <Text style={s.label}>SESSIONS</Text>
        {sessions.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => select(item.id)}
            style={[
              s.row,
              {
                gap: 10,
                paddingVertical: 11,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              },
            ]}
          >
            <Bot size={17} color={item.id === selectedId ? colors.blueDark : colors.muted} />
            <Text
              style={{
                flex: 1,
                color: item.id === selectedId ? colors.text : colors.muted,
                fontWeight: item.id === selectedId ? "800" : "500",
              }}
            >
              {item.title}
            </Text>
            <ChevronRight size={15} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
function AgentPicker({
  agents,
  current,
  close,
  select,
}: {
  agents: Agent[];
  current: string;
  close: () => void;
  select: (x: Agent) => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(20,35,45,.28)",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          backgroundColor: "#FFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 22,
          gap: 12,
        }}
      >
        <View style={s.between}>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>Choose an agent</Text>
          <Pressable onPress={close}>
            <ArrowLeft size={19} color={colors.muted} />
          </Pressable>
        </View>
        {agents.map((agent) => (
          <Pressable
            key={agent.id}
            onPress={() => select(agent)}
            style={[
              s.row,
              { gap: 12, paddingVertical: 10, opacity: current === agent.id ? 1 : 0.82 },
            ]}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: agent.tone,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mascot size={32} variant={agent.avatar} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "800" }}>{agent.name}</Text>
              <Text style={s.small}>{agent.role}</Text>
            </View>
            {current === agent.id && <Check size={18} color={colors.blueDark} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
function CallSheet({ agent, close }: { agent: Agent; close: () => void }) {
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#12232D",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: agent.tone,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Mascot size={72} variant={agent.avatar} />
      </View>
      <Text style={{ color: "#FFF", fontSize: 25, fontWeight: "800" }}>{agent.name}</Text>
      <Text style={{ color: "#BBD1DC", marginTop: 7 }}>Voice call · ready to listen</Text>
      <View style={{ height: 120, justifyContent: "center" }}>
        <View style={[s.row, { gap: 7 }]}>
          {[12, 28, 48, 20, 38, 17, 31].map((height, i) => (
            <View
              key={i}
              style={{ width: 5, height, borderRadius: 4, backgroundColor: "#7CC4F8" }}
            />
          ))}
        </View>
      </View>
      <Text style={{ color: "#BBD1DC", textAlign: "center", lineHeight: 22 }}>
        Ask me to draft an email, compare a trip, or prepare a purchase. I’ll show the action before
        execution.
      </Text>
      <Pressable
        onPress={close}
        style={{
          marginTop: 35,
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: "#E86363",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Phone size={24} color="#FFF" />
      </Pressable>
    </View>
  );
}
