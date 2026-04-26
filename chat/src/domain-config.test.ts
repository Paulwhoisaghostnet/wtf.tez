import {
  buildChatChallengeMessage,
  defaultParentDomain,
  getAllowedParentDomains,
  normalizeChatDomain,
} from "./domain-config";

function assertEqual(actual: unknown, expected: unknown) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson}, got ${actualJson}`);
  }
}

assertEqual(getAllowedParentDomains({ CHAT_PARENT_DOMAINS: "wtf,hack.tez,foo.gho" }, "tez"), [
  "wtf.tez",
  "hack.tez",
  "foo.gho",
]);

assertEqual(defaultParentDomain(["wtf.tez", "hack.tez"]), "wtf.tez");

assertEqual(normalizeChatDomain("alice", ["wtf.tez", "hack.tez"]), {
  ok: true,
  domain: "alice.wtf.tez",
});

assertEqual(normalizeChatDomain("skllz.hack.tez", ["wtf.tez", "hack.tez"]), {
  ok: true,
  domain: "skllz.hack.tez",
});

assertEqual(normalizeChatDomain("alice.other.tez", ["wtf.tez"]).ok, false);
assertEqual(buildChatChallengeMessage(123, "abcdef12", "wtf.tez-chat"), "wtf.tez-chat:123:abcdef12");

console.log("chat domain-config tests passed");
