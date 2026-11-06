// Minimal runtime for the team's Claude Design export (v5): compiles its HTML template ({{ path }} bindings, <sc-if>,
// <sc-for>, onClick / ref attributes) into Preact vnodes and runs its component class (state, setState, renderVals,
// componentDidMount). Preact diffs each render, so canvases and their animation state survive re-renders.
import { createRef, h, render, Fragment, type ComponentChild } from "preact";

export const React = { createRef };

type Scope = Record<string, unknown>;
type Fn = (s: Scope) => ComponentChild;

export class DCLogic {
  state: Record<string, unknown> = {};
  props: Record<string, unknown> = {};
  _schedule?: (cb?: () => void) => void;
  setState(p: Record<string, unknown> | ((s: Record<string, unknown>) => Record<string, unknown>), cb?: () => void) {
    const v = typeof p === "function" ? p(this.state) : p;
    this.state = { ...this.state, ...v };
    this._schedule?.(cb);
  }
}

const BRACE = /\{\{\s*([^}]+?)\s*\}\}/g;
function evalPath(expr: string, s: Scope): unknown {
  const e = expr.trim();
  if (e === "true") return true;
  if (e === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e);
  return e.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Scope)[k]), s);
}
// "{{ x }}" alone → raw value (function, ref, number…); mixed text → interpolated string.
function binding(v: string): ((s: Scope) => unknown) | string {
  const whole = v.match(/^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/);
  if (whole) { const e = whole[1]!; return (s) => evalPath(e, s); }
  if (!v.includes("{{")) return v;
  return (s) => v.replace(BRACE, (_m, e: string) => { const r = evalPath(e, s); return r == null ? "" : String(r); });
}

const EVENT = /^on[a-z]+$/;
function compile(node: ChildNode): Fn | null {
  if (node.nodeType === 3) {
    const t = node.textContent ?? "";
    if (!t.includes("{{")) return () => t;
    const b = binding(t);
    return typeof b === "string" ? () => b : (s) => { const r = b(s); return r == null ? "" : (r as ComponentChild); };
  }
  if (node.nodeType !== 1) return null;
  const el = node as Element, tag = el.tagName.toLowerCase();
  const kids = Array.from(el.childNodes).map(compile).filter((f): f is Fn => !!f);
  const renderKids = (s: Scope) => kids.map((k) => k(s));
  if (tag === "sc-if") {
    const c = binding(el.getAttribute("value") ?? "");
    return (s) => ((typeof c === "string" ? c : c(s)) ? h(Fragment, null, renderKids(s)) : null);
  }
  if (tag === "sc-for") {
    const l = binding(el.getAttribute("list") ?? ""), as = el.getAttribute("as") ?? "item";
    return (s) => {
      const list = (typeof l === "string" ? [] : (l(s) as unknown[])) ?? [];
      return h(Fragment, null, list.map((item) => h(Fragment, null, renderKids({ ...s, [as]: item }))));
    };
  }
  const attrs: [string, ReturnType<typeof binding>][] = [];
  for (const a of Array.from(el.attributes)) {
    if (a.name.startsWith("hint-")) continue;
    let name = a.name;
    if (EVENT.test(name)) name = "on" + name[2]!.toUpperCase() + name.slice(3); // onclick → onClick
    attrs.push([name, binding(a.value)]);
  }
  return (s) => {
    const props: Record<string, unknown> = {};
    for (const [n, b] of attrs) props[n] = typeof b === "string" ? b : b(s);
    return h(tag, props, renderKids(s));
  };
}

export function mount<T extends DCLogic & { renderVals(): Scope; componentDidMount?(): void }>(template: string, comp: T, root: HTMLElement) {
  const doc = new DOMParser().parseFromString(`<body>${template}</body>`, "text/html");
  const fns = Array.from(doc.body.childNodes).map(compile).filter((f): f is Fn => !!f);
  let queued = false;
  const cbs: (() => void)[] = [];
  const draw = () => { const vals = comp.renderVals(); render(h(Fragment, null, fns.map((f) => f(vals))), root); };
  comp._schedule = (cb) => {
    if (cb) cbs.push(cb);
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; draw(); cbs.splice(0).forEach((c) => c()); });
  };
  draw();
  comp.componentDidMount?.();
}
