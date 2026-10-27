import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

const root = new URL("../", import.meta.url);
const fromRoot = (...parts) => join(root.pathname, ...parts);
const read = (...parts) => readFileSync(fromRoot(...parts), "utf8");
const readJson = (...parts) => JSON.parse(read(...parts));

const expectedSkills = [
  "ai-manju",
  "architecture-diagram",
  "code-investigation",
  "image-prompt-cover",
  "image-prompt-info",
  "image-prompt-xhs",
  "knowledge-sync",
  "search",
  "summary",
  "writing-review-briefs",
];

function skillDirectories() {
  return readdirSync(fromRoot("skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, "SKILL.md must start with YAML frontmatter");
  return parseYaml(match[1]);
}

function skillBody(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function skillSourceDigest() {
  const paths = expectedSkills.flatMap((skill) => [
    `skills/${skill}/SKILL.md`,
    `skills/${skill}/agents/openai.yaml`,
  ]);
  paths.push("claude-skills/knowledge-sync/SKILL.md");
  paths.push(
    "skills/ai-manju/references/shot-handoff.md",
    "skills/ai-manju/references/automation.md",
    "skills/ai-manju/references/progress.md",
    "skills/ai-manju/references/audio-handoff.md",
  );
  const digest = createHash("sha256");
  for (const path of paths.sort()) {
    digest.update(path);
    digest.update("\0");
    digest.update(read(...path.split("/")));
    digest.update("\0");
  }
  return digest.digest("hex");
}

test("Codex and Claude manifests expose SLib 2.0", () => {
  assert.ok(existsSync(fromRoot(".codex-plugin", "plugin.json")));
  assert.ok(existsSync(fromRoot(".agents", "plugins", "marketplace.json")));

  const codex = readJson(".codex-plugin", "plugin.json");
  const claude = readJson(".claude-plugin", "plugin.json");
  const pkg = readJson("package.json");

  for (const manifest of [codex, claude]) {
    assert.equal(manifest.name, "slib");
    assert.equal(manifest.version, "2.0.0");
    assert.equal(manifest.author.name, "haxianhe");
  }
  assert.equal(codex.skills, "./skills/");
  assert.equal(codex.license, "MIT");
  assert.equal(pkg.version, "2.0.0");
});

test("marketplaces publish slib@slib with Codex tracking main", () => {
  const codex = readJson(".agents", "plugins", "marketplace.json");
  const claude = readJson(".claude-plugin", "marketplace.json");

  assert.equal(codex.name, "slib");
  assert.equal(codex.interface.displayName, "SLib");
  assert.equal(codex.plugins.length, 1);
  assert.deepEqual(codex.plugins[0].policy, {
    installation: "AVAILABLE",
    authentication: "ON_INSTALL",
  });
  assert.equal(codex.plugins[0].source.source, "url");
  assert.equal(codex.plugins[0].source.ref, "main");
  assert.equal(codex.plugins[0].category, "Productivity");

  assert.equal(claude.name, "slib");
  assert.equal(claude.plugins.length, 1);
  assert.equal(claude.plugins[0].name, "slib");
  assert.equal(claude.plugins[0].version, "2.0.0");
  assert.equal(claude.plugins[0].source, "./");
  assert.deepEqual(claude.plugins[0].skills.sort(), [
    "./claude-skills/knowledge-sync",
    "./skills/ai-manju",
    "./skills/architecture-diagram",
    "./skills/code-investigation",
    "./skills/image-prompt-cover",
    "./skills/image-prompt-info",
    "./skills/image-prompt-xhs",
    "./skills/search",
    "./skills/summary",
    "./skills/writing-review-briefs",
  ]);
});

test("only the supported skills are public", () => {
  assert.deepEqual(skillDirectories(), expectedSkills);
  assert.equal(existsSync(fromRoot("hooks")), false);
});

test("every skill has portable discovery metadata", () => {
  for (const skill of expectedSkills) {
    const source = read("skills", skill, "SKILL.md");
    const metadata = frontmatter(source);
    assert.equal(metadata.name, skill, `${skill}: frontmatter name`);
    assert.match(
      metadata.description ?? "",
      /^Use when\b/,
      `${skill}: description must describe its trigger`,
    );

    const openai = parseYaml(
      read("skills", skill, "agents", "openai.yaml"),
    );
    assert.equal(
      typeof openai.interface?.display_name,
      "string",
      `${skill}: display name`,
    );
    assert.equal(
      typeof openai.interface?.short_description,
      "string",
      `${skill}: short description`,
    );
    assert.match(
      openai.interface?.default_prompt ?? "",
      new RegExp(`\\$${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      `${skill}: default prompt references the skill`,
    );
  }

  const syncMetadata = parseYaml(
    read("skills", "knowledge-sync", "agents", "openai.yaml"),
  );
  assert.equal(
    syncMetadata.policy?.allow_implicit_invocation,
    false,
    "Codex must not invoke knowledge-sync implicitly",
  );
  assert.equal(
    frontmatter(read("skills", "knowledge-sync", "SKILL.md"))[
      "disable-model-invocation"
    ] ?? false,
    false,
    "Codex uses agents/openai.yaml for explicit-only policy",
  );
  assert.equal(
    frontmatter(read("claude-skills", "knowledge-sync", "SKILL.md"))[
      "disable-model-invocation"
    ],
    true,
    "Claude must not invoke knowledge-sync implicitly",
  );
  assert.equal(
    skillBody(read("claude-skills", "knowledge-sync", "SKILL.md")),
    skillBody(read("skills", "knowledge-sync", "SKILL.md")),
    "platform-specific knowledge-sync copies must keep the same workflow",
  );
});

test("active skills do not hard-code host-specific pseudo tools", () => {
  const forbidden = [
    "AskUserQuestion",
    "WebSearch",
    "WebFetch",
    "Skill(",
    "mcp__drawio__",
  ];

  for (const skill of expectedSkills) {
    const source = read("skills", skill, "SKILL.md");
    for (const token of forbidden) {
      assert.equal(
        source.includes(token),
        false,
        `${skill}: remove host-specific token ${token}`,
      );
    }
  }
});

test("core skills document safe fallbacks and stable output paths", () => {
  const summary = read("skills", "summary", "SKILL.md");
  assert.match(summary, /URL/);
  assert.match(summary, /粘贴正文/);
  assert.match(summary, /仅.*HTTP\(S\)|仅.*https?:\/\//s);
  assert.match(summary, /回环|loopback/i);
  assert.match(summary, /私有地址|private/i);
  assert.match(summary, /链路本地|link-local/i);
  assert.match(summary, /云元数据|metadata/i);
  assert.match(summary, /重定向.*重新.*校验/s);
  assert.match(summary, /固定.*IP|peer IP/i);
  assert.match(summary, /无法.*保证.*跳过|不能.*保证.*跳过/s);
  assert.match(summary, /~\/KnowledgeDB\/raw\//);
  assert.match(summary, /写入前.*确认|确认.*写入前/s);

  const search = read("skills", "search", "SKILL.md");
  assert.match(search, /登录态/);
  assert.match(search, /确认/);
  assert.match(search, /不得.*绕过|不绕过/s);
  assert.match(search, /仅.*HTTP\(S\)|仅.*https?:\/\//s);
  assert.match(search, /回环|loopback/i);
  assert.match(search, /私有地址|private/i);
  assert.match(search, /链路本地|link-local/i);
  assert.match(search, /云元数据|metadata/i);
  assert.match(search, /重定向.*重新.*校验/s);
  assert.match(search, /固定.*IP|peer IP/i);
  assert.match(search, /无法.*保证.*跳过|不能.*保证.*跳过/s);

  const diagram = read("skills", "architecture-diagram", "SKILL.md");
  assert.match(diagram, /https:\/\/app\.diagrams\.net\/\?lang=zh&mode=device/);
  assert.match(diagram, /先.*\.drawio.*再.*打开/s);
  assert.match(diagram, /拖放|从设备打开/);
  assert.match(diagram, /打开失败.*不影响|不影响.*打开失败/s);
  assert.match(diagram, /XML 解析/);
  assert.match(diagram, /重复 ID/);
  assert.match(diagram, /source.*target.*存在/s);
  assert.match(diagram, /mxGeometry.*数字|数字.*mxGeometry/s);
  assert.match(diagram, /parent.*存在/s);
  assert.match(diagram, /根 cell.*1.*0/s);

  const sync = read("skills", "knowledge-sync", "SKILL.md");
  assert.match(sync, /内容预览/);
  assert.match(sync, /明确确认/);
  assert.match(sync, /不得声称成功/);

  for (const skill of [
    "image-prompt-cover",
    "image-prompt-info",
    "image-prompt-xhs",
  ]) {
    const source = read("skills", skill, "SKILL.md");
    assert.match(source, /~\/KnowledgeDB\/image-prompts\//);
    assert.match(source, /不调用.*文生图|不调.*文生图/s);
  }
});

test("README documents verified public commands and breaking changes", () => {
  const readme = read("README.md");
  assert.match(readme, /codex plugin add slib@slib/);
  assert.match(readme, /claude plugin install slib@slib/);
  assert.equal(readme.includes("slib@SLib"), false);
  const currentUsage = readme.split("## 从 1.x 升级")[0];
  assert.equal(currentUsage.includes("~/knowledge/"), false);
  assert.match(readme, /knowledge-sync/);
  assert.match(readme, /knowledge-sync.*仅.*显式|仅.*显式.*knowledge-sync/s);
  assert.match(readme, /\$slib:knowledge-sync/);
  assert.match(readme, /\/slib:knowledge-sync/);
  assert.match(readme, /app\.diagrams\.net/);

  const changelog = read("CHANGELOG.md");
  assert.match(changelog, /2\.0\.0/);
  assert.match(changelog, /afeaturemerge/);
  assert.match(changelog, /learning/);
  assert.match(changelog, /using-slib/);
});

test("recorded skill evaluations cover every public workflow", () => {
  const evidence = readJson("tests", "skill-evaluations.json");
  assert.match(evidence.run.evaluated_at, /^\d{4}-\d{2}-\d{2}T/);
  assert.match(evidence.run.base_commit, /^[0-9a-f]{40}$/);
  assert.match(evidence.run.skill_sources_sha256, /^[0-9a-f]{64}$/);
  assert.equal(evidence.run.skill_sources_sha256, skillSourceDigest());
  assert.match(evidence.run.runner, /Codex/i);
  assert.match(evidence.run.model, /not exposed|未暴露/i);
  assert.match(evidence.run.limitations, /read-only|只读/i);

  const evaluations = evidence.evaluations;
  assert.deepEqual(
    evaluations.map(({ skill }) => skill).sort(),
    expectedSkills,
  );

  const responseContracts = {
    "ai-manju": [/shot_001/, /CLI/, /剪映/, /超时/, /会员/],
    "architecture-diagram": [/不会.*虚报/s, /XML/, /parent/, /从设备打开|拖放/],
    "code-investigation": [/只读/, /证据/, /未修改/],
    "image-prompt-cover": [/不直接生成图片/, /不.*API/s, /KnowledgeDB/],
    "image-prompt-info": [/不.*API/s, /不直接生成图片/, /KnowledgeDB/],
    "image-prompt-xhs": [/6 个/, /01/, /06/, /不.*API/s],
    "knowledge-sync": [/未同步/, /明确确认/, /不能报告成功/],
    search: [/暂未搜索/, /确认/, /不能静默|不会默认选择.*profile/s],
    "writing-review-briefs": [/参数不完整/, /仅用于测试环境/, /计划/, /待确认/],
    summary: [/无法总结/, /不能.*编造/s, /粘贴正文/, /确认/],
  };

  for (const evaluation of evaluations) {
    assert.match(evaluation.agent, /^[a-z0-9_]+$/);
    assert.equal(
      typeof evaluation.exact_prompt,
      "string",
      `${evaluation.skill}: exact prompt`,
    );
    assert.ok(
      evaluation.exact_prompt.length > 8,
      `${evaluation.skill}: exact prompt`,
    );
    assert.equal(
      typeof evaluation.response,
      "string",
      `${evaluation.skill}: response`,
    );
    assert.ok(evaluation.response.length > 40, `${evaluation.skill}: response`);
    assert.equal(
      typeof evaluation.pass_reason,
      "string",
      `${evaluation.skill}: pass reason`,
    );
    for (const contract of responseContracts[evaluation.skill]) {
      assert.match(
        evaluation.response,
        contract,
        `${evaluation.skill}: ${contract}`,
      );
    }
  }
});

test("CI installs locked dependencies before validating", () => {
  assert.ok(existsSync(fromRoot("package-lock.json")));
  assert.equal(
    read("package-lock.json").includes("registry.anpm.alibaba-inc.com"),
    false,
    "public contributors must not depend on an internal npm mirror",
  );
  assert.match(read("package-lock.json"), /https:\/\/registry\.npmjs\.org\//);
  const workflowSource = read(".github", "workflows", "validate.yml");
  const workflow = parseYaml(workflowSource);
  assert.equal(workflow.name, "Validate plugin");
  assert.match(workflowSource, /\bnpm ci\b/);
  assert.match(workflowSource, /\bnpm test\b/);
  assert.match(
    workflowSource,
    /openai\/codex\/[0-9a-f]{40}\/codex-rs\/skills\/src\/assets\/samples\/plugin-creator\/scripts\/validate_plugin\.py/,
  );
  assert.match(workflowSource, /python3 .*validate_plugin\.py"? \./);
});
