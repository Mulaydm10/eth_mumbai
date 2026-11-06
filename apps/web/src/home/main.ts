// Tremor Mesh website (the team's v5 design), mounted by the small runtime in ./dc.ts.
import template from "./template.html?raw";
import { mount } from "./dc";
// @ts-expect-error plain JS export of the design
import { Component } from "./v5.js";

mount(template, new Component(), document.getElementById("app")!);
