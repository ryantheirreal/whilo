import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CircleDollarSign,
  Clock3,
  Command,
  Globe2,
  Inbox,
  Mail,
  MapPin,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  SquareCheck,
  TrendingUp,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button, Card, colors, Mascot, s } from "./ui";

type Tab = "overview" | "inbox" | "tasks" | "trips" | "automations";
type Task = {
  id: string;
  title: string;
  meta: string;
  status: "Ready" | "Waiting" | "Done";
  tone: string;
};
const tasksSeed: Task[] = [
  {
    id: "1",
    title: "Prepare a calm plan for tomorrow",
    meta: "Whilo · 2 min ago",
    status: "Ready",
    tone: colors.blueDark,
  },
  {
    id: "2",
    title: "Compare São Paulo → Lisboa flights",
    meta: "Travel search · Today",
    status: "Waiting",
    tone: "#B7832E",
  },
  {
    id: "3",
    title: "Summarize the product feedback",
    meta: "Inbox · Yesterday",
    status: "Done",
    tone: "#43815E",
  },
];
const nav: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "tasks", label: "Tasks", icon: SquareCheck },
  { id: "trips", label: "Trips", icon: Globe2 },
  { id: "automations", label: "Automations", icon: Play },
];

export function PreviewApp() {
  const [tab, setTab] = useState<Tab>("overview");
  const [tasks, setTasks] = useState(tasksSeed);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [command, setCommand] = useState(false);
  const [approval, setApproval] = useState(false);
  const [automation, setAutomation] = useState(true);
  const [tripMode, setTripMode] = useState<"compare" | "itinerary">("compare");
  const filtered = useMemo(
    () => tasks.filter((x) => `${x.title} ${x.meta}`.toLowerCase().includes(search.toLowerCase())),
    [tasks, search],
  );
  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2600);
  };
  const addTask = () => {
    setTasks((old) => [
      {
        id: String(Date.now()),
        title: "Follow up on the latest opportunity",
        meta: "Created just now · Preview",
        status: "Ready",
        tone: colors.blueDark,
      },
      ...old,
    ]);
    setTab("tasks");
    notify("Task created — Whilo is ready to continue.");
  };
  const approve = () => {
    setApproval(false);
    notify("Approved safely — queued for the connected workspace.");
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            width: 232,
            backgroundColor: "#F2F8FC",
            borderRightWidth: 1,
            borderRightColor: colors.line,
            padding: 22,
            gap: 24,
          }}
        >
          <View style={[s.row, { gap: 10 }]}>
            <Mascot size={34} />
            <View>
              <Text style={{ fontWeight: "800", fontSize: 19, color: colors.text }}>Whilo</Text>
              <Text style={s.small}>PREVIEW MODE</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setCommand(true)}
            style={[
              s.row,
              {
                gap: 8,
                padding: 10,
                borderRadius: 12,
                backgroundColor: "#FFF",
                borderWidth: 1,
                borderColor: colors.line,
              },
            ]}
          >
            <Command size={15} color={colors.blueDark} />
            <Text style={s.small}>Command center</Text>
            <Text style={[s.small, { marginLeft: "auto" }]}>⌘ K</Text>
          </Pressable>
          <View style={{ gap: 7 }}>
            {nav.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setTab(item.id)}
                  style={[
                    s.row,
                    {
                      gap: 11,
                      paddingVertical: 11,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      backgroundColor: active ? "#DCECF7" : "transparent",
                    },
                  ]}
                >
                  <Icon size={17} color={active ? colors.blueDark : colors.muted} />
                  <Text
                    style={{
                      color: active ? colors.text : colors.muted,
                      fontWeight: active ? "700" : "500",
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.id === "inbox" && (
                    <View
                      style={{
                        marginLeft: "auto",
                        backgroundColor: colors.blueDark,
                        borderRadius: 10,
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800" }}>3</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={{ marginTop: "auto", gap: 12 }}>
            <Card style={{ backgroundColor: "#FFF", padding: 14, gap: 8 }}>
              <View style={s.row}>
                <ShieldCheck size={16} color="#43815E" />
                <Text style={[s.small, { fontWeight: "700", marginLeft: 7 }]}>Safe by default</Text>
              </View>
              <Text style={s.small}>External actions always wait for your review.</Text>
            </Card>
            <Text style={s.small}>
              Whilo 0.2 Preview · Connected mode keeps the same workspace.
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={[
              s.row,
              {
                justifyContent: "space-between",
                paddingHorizontal: 34,
                paddingVertical: 22,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
                backgroundColor: "#FFF",
              },
            ]}
          >
            <View>
              <Text
                style={{ color: colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 1 }}
              >
                FRIDAY · OCTOBER 03
              </Text>
              <Text
                style={{ color: colors.text, fontSize: 28, fontWeight: "700", letterSpacing: -1 }}
              >
                Make room for what matters.
              </Text>
            </View>
            <View style={[s.row, { gap: 10 }]}>
              <Pressable
                onPress={() => notify("No new alerts — your workspace is calm.")}
                style={s.iconBox}
              >
                <Bell size={18} color={colors.muted} />
              </Pressable>
              <Pressable
                onPress={() => setApproval(true)}
                style={[
                  s.row,
                  {
                    gap: 8,
                    backgroundColor: "#FFF4E4",
                    paddingVertical: 10,
                    paddingHorizontal: 13,
                    borderRadius: 12,
                  },
                ]}
              >
                <ShieldCheck size={16} color="#A46A1A" />
                <Text style={{ color: "#7C511A", fontWeight: "700", fontSize: 12 }}>1 review</Text>
              </Pressable>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.blueDark,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "800" }}>R</Text>
              </View>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ padding: 34, gap: 24 }}>
            {tab === "overview" && (
              <Overview
                addTask={addTask}
                approve={() => setApproval(true)}
                go={setTab}
                automation={automation}
                setAutomation={setAutomation}
              />
            )}
            {tab === "inbox" && <InboxView notify={notify} />}
            {tab === "tasks" && (
              <TasksView
                tasks={filtered}
                search={search}
                setSearch={setSearch}
                addTask={addTask}
                notify={notify}
              />
            )}
            {tab === "trips" && <TripsView mode={tripMode} setMode={setTripMode} notify={notify} />}
            {tab === "automations" && (
              <AutomationView enabled={automation} setEnabled={setAutomation} notify={notify} />
            )}
          </ScrollView>
        </View>
      </View>
      {toast ? (
        <View
          style={{
            position: "absolute",
            bottom: 26,
            alignSelf: "center",
            backgroundColor: colors.text,
            paddingVertical: 13,
            paddingHorizontal: 20,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "700" }}>{toast}</Text>
        </View>
      ) : null}
      {command && (
        <CommandCenter
          close={() => setCommand(false)}
          go={(next) => {
            setTab(next);
            setCommand(false);
          }}
          addTask={addTask}
        />
      )}
      {approval && <ApprovalSheet close={() => setApproval(false)} approve={approve} />}
    </View>
  );
}

