const fs = require("fs");
const path = require("path");

const srcRoot = path.join(__dirname, "..", "src");

const blockWithTransition =
  /\r?\n([ \t]*)<motion\.div\r?\n\1[ \t]*initial=\{\{ opacity: 0, y: 12 \}\}\r?\n\1[ \t]*animate=\{\{ opacity: 1, y: 0 \}\}\r?\n\1[ \t]*transition=\{\{[^\}]+\}\}\r?\n/g;

const blockNoTransition =
  /\r?\n([ \t]*)<motion\.div\r?\n\1[ \t]*initial=\{\{ opacity: 0, y: 12 \}\}\r?\n\1[ \t]*animate=\{\{ opacity: 1, y: 0 \}\}\r?\n/g;

const calendarBlock =
  /\r?\n([ \t]*)<motion\.div\r?\n\1[ \t]*initial=\{\{ opacity: 0, y: 8 \}\}\r?\n\1[ \t]*animate=\{\{ opacity: 1, y: 0 \}\}\r?\n\1[ \t]*transition=\{\{ duration: 0\.25, ease: \[0\.25, 0\.1, 0\.25, 1\] \}\}\r?\n/g;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(ent.name)) out.push(p);
  }
  return out;
}

function ensurePageTransitionImport(content) {
  if (!content.includes("{...pageTransitionProps}")) return content;
  if (
    /import\s*\{[^}]*\bpageTransitionProps\b[^}]*\}\s*from\s*["']@\/lib\/motion["']/.test(
      content,
    )
  ) {
    return content;
  }

  const motionImport = content.match(
    /import\s*\{([^}]*)\}\s*from\s*["']@\/lib\/motion["']/,
  );
  if (motionImport) {
    const inner = motionImport[1].trim();
    const names = inner
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!names.includes("pageTransitionProps")) {
      names.unshift("pageTransitionProps");
      return content.replace(
        /import\s*\{[^}]*\}\s*from\s*["']@\/lib\/motion["']/,
        `import { ${names.join(", ")} } from "@/lib/motion"`,
      );
    }
    return content;
  }

  if (/^"use client";/m.test(content)) {
    return content.replace(
      /^("use client";)\r?\n/,
      `$1\nimport { pageTransitionProps } from "@/lib/motion";\n`,
    );
  }

  return `import { pageTransitionProps } from "@/lib/motion";\n${content}`;
}

for (const file of walk(srcRoot)) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;

  s = s.replace(calendarBlock, (_, indent) => {
    return `\n${indent}<motion.div\n${indent}  {...pageTransitionProps}\n`;
  });

  s = s.replace(blockWithTransition, (_, indent) => {
    return `\n${indent}<motion.div\n${indent}  {...pageTransitionProps}\n`;
  });

  s = s.replace(blockNoTransition, (_, indent) => {
    return `\n${indent}<motion.div\n${indent}  {...pageTransitionProps}\n`;
  });

  if (s !== orig) {
    s = ensurePageTransitionImport(s);
    fs.writeFileSync(file, s, "utf8");
    console.log("updated:", path.relative(srcRoot, file));
  }
}
