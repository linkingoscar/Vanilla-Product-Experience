/**
 * Modern Static Landing Page Template Engine
 * Canonical Demo: Cursor 3.x Visual Introduction
 * 
 * 💡 TEMPLATE ARCHITECTURE:
 * - TEMPLATE:CORE     -> Dynamic island nav, smooth scroll, theme toggle, scroll animations
 * - TEMPLATE:OPTIONAL -> Feature tabs filter, Command Palette (⌘K), Interactive playgrounds
 * - TEMPLATE:EDIT     -> Configurable data arrays (Search index, scenario configs)
 * - DEMO:CURSOR       -> Current Cursor-specific demo copy and models
 */

(function () {
  "use strict";

  const isEn = document.documentElement.lang.startsWith("en");

  // ==========================================================================
  // TEMPLATE:CORE — 1. Dynamic Island Navigation & Smooth Scroll
  // ==========================================================================
  const island = document.querySelector(".island");
  const navLinks = document.querySelectorAll(".island-nav a[href^='#']");
  
  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  function getHeaderOffset() {
    return island ? island.offsetHeight + 24 : 72;
  }

  function scrollToTarget(targetEl) {
    if (!targetEl) return;
    const offset = getHeaderOffset();
    const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, targetPos),
      behavior: "smooth",
    });

    targetEl.setAttribute("tabindex", "-1");
    targetEl.focus({ preventScroll: true });
  }

  if (sections.length > 0) {
    function updateActiveNav() {
      const scrollPos = window.scrollY + getHeaderOffset() + 20;
      let currentSection = null;

      for (const section of sections) {
        if (section.el.offsetTop <= scrollPos) {
          currentSection = section;
        }
      }

      sections.forEach(({ link }) => link.classList.remove("is-active"));
      if (currentSection) {
        currentSection.link.classList.add("is-active");
      }
    }

    let isScrolling = false;
    window.addEventListener("scroll", () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          updateActiveNav();
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, { passive: true });

    updateActiveNav();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        scrollToTarget(targetEl);
      }
    });
  });

  // ==========================================================================
  // TEMPLATE:OPTIONAL — 2. Feature Category Filter Tabs
  // ==========================================================================
  const tabBtns = document.querySelectorAll(".feature-tabs .tab-btn");
  const featureCards = document.querySelectorAll(".feature-grid .feature-card");

  if (tabBtns.length > 0 && featureCards.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-filter");

        tabBtns.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        featureCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");
          const matches = category === "all" || cardCategory === category;

          if (matches) {
            card.classList.remove("is-hidden");
            window.requestAnimationFrame(() => {
              card.classList.add("is-visible");
            });
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });
  }

  // ==========================================================================
  // TEMPLATE:OPTIONAL — 3. Command Palette (⌘K / Ctrl+K)
  // ==========================================================================
  const cmdBackdrop = document.getElementById("cmdPalette");
  const cmdInput = document.getElementById("cmdInput");
  const cmdResults = document.getElementById("cmdResults");
  const openCmdBtns = document.querySelectorAll(".open-cmd-palette");

  // TEMPLATE:EDIT — Search Index entries (DEMO:CURSOR default items)
  const searchIndex = isEn ? [
    { title: "Self-hosted Machines & Team Pools", cat: "Enterprise", target: "#new-features" },
    { title: "Computer Use on Linux & Mac", cat: "Workflow", target: "#new-features" },
    { title: "Cursor Origin Code Hosting", cat: "Enterprise", target: "#new-features" },
    { title: "Start from scratch & Live Preview", cat: "Workflow", target: "#new-features" },
    { title: "Harness Subscriptions & /goal Workflow", cat: "Swarm", target: "#new-features" },
    { title: "Grok 4.6 Flagship Model (Effort Levels)", cat: "Models", target: "#new-features" },
    { title: "JetBrains IDE Support (ACP Protocol)", cat: "Workflow", target: "#new-features" },
    { title: "Side Chats (/side, /btw)", cat: "Workflow", target: "#new-features" },
    { title: "Cursor for iOS & iPadOS", cat: "Mobile", target: "#new-features" },
    { title: "Event-Driven Automations (/automate)", cat: "Enterprise", target: "#new-features" },
    { title: "Multi-agent Swarm", cat: "Swarm", target: "#new-features" },
    { title: "Composer 3.0 / 2.5 Benchmarks", cat: "Models", target: "#composer-25" },
    { title: "Deep Research Mode", cat: "Models", target: "#new-features" },
    { title: "Workspace Sidecar Live Preview", cat: "Workflow", target: "#new-features" },
    { title: "Auto-review Verification", cat: "Security", target: "#new-features" },
    { title: "Sandboxed Browser Action", cat: "Workflow", target: "#new-features" },
    { title: "Agents Window Redesign", cat: "Highlights", target: "#highlights" },
    { title: "Design Mode UI Feedback", cat: "Highlights", target: "#highlights" },
    { title: "Pro+ / Ultra / Start Pricing Plans", cat: "Pricing", target: "#pricing" },
    { title: "AI Coding Competitor Matrix", cat: "Compare", target: "#compare" },
    { title: "ROI Cost Calculator", cat: "Calculator", target: "#roi-calculator" },
    { title: "Interactive Composer Simulator", cat: "Playground", target: "#composer-simulator" }
  ] : [
    { title: "Self-hosted Machines 自托管算力与机器池", cat: "企业安全", target: "#new-features" },
    { title: "Computer Use 计算机原生界面操控", cat: "开发工作流", target: "#new-features" },
    { title: "Cursor Origin 原生代码托管平台", cat: "企业安全", target: "#new-features" },
    { title: "Start from scratch 零仓库启动与即时预览", cat: "开发工作流", target: "#new-features" },
    { title: "Harness 事件订阅、/goal 与独立沙箱", cat: "多智能体", target: "#new-features" },
    { title: "Grok 4.6 旗舰模型 (4 档思考深度)", cat: "核心模型", target: "#new-features" },
    { title: "JetBrains 全系 IDE 支持 (ACP 协议)", cat: "开发工作流", target: "#new-features" },
    { title: "Side Chats 旁支对话 (/side, /btw)", cat: "开发工作流", target: "#new-features" },
    { title: "Cursor for iOS / iPadOS 移动端审查", cat: "移动工作区", target: "#new-features" },
    { title: "事件驱动常驻 Agent (/automate)", cat: "企业安全", target: "#new-features" },
    { title: "Multi-agent Swarm 蜂群协作", cat: "多智能体", target: "#new-features" },
    { title: "Composer 3.0 / 2.5 深度评测", cat: "核心模型", target: "#composer-25" },
    { title: "Deep Research 深度研究模式", cat: "核心模型", target: "#new-features" },
    { title: "Workspace Sidecar 侧边栏实时预览", cat: "开发工作流", target: "#new-features" },
    { title: "Auto-review 智能审查模式", cat: "企业安全", target: "#new-features" },
    { title: "Sandboxed Browser 沙盒浏览器", cat: "开发工作流", target: "#new-features" },
    { title: "Agents Window 统一工作区", cat: "亮点速览", target: "#highlights" },
    { title: "Design Mode 界面视觉标注", cat: "亮点速览", target: "#highlights" },
    { title: "Pro+ / Ultra / Start 定价方案", cat: "定价方案", target: "#pricing" },
    { title: "AI 编程工具竞品横向对比", cat: "竞品对比", target: "#compare" },
    { title: "ROI 年度 Token 成本节约测算器", cat: "交互工具", target: "#roi-calculator" },
    { title: "Composer 智能体实时交互模拟器", cat: "实操演练", target: "#composer-simulator" }
  ];

  let selectedIndex = 0;
  let currentFiltered = searchIndex;

  function renderCmdResults(items) {
    if (!cmdResults) return;
    cmdResults.innerHTML = "";
    currentFiltered = items;

    if (items.length === 0) {
      cmdResults.innerHTML = `<li style="padding:16px;text-align:center;color:var(--text-tertiary);font-size:13px;">${isEn ? 'No matching commands found' : '未搜索到匹配的功能或章节'}</li>`;
      return;
    }

    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = `cmd-item ${index === selectedIndex ? "is-selected" : ""}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", index === selectedIndex ? "true" : "false");
      li.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-category-tag">${item.cat}</span>
          <span>${item.title}</span>
        </div>
        <span style="font-size:11.5px;color:var(--text-tertiary);">Jump ↵</span>
      `;

      li.addEventListener("click", () => {
        selectCmdItem(item);
      });

      cmdResults.appendChild(li);
    });
  }

  function selectCmdItem(item) {
    closeCmdPalette();
    const target = document.querySelector(item.target);
    if (target) {
      scrollToTarget(target);
    }
  }

  function openCmdPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add("is-open");
    cmdBackdrop.setAttribute("aria-hidden", "false");
    selectedIndex = 0;
    if (cmdInput) {
      cmdInput.value = "";
      renderCmdResults(searchIndex);
      setTimeout(() => cmdInput.focus(), 50);
    }
  }

  function closeCmdPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove("is-open");
    cmdBackdrop.setAttribute("aria-hidden", "true");
  }

  openCmdBtns.forEach((btn) => btn.addEventListener("click", openCmdPalette));

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener("click", (e) => {
      if (e.target === cmdBackdrop) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = searchIndex.filter((item) =>
        item.title.toLowerCase().includes(query) || item.cat.toLowerCase().includes(query)
      );
      selectedIndex = 0;
      renderCmdResults(filtered);
    });

    cmdInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentFiltered.length > 0) {
          selectedIndex = (selectedIndex + 1) % currentFiltered.length;
          renderCmdResults(currentFiltered);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentFiltered.length > 0) {
          selectedIndex = (selectedIndex - 1 + currentFiltered.length) % currentFiltered.length;
          renderCmdResults(currentFiltered);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFiltered.length > 0 && currentFiltered[selectedIndex]) {
          selectCmdItem(currentFiltered[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        closeCmdPalette();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains("is-open")) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
    if (e.key === "Escape" && cmdBackdrop && cmdBackdrop.classList.contains("is-open")) {
      closeCmdPalette();
    }
  });

  // ==========================================================================
  // TEMPLATE:OPTIONAL — 4. Interactive Composer & Swarm Simulator (DEMO:CURSOR)
  // ==========================================================================
  const simChips = document.querySelectorAll(".prompt-chips .chip-btn");
  const simSteps = document.querySelectorAll(".sim-steps .sim-step");
  const simCodeEl = document.getElementById("simCodeText");
  const simStatusPill = document.getElementById("simStatusPill");

  const simScenarios = {
    auth: {
      step1: isEn ? "Architect: Decomposing JWT + Refresh Token Architecture..." : "Architect: 拆解 JWT + 刷新令牌架构规范...",
      step2: isEn ? "Coder: Generating AuthService.ts & middleware..." : "Coder: 编写 AuthService.ts 与鉴权中间件...",
      step3: isEn ? "Tester: Running 18 Auth security assertions..." : "Tester: 正在执行 18 组鉴权安全断言测试...",
      code: `// AuthService.ts (Auto-generated by Composer 3.0)
import { signToken, verifyHash } from './crypto';

export class AuthService {
  async authenticate(user: UserCredentials): Promise<AuthPayload> {
    const valid = await verifyHash(user.password, user.storedHash);
    if (!valid) throw new UnauthorizedError('INVALID_CREDENTIALS');
    
    return {
      accessToken: signToken({ sub: user.id }, { expiresIn: '15m' }),
      refreshToken: signToken({ sub: user.id }, { expiresIn: '7d' })
    };
  }
}`
    },
    bento: {
      step1: isEn ? "Architect: Computing responsive CSS Grid column tracks..." : "Architect: 计算响应式 Bento Grid 列轨与断点...",
      step2: isEn ? "Coder: Generating BentoGrid.tsx & glassmorphic tokens..." : "Coder: 生成 BentoGrid.tsx 与毛玻璃材质样式...",
      step3: isEn ? "Tester: Sidecar viewport DOM stress test..." : "Tester: 正在通过 Sidecar 进行多端视口渲染测试...",
      code: `// BentoGrid.tsx (Swarm parallel generated)
export const BentoGrid = ({ items }: BentoProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
    {items.map((item, i) => (
      <BentoCard key={i} span={item.isHero ? 'col-span-2 row-span-2' : ''} {...item} />
    ))}
  </div>
);`
    },
    tests: {
      step1: isEn ? "Architect: Inspecting uncovered endpoints..." : "Architect: 扫描未覆盖的核心 API 端点...",
      step2: isEn ? "Coder: Mocking db fixtures & generating spec suites..." : "Coder: 编写 Mock 测试夹具与断言套件...",
      step3: isEn ? "Tester: Executing Vitest test suite with coverage..." : "Tester: 执行 Vitest 全量并发测试套件...",
      code: `// api.spec.ts (Autonomous Debugger Loop)
import { describe, it, expect } from 'vitest';
import { app } from './server';

describe('POST /api/v1/swarm/dispatch', () => {
  it('dispatches 3 parallel agents with status 200', async () => {
    const res = await app.request('/api/v1/swarm/dispatch', { method: 'POST' });
    expect(res.status).toBe(200);
    expect(res.body.agents).toHaveLength(3);
  });
});`
    }
  };

  let simTimer = null;

  function runSimulation(type) {
    if (!simScenarios[type]) return;
    const scenario = simScenarios[type];

    if (simTimer) clearTimeout(simTimer);

    simSteps.forEach((s) => {
      s.classList.remove("active", "done");
    });

    if (simSteps[0]) {
      simSteps[0].classList.add("active");
      simSteps[0].querySelector("span").textContent = scenario.step1;
    }
    if (simCodeEl) simCodeEl.textContent = "// Swarm Coordinator initializing...";
    if (simStatusPill) {
      simStatusPill.className = "status-badge status-mid";
      simStatusPill.textContent = isEn ? "Decomposing..." : "任务拆解中...";
    }

    simTimer = setTimeout(() => {
      if (simSteps[0]) {
        simSteps[0].classList.remove("active");
        simSteps[0].classList.add("done");
      }
      if (simSteps[1]) {
        simSteps[1].classList.add("active");
        simSteps[1].querySelector("span").textContent = scenario.step2;
      }
      if (simCodeEl) simCodeEl.textContent = scenario.code;

      simTimer = setTimeout(() => {
        if (simSteps[1]) {
          simSteps[1].classList.remove("active");
          simSteps[1].classList.add("done");
        }
        if (simSteps[2]) {
          simSteps[2].classList.add("active");
          simSteps[2].querySelector("span").textContent = scenario.step3;
        }

        simTimer = setTimeout(() => {
          if (simSteps[2]) {
            simSteps[2].classList.remove("active");
            simSteps[2].classList.add("done");
          }
          if (simStatusPill) {
            simStatusPill.className = "status-badge status-strong";
            simStatusPill.textContent = isEn ? "✓ Swarm Verified (100%)" : "✓ 蜂群验证通过 (100%)";
          }
        }, 1200);
      }, 1400);
    }, 1000);
  }

  simChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      simChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      runSimulation(chip.getAttribute("data-type"));
    });
  });

  // Run initial simulation if available
  if (simChips.length > 0) {
    runSimulation("auth");
  }

  // ==========================================================================
  // TEMPLATE:OPTIONAL — 5. Interactive ROI & Cost Calculator (DEMO:CURSOR)
  // ==========================================================================
  const devSlider = document.getElementById("devSlider");
  const taskSlider = document.getElementById("taskSlider");
  const devValText = document.getElementById("devValText");
  const taskValText = document.getElementById("taskValText");
  const annualSavingsText = document.getElementById("annualSavingsText");
  const costCompareText = document.getElementById("costCompareText");

  function calculateROI() {
    if (!devSlider || !taskSlider) return;
    const devs = parseInt(devSlider.value, 10);
    const tasksPerDay = parseInt(taskSlider.value, 10);

    if (devValText) devValText.textContent = `${devs} ${isEn ? 'Engineers' : '人'}`;
    if (taskValText) taskValText.textContent = `${tasksPerDay} ${isEn ? 'Tasks/day' : '次/天'}`;

    // Opus 4.7 ~$4.10/task vs Composer 2.5 ~$0.07/task (Savings ~$4.03/task)
    const workDays = 250;
    const totalTasksYear = devs * tasksPerDay * workDays;
    const opusCost = totalTasksYear * 4.10;
    const composerCost = totalTasksYear * 0.07;
    const savings = Math.round(opusCost - composerCost);

    if (annualSavingsText) {
      annualSavingsText.textContent = `$${savings.toLocaleString()}`;
    }
    if (costCompareText) {
      costCompareText.textContent = `$${Math.round(composerCost).toLocaleString()} vs $${Math.round(opusCost).toLocaleString()}`;
    }
  }

  if (devSlider && taskSlider) {
    devSlider.addEventListener("input", calculateROI);
    taskSlider.addEventListener("input", calculateROI);
    calculateROI();
  }

  // ==========================================================================
  // TEMPLATE:CORE — 6. View Transitions Theme Switcher & Persistence
  // ==========================================================================
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function safeGetStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  function getPreferredTheme() {
    const saved = safeGetStorage("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    safeSetStorage("theme", theme);
    
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? (isEn ? "Switch to Light Mode" : "切换亮色模式") : (isEn ? "Switch to Dark Mode" : "切换暗色模式")
      );
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#08090e" : "#fbfbfd"
      );
    }
  }

  function setTheme(theme) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        applyTheme(theme);
      });
    } else {
      applyTheme(theme);
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!safeGetStorage("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // ==========================================================================
  // TEMPLATE:CORE — 7. Video Iframes CSP-Safe Loading & Scroll Animations
  // ==========================================================================
  const videoFrames = document.querySelectorAll(".video-frame");
  videoFrames.forEach((frame) => {
    const iframe = frame.querySelector("iframe");
    if (iframe) {
      iframe.addEventListener("load", () => {
        frame.classList.add("loaded");
      });
      setTimeout(() => frame.classList.add("loaded"), 2500);
    }
  });

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", () => {
      window.requestAnimationFrame(toggleBackToTop);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleBackToTop();
  }

  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll, .bento-card, .feature-card, .pricing-card, .timeline-item"
  );

  if ("IntersectionObserver" in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add("is-visible"));
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      const swUrl = new URL("sw.js", manifestLink ? manifestLink.href : document.baseURI).href;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    });
  }
})();