function Overview({
  addTask,
  approve,
  go,
  automation,
  setAutomation,
}: {
  addTask: () => void;
  approve: () => void;
  go: (tab: Tab) => void;
  automation: boolean;
  setAutomation: (v: boolean) => void;
}) {
  return (
    <View style={{ gap: 22 }}>
      <View style={{ flexDirection: "row", gap: 18, flexWrap: "wrap" }}>
        <Card
          style={{
            flex: 2,
            minWidth: 420,
            minHeight: 220,
            backgroundColor: "#DDEEF8",
            padding: 28,
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={[s.row, { gap: 8 }]}>
              <Sparkles size={15} color={colors.blueDark} />
              <Text style={[s.label, { color: colors.blueDark }]}>WHILO INTELLIGENCE</Text>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: colors.text,
                letterSpacing: -1.3,
                marginTop: 14,
              }}
            >
              Your agent is already on it.
            </Text>
            <Text style={[s.muted, { maxWidth: 480, marginTop: 8 }]}>
              Turn a thought into a plan, compare an option, or ask Whilo to keep an eye on
              something.
            </Text>
          </View>
          <View style={[s.row, { gap: 10 }]}>
            <Button primary onPress={addTask} icon={Sparkles}>
              Plan my day
            </Button>
            <Button onPress={() => go("trips")} icon={Globe2}>
              Explore a trip
            </Button>
          </View>
        </Card>
        <Card style={{ flex: 1, minWidth: 240, padding: 22, gap: 14 }}>
          <View style={s.between}>
            <Text style={s.label}>TODAY AT A GLANCE</Text>
            <TrendingUp size={18} color="#43815E" />
          </View>
          <Metric label="Tasks moving" value="03" />
          <Metric label="Unread ideas" value="03" />
          <Metric label="Awaiting review" value="01" tone="#B7832E" />
        </Card>
      </View>
      <View style={{ flexDirection: "row", gap: 18, flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 280, padding: 22, gap: 14 }}>
          <Header
            icon={Inbox}
            title="Inbox intelligence"
            action="Open inbox"
            onPress={() => go("inbox")}
          />
          <Text style={s.muted}>
            Three messages are worth your attention. Whilo grouped the noise and surfaced the
            decisions.
          </Text>
          <Pressable onPress={() => go("inbox")} style={s.row}>
            <Mail size={16} color={colors.blueDark} />
            <Text style={[s.small, { marginLeft: 8, color: colors.blueDark, fontWeight: "700" }]}>
              Review the shortlist <ArrowRight size={14} />
            </Text>
          </Pressable>
        </Card>
        <Card style={{ flex: 1, minWidth: 280, padding: 22, gap: 14 }}>
          <Header
            icon={SquareCheck}
            title="Your next move"
            action="View tasks"
            onPress={() => go("tasks")}
          />
          <Text style={s.muted}>
            A calm 25-minute block is enough to turn the latest opportunity into progress.
          </Text>
          <Button small onPress={addTask} icon={Plus}>
            Add to my plan
          </Button>
        </Card>
        <Card style={{ flex: 1, minWidth: 280, padding: 22, gap: 14 }}>
          <Header
            icon={Play}
            title="Quiet automations"
            action={automation ? "Running" : "Paused"}
            onPress={() => setAutomation(!automation)}
          />
          <Text style={s.muted}>
            {automation
              ? "Whilo watches your selected pages during your quiet hours."
              : "Nothing is running in the background."}
          </Text>
          <Pressable onPress={() => setAutomation(!automation)} style={[s.row, { gap: 8 }]}>
            <View
              style={{
                width: 34,
                height: 20,
                borderRadius: 12,
                backgroundColor: automation ? colors.blueDark : colors.line,
                padding: 3,
                alignItems: automation ? "flex-end" : "flex-start",
              }}
            >
              <View style={{ width: 14, height: 14, borderRadius: 8, backgroundColor: "#FFF" }} />
            </View>
            <Text style={s.small}>{automation ? "Pause for now" : "Resume automation"}</Text>
          </Pressable>
        </Card>
      </View>
      <Card style={{ padding: 22, gap: 14, backgroundColor: "#FFF9F0" }}>
        <Header icon={ShieldCheck} title="One action needs you" action="Review" onPress={approve} />
        <View style={[s.row, { gap: 14 }]}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              backgroundColor: "#FFE6B7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircleDollarSign size={21} color="#A46A1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "700", color: colors.text }}>Review a purchase handoff</Text>
            <Text style={s.small}>
              Merchant, total and destination are visible before anything leaves Whilo.
            </Text>
          </View>
          <Button small onPress={approve}>
            Review safely
          </Button>
        </View>
      </Card>
    </View>
  );
}
function Metric({
  label,
  value,
  tone = colors.text,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <View style={s.between}>
      <Text style={s.small}>{label}</Text>
      <Text style={{ color: tone, fontSize: 22, fontWeight: "800" }}>{value}</Text>
    </View>
  );
}
function Header({
  icon: Icon,
  title,
  action,
  onPress,
}: {
  icon: typeof Activity;
  title: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={s.between}>
      <View style={[s.row, { gap: 8 }]}>
        <Icon size={17} color={colors.blueDark} />
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>{title}</Text>
      </View>
      <Pressable onPress={onPress}>
        <Text style={[s.small, { color: colors.blueDark, fontWeight: "700" }]}>{action}</Text>
      </Pressable>
    </View>
  );
}

