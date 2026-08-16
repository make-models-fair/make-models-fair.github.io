import mermaid from "mermaid";

export async function renderMermaid(selector, theme) {
  mermaid.initialize({ startOnLoad: false, securityLevel: "antiscript", theme });
  await mermaid.run({ querySelector: selector });
}