function InboxView({ notify }: { notify: (x: string) => void }) {
  const mails = [
    {
      from: "Maya Chen",
      subject: "The launch notes are ready",
      tag: "Decision needed",
      color: "#FFE6B7",
    },
    {
      from: "João · Product",
      subject: "Three patterns from user interviews",
      tag: "Insight",
      color: "#DDEEF8",
    },
    { from: "Travel desk", subject: "Lisboa options for October", tag: "Travel", color: "#DDF0E5" },
  ];
  return (
    <View style={{ gap: 18 }}>
      <Title
        eyebrow="INBOX"
        title="The important bits, without the noise."
        detail="Whilo groups messages by decision, insight and next action."
      />
      <Card style={{ padding: 8 }}>
        {mails.map((mail) => (
          <Pressable
            key={mail.subject}
            onPress={() => notify(`Opened: ${mail.subject}`)}
            style={[
              s.row,
              { gap: 14, padding: 17, borderBottomWidth: 1, borderBottomColor: colors.line },
            ]}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: mail.color,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mail size={17} color={colors.text} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontWeight: "700", color: colors.text }}>{mail.subject}</Text>
              <Text style={s.small}>{mail.from}</Text>
            </View>
            <Text style={[s.small, { color: colors.blueDark, fontWeight: "700" }]}>{mail.tag}</Text>
            <ArrowRight size={16} color={colors.muted} />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}
function TasksView({
  tasks,
  search,
  setSearch,
  addTask,
  notify,
}: {
  tasks: Task[];
  search: string;
  setSearch: (x: string) => void;
  addTask: () => void;
  notify: (x: string) => void;
}) {
  return (
    <View style={{ gap: 18 }}>
      <Title
        eyebrow="TASKS"
        title="A small list that keeps moving."
        detail="Every task has an owner, a next action and a visible state."
      />
      <View style={[s.row, { gap: 10 }]}>
        <View
          style={[
            s.row,
            {
              flex: 1,
              gap: 8,
              backgroundColor: "#FFF",
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: 12,
              paddingHorizontal: 13,
            },
          ]}
        >
          <Search size={16} color={colors.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tasks"
            style={{ flex: 1, paddingVertical: 11, color: colors.text }}
          />
        </View>
        <Button onPress={addTask} icon={Plus}>
          New task
        </Button>
      </View>
      <Card style={{ padding: 8 }}>
        {tasks.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => notify(`${task.title} opened`)}
            style={[
              s.row,
              { gap: 13, padding: 17, borderBottomWidth: 1, borderBottomColor: colors.line },
            ]}
          >
            <View style={{ width: 10, height: 10, borderRadius: 6, backgroundColor: task.tone }} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontWeight: "700", color: colors.text }}>{task.title}</Text>
              <Text style={s.small}>{task.meta}</Text>
            </View>
            <Text style={{ color: task.tone, fontWeight: "700", fontSize: 12 }}>{task.status}</Text>
            <ArrowRight size={16} color={colors.muted} />
          </Pressable>
        ))}
        {!tasks.length && <Text style={s.muted}>No tasks match your search.</Text>}
      </Card>
    </View>
  );
}
function TripsView({
  mode,
  setMode,
  notify,
}: {
  mode: "compare" | "itinerary";
  setMode: (x: "compare" | "itinerary") => void;
  notify: (x: string) => void;
}) {
  return (
    <View style={{ gap: 18 }}>
      <Title
        eyebrow="TRAVEL STUDIO"
        title="A better trip starts before checkout."
        detail="Compare the shape of a trip, then hand off only when you are ready."
      />
      <View style={[s.row, { gap: 8 }]}>
        <Button small primary={mode === "compare"} onPress={() => setMode("compare")}>
          Compare options
        </Button>
        <Button small primary={mode === "itinerary"} onPress={() => setMode("itinerary")}>
          Build itinerary
        </Button>
      </View>
      {mode === "compare" ? (
        <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
          {[
            { city: "Lisboa", date: "Oct 18–24", price: "R$ 3.480", note: "Best balance" },
            { city: "Madrid", date: "Oct 19–25", price: "R$ 3.120", note: "Lowest price" },
            { city: "Porto", date: "Oct 18–23", price: "R$ 3.760", note: "Most relaxed" },
          ].map((trip) => (
            <Pressable
              key={trip.city}
              onPress={() => notify(`${trip.city} selected — checkout stays under your control.`)}
              style={{ flex: 1, minWidth: 210 }}
            >
              <Card style={{ padding: 20, gap: 13 }}>
                <View style={s.between}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor: "#DDEEF8",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapPin size={17} color={colors.blueDark} />
                  </View>
                  <Text style={[s.small, { color: "#43815E", fontWeight: "700" }]}>
                    {trip.note}
                  </Text>
                </View>
                <Text style={{ fontSize: 21, fontWeight: "800", color: colors.text }}>
                  {trip.city}
                </Text>
                <Text style={s.small}>{trip.date} · São Paulo</Text>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.blueDark }}>
                  {trip.price}
                </Text>
                <Text style={s.small}>Source links ready · No booking performed</Text>
              </Card>
            </Pressable>
          ))}
        </View>
      ) : (
        <Card style={{ padding: 22, gap: 15 }}>
          <View style={s.row}>
            <CalendarDays size={18} color={colors.blueDark} />
            <Text style={{ fontWeight: "700", marginLeft: 8 }}>Six days with room to breathe</Text>
          </View>
          {[
            "Arrive and settle in Alfama",
            "Museum morning + quiet lunch",
            "Day trip with a flexible return",
          ].map((x, i) => (
            <View key={x} style={[s.row, { gap: 12 }]}>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: i === 1 ? "#DDF0E5" : "#DDEEF8",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={s.small}>{i + 1}</Text>
              </View>
              <Text style={s.small}>{x}</Text>
            </View>
          ))}
          <Button onPress={() => notify("Itinerary saved as a draft — no reservation made.")}>
            Save draft
          </Button>
        </Card>
      )}
    </View>
  );
}
function AutomationView({
  enabled,
  setEnabled,
  notify,
}: {
  enabled: boolean;
  setEnabled: (x: boolean) => void;
  notify: (x: string) => void;
}) {
  return (
    <View style={{ gap: 18 }}>
      <Title
        eyebrow="AUTOMATIONS"
        title="Helpful, not noisy."
        detail="Preview the proactive layer: clear scope, quiet hours and a pause button."
      />
      <Card style={{ padding: 22, gap: 18 }}>
        <View style={s.between}>
          <View style={[s.row, { gap: 10 }]}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                backgroundColor: "#DDEEF8",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={18} color={colors.blueDark} />
            </View>
            <View>
              <Text style={{ fontWeight: "800", color: colors.text }}>Watch travel prices</Text>
              <Text style={s.small}>São Paulo → Lisboa · every 6 hours</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setEnabled(!enabled)}
            style={{
              width: 42,
              height: 24,
              borderRadius: 14,
              backgroundColor: enabled ? colors.blueDark : colors.line,
              padding: 4,
              alignItems: enabled ? "flex-end" : "flex-start",
            }}
          >
            <View style={{ width: 16, height: 16, borderRadius: 9, backgroundColor: "#FFF" }} />
          </Pressable>
        </View>
        <View style={[s.row, { gap: 22, flexWrap: "wrap" }]}>
          <Metric label="Last checked" value="12 min" />
          <Metric label="Quiet hours" value="22:00" />
          <Metric
            label="Notifications"
            value={enabled ? "ON" : "OFF"}
            tone={enabled ? "#43815E" : colors.muted}
          />
        </View>
        <Button
          small
          onPress={() => notify(enabled ? "Automation paused." : "Automation resumed.")}
        >
          {enabled ? "Pause automation" : "Resume automation"}
        </Button>
      </Card>
    </View>
  );
}
function Title({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={[s.label, { color: colors.blueDark }]}>{eyebrow}</Text>
      <Text style={{ fontSize: 30, fontWeight: "800", color: colors.text, letterSpacing: -1 }}>
        {title}
      </Text>
      <Text style={[s.muted, { maxWidth: 650 }]}>{detail}</Text>
    </View>
  );
}
function CommandCenter({
  close,
  go,
  addTask,
}: {
  close: () => void;
  go: (tab: Tab) => void;
  addTask: () => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(27,43,54,.28)",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 110,
      }}
    >
      <Card
        style={{
          width: "70%",
          maxWidth: 620,
          padding: 20,
          gap: 12,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 18,
        }}
      >
        <View style={s.between}>
          <Text style={{ fontWeight: "800", fontSize: 18 }}>What should Whilo do?</Text>
          <Pressable onPress={close}>
            <X size={18} color={colors.muted} />
          </Pressable>
        </View>
        {[
          { label: "Plan my day", icon: Sparkles, action: addTask },
          { label: "Open inbox", icon: Inbox, action: () => go("inbox") },
          { label: "Compare a trip", icon: Globe2, action: () => go("trips") },
          { label: "View automations", icon: Play, action: () => go("automations") },
        ].map((item) => (
          <Pressable
            key={item.label}
            onPress={item.action}
            style={[s.row, { gap: 12, padding: 13, borderRadius: 11, backgroundColor: "#F6FAFC" }]}
          >
            <item.icon size={17} color={colors.blueDark} />
            <Text style={{ fontWeight: "700", color: colors.text }}>{item.label}</Text>
            <ArrowRight size={15} color={colors.muted} style={{ marginLeft: "auto" }} />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}
function ApprovalSheet({ close, approve }: { close: () => void; approve: () => void }) {
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(27,43,54,.28)",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          width: 390,
          marginRight: 28,
          padding: 24,
          gap: 17,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 18,
        }}
      >
        <View style={s.between}>
          <Text style={{ fontWeight: "800", fontSize: 19 }}>Review before sending</Text>
          <Pressable onPress={close}>
            <X size={18} color={colors.muted} />
          </Pressable>
        </View>
        <View style={{ backgroundColor: "#FFF4E4", padding: 15, borderRadius: 12, gap: 7 }}>
          <View style={s.row}>
            <CircleDollarSign size={17} color="#A46A1A" />
            <Text style={{ fontWeight: "800", marginLeft: 8 }}>Purchase handoff</Text>
          </View>
          <Text style={s.small}>
            A merchant checkout link is ready. Whilo will not submit payment in Preview mode.
          </Text>
        </View>
        {[
          "Merchant · Aurora Travel",
          "Total · R$ 3.480",
          "Destination · Lisboa",
          "Permission · One action only",
        ].map((x) => (
          <View key={x} style={[s.row, { gap: 9 }]}>
            <Check size={15} color="#43815E" />
            <Text style={s.small}>{x}</Text>
          </View>
        ))}
        <Button primary onPress={approve}>
          Approve safely
        </Button>
        <Button onPress={close}>Keep reviewing</Button>
      </Card>
    </View>
  );
}
