<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Essential SEO -->
    <title>Melvok Mock API Generator | Free Dummy JSON API Online</title>
    <meta name="description"
        content="Free Mock API Generator - Create dummy JSON APIs instantly with Melvok. Generate fake endpoints for prototyping, testing, and frontend development." />
    <meta name="keywords"
        content="mock api generator, dummy json api, fake api, api prototyping, rapid frontend development, free mock endpoints, API testing, Melvok" />
    <meta name="author" content="Melvok Team" />
    <link rel="canonical" href="https://mock.melvok.com/" />

    <!-- Open Graph: Facebook, LinkedIn, etc -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://mock.melvok.com/" />
    <meta property="og:title" content="Melvok Mock API Generator | Free Dummy JSON API Online" />
    <meta property="og:description"
        content="Instantly generate free dummy JSON APIs from custom schema for prototyping, testing, and frontend development." />
    <meta property="og:image" content="https://mock.melvok.com/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Melvok" />

    <!-- Twitter/X Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@melvokapi" />
    <meta name="twitter:title" content="Melvok Mock API Generator | Free Dummy JSON API Online" />
    <meta name="twitter:description" content="Create mock JSON APIs instantly. Free endpoints, no signup." />
    <meta name="twitter:image" content="https://mock.melvok.com/og-image.jpg" />

    <!-- Favicon + App Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#191927" />



    <!-- Robots, indexing -->
    <meta name="robots" content="index, follow" />

    <!-- Mobile Web -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Fonts: Geist (via Inter) and Geist Mono (via JetBrains Mono as fallback) -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" />
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" />
    <style>
        :root {
            --font-sans: 'Inter', 'Geist', 'Segoe UI', Arial, sans-serif;
            --font-mono: 'JetBrains Mono', 'Geist Mono', 'Fira Mono', 'Menlo', monospace;
        }

        body {
            background: #101017;
            color: #e4e4ea;
            font-family: var(--font-sans);
            margin: 0;
            transition: background 0.2s;
        }

        /* Custom scrollbars for all scrollable elements */
        ::-webkit-scrollbar,
        *::-webkit-scrollbar {
            width: 10px;
            background: #181825;
        }

        ::-webkit-scrollbar-thumb,
        *::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #323245 40%, #6366f1 100%);
            border-radius: 8px;
        }

        ::-webkit-scrollbar-thumb:hover,
        *::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #8b5cf6, #323247 90%);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .card {
            background: #161621;
            border-radius: 14px;
            box-shadow: 0 2px 18px 0 #00000033;
            padding: 2rem;
            margin-bottom: 2rem;
            transition: box-shadow 0.1s;
        }

        .card:hover {
            box-shadow: 0 8px 18px 2px #12011c88;
        }

        .btn {
            background: linear-gradient(90deg, #6e38f7 0%, #8b5cf6 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            cursor: pointer;
            font-size: 1rem;
            margin-right: 8px;
            transition: background 0.18s;
            font-family: var(--font-sans);
        }

        .btn:hover {
            background: linear-gradient(90deg, #8b5cf6 0%, #6e38f7 100%);
        }

        .badge {
            display: inline-block;
            background: #222232;
            color: #bad6ff;
            border-radius: 5px;
            font-size: 0.85rem;
            padding: 0.25em 0.8em;
            margin-right: 6px;
            margin-bottom: 7px;
            font-weight: 500;
            letter-spacing: .03em;
            font-family: var(--font-sans);
        }

        .typed-text {
            font-size: 2.8rem;
            font-family: var(--font-sans);
            font-weight: 900;
            letter-spacing: -1px;
            display: inline-block;
            min-height: 62px;
            background: linear-gradient(92deg, #a264f7 25%, #6366f1 70%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .typed-cursor {
            display: inline-block;
            font-size: 2.5rem;
            color: #bad6ff;
            animation: blink 1s infinite;
        }

        @keyframes blink {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0;
            }
        }

        .section-title {
            font-size: 2.3rem;
            font-family: var(--font-sans);
            font-weight: 700;
            color: #fafafd;
            margin-bottom: 0.75em;
            text-align: center;
            letter-spacing: -.04em;
        }

        textarea,
        input {
            font-family: var(--font-mono);
            font-size: 1.12rem;
            background: #0f1023;
            color: #d6ecf7;
            border: 1px solid #282837;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.2em;
            width: 100%;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.15s, background 0.18s;
            resize: vertical;
        }

        textarea:focus,
        input:focus {
            border-color: #8b5cf6;
            background: #13131e;
        }

        .api-response {
            width: 100%;
            max-width: 820px;
            margin: 0 auto 2.5rem auto;
            background: #191927;
            border-radius: 10px;
            box-shadow: 0 2px 16px #0002;
            padding: 1.2em 1.2em 1em 1.2em;
            font-family: var(--font-mono);
            font-size: 1.09rem;
            color: #95e3bc;
            position: relative;
            z-index: 4;
            overflow-x: auto;
            overflow-y: auto;
            max-height: 330px;
        }

        .api-response-top {
            margin-bottom: 1.5em;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .api-response-url {
            color: #bad6ff;
            font-weight: 500;
            word-break: break-all;
            font-size: 0.99rem;
            font-family: var(--font-mono);
        }

        .api-response-clear {
            background: #222232;
            color: #bad6ff;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-family: var(--font-sans);
            padding: 0.4em 1em;
            cursor: pointer;
            transition: background 0.17s;
            margin-left: 1em;
        }

        .api-response-clear:hover {
            background: #2c2c44;
            color: #7f98ff;
        }

        pre {
            font-family: var(--font-mono);
            font-size: 1.09rem;
            background: #111115;
            color: #d6ecf7;
            border: 1px solid #282837;
            border-radius: 8px;
            padding: 0.7rem 1rem;
            margin-bottom: 1.2em;
            width: 100%;
            box-sizing: border-box;
            outline: none;
            overflow-x: auto;
            white-space: pre-wrap;
        }

        /* Playground - layout fix for full-width */
        .playground-flex {
            display: block;
            max-width: 850px;
            margin: 0 auto;
            position: relative;

        }

        @media (max-width: 800px) {
            .playground-flex {
                max-width: 100%;
            }

            .api-response {
                max-width: 99vw;
            }
        }

        /* Other sections unchanged */
        .grid {
            display: grid;
            gap: 2rem;
        }

        @media (min-width: 900px) {
            .features-grid {
                grid-template-columns: 1fr 1fr 1fr 1fr;
            }
        }

        /* FAQ Accordion, Testimonials, Footer unchanged from previous design */
        /* ...rest of your styles for .faq-list, etc... */
        .faq-list h3 {
            margin: 0.5rem 0;
            font-size: 1.13rem;
            color: #91baff;
            cursor: pointer;
            font-family: var(--font-sans);
        }

        .faq-item {
            background: #13131e;
            border-radius: 8px;
            margin-bottom: 1rem;
            transition: background 0.2s;
            overflow: hidden;
        }

        .faq-item.open {
            background: #191927;
        }

        .faq-content {
            display: none;
            padding: 0.55em 1em 1em 1em;
            color: #d7e4fb;
            font-size: 0.98rem;
            font-family: var(--font-sans);
        }

        .faq-item.open .faq-content {
            display: block;
        }

        .testimonials {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .testimonial-card {
            flex: 1;
            min-width: 300px;
            background: #191927;
            border-radius: 9px;
            padding: 1.4rem 1.2rem;
            margin-bottom: 1em;
            box-shadow: 0 2px 12px #0003;
            color: #cbdaf7;
            font-family: var(--font-sans);
        }

        .testimonial-avatar {
            width: 47px;
            height: 47px;
            border-radius: 50%;
            object-fit: cover;
            display: inline-block;
            vertical-align: middle;
            margin-right: 12px;
            border: 2px solid #6366f1;
            background: #101017;
        }

        .testimonial-author {
            font-weight: 600;
            color: #9aafff;
            font-size: 1.05rem;
            margin-top: 7px;
            letter-spacing: 0.01em;
            font-family: var(--font-sans);
        }

        footer {
            background: #181825;
            color: #757589;
            text-align: center;
            padding: 2.4rem 0 1rem 0;
            border-top: 1px solid #282837;
            font-size: 0.98rem;
            margin-top: 2rem;
            font-family: var(--font-sans);
        }
    </style>
    <!-- Schema.org JSON-LD: Rich search results -->
    <script type="application/ld+json">
<?php
echo json_encode([
  "@context" => "https://schema.org",
  "@type" => "WebSite",
  "name" => "Melvok Mock API Generator",
  "url" => "https://mock.melvok.com/",
  "description" => "Generate free dummy JSON APIs instantly from your own schema. Rapid prototyping, frontend development, and testing.",
  "image" => "https://mock.melvok.com/og-image.jpg",
  "creator" => ["@type" => "Organization", "name" => "Melvok"]
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
</script>


</head>

<body>
    <!-- Navigation Header -->
    <header id="hero" class="nav-header">
        <nav class="nav-container">
            <div class="nav-brand">
                <span class="nav-logo">MockApi</span>
            </div>
            <button class="nav-toggle" aria-label="Toggle Menu" onclick="toggleNavMenu()">
                <svg width="27" height="27" viewBox="0 0 27 27">
                    <rect y="6" width="27" height="3" rx="1.5" fill="#bad6ff" />
                    <rect y="13" width="27" height="3" rx="1.5" fill="#bad6ff" />
                    <rect y="20" width="27" height="3" rx="1.5" fill="#bad6ff" />
                </svg>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="#hero">Home</a></li>
                <li><a href="#playground">Playground</a></li>
                <li><a href="#docs">Docs</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#faq">FAQ</a></li>
            </ul>
        </nav>
    </header>
    <style>
        .nav-header {
            position: sticky;
            top: 0;
            left: 0;
            width: 100vw;
            z-index: 999;
            background: #141425e9;
            box-shadow: 0 2px 16px #0005;
            font-family: 'Inter', 'Geist', Arial, sans-serif;
            backdrop-filter: blur(8px);
        }

        .nav-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.1rem 1.5rem 1.1rem 1.6rem;
        }

        .nav-brand .nav-logo {
            color: #bad6ff;
            font-weight: 800;
            font-size: 1.33rem;
            letter-spacing: -.03em;
            font-family: 'Inter', 'Geist', Arial, sans-serif;
        }

        .nav-menu {
            list-style: none;
            display: flex;
            gap: 2.1em;
            align-items: center;
            margin: 0;
            padding: 0;
            font-size: 1.03rem;
            font-weight: 500;
            transition: opacity 0.18s;
        }

        .nav-menu li a {
            color: #e4e4ea;
            text-decoration: none;
            padding: 7px 11px;
            border-radius: 7px;
            transition: background .12s, color .14s;
            position: relative;
            font-family: 'Inter', 'Geist', Arial, sans-serif;
        }

        .nav-menu li a:hover,
        .nav-menu li a.active {
            background: #222232;
            color: #bad6ff;
        }

        .nav-toggle {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            margin-left: 1.2em;
        }

        @media (max-width: 900px) {
            .nav-menu {
                position: absolute;
                top: 62px;
                right: 0;
                flex-direction: column;
                width: 160px;
                background: #191927e9;
                box-shadow: 0 2px 12px #0007;
                align-items: flex-start;
                border-radius: 0 0 10px 10px;
                gap: 0.2em;
                opacity: 0;
                pointer-events: none;
                transform: translateY(-8px);
                transition: opacity 0.17s, transform 0.19s;
            }

            .nav-menu.show {
                opacity: 1;
                pointer-events: auto;
                transform: none;
            }

            .nav-toggle {
                display: inline-block;
            }
        }
    </style>
    <script>
        function toggleNavMenu() {
            var m = document.getElementById('navMenu');
            m.classList.toggle('show');
        }
        document.addEventListener('click', function(e) {
            var nav = document.getElementById('navMenu');
            var toggle = document.querySelector('.nav-toggle');
            if (nav && !nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('show');
            }
        });
        // Smooth scroll & activate link
        document.querySelectorAll('.nav-menu a').forEach(function(link) {
            link.onclick = function(e) {
                var href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                    document.getElementById('navMenu').classList.remove('show');
                }
            }
        });
    </script>

    <!-- Hero Section -->
    <section id="hero" style="padding:6rem 0 2rem 0; background:linear-gradient(91deg,#141425 60%,#192034 100%);">
        <div class="container" style="text-align:center;">
            <div class="typed-text" id="typed"></div>
            <span class="typed-cursor" id="typed-cursor">|</span>
            <p
                style="color:#e0e6fd; font-size:1.15rem; max-width:520px; margin:1.6em auto 2.5em auto;font-family:var(--font-sans);">
                Instantly create realistic mock JSON APIs for your projects from custom schema. Perfect for developers,
                testers, and rapid frontend prototyping—no backend setup required.
            </p>
            <a href="#playground" class="btn"
                style="text-decoration:none;;font-size:1.12rem;letter-spacing:0.01em;">🚀 Try the
                Playground</a>
            <div style="margin-top:2em">
                <span class="badge">Free</span>
                <span class="badge">No Signup</span>
                <span class="badge">Faker Powered</span>
                <span class="badge">24h Endpoints</span>
            </div>
        </div>
        <svg style="position:absolute;top:0;left:0;width:100%;height:25vh;z-index:-1;opacity:0.16;"
            viewBox="0 0 1440 320">
            <path fill="#5c51c4" fill-opacity="1" d="M0,96L720,288L1440,96L1440,0L720,0L0,0Z"></path>
        </svg>
    </section>

    <!-- Playground Section -->
    <section id="playground" style="padding:4rem 0 2rem 0;">
        <div class="playground-flex">
            <!-- API Response (hidden until AJAX yields result) -->
            <div id="responseCard" class="api-response" style="display:none;">
                <div class="api-response-top">
                    <div>
                        <span class="api-response-url" id="apiUrl"></span>
                    </div>
                    <button class="api-response-clear" onclick="clearResponse()" title="Hide Output">Clear
                        Output</button>
                </div>
                <pre id="apiJson"></pre>
            </div>
            <!-- Payload Editor: Full width -->
            <div class="card" style="width:100%; max-width:820px; margin:0 auto;">
                <h2 class="section-title" style="text-align:left; font-size:1.5rem; margin-bottom:1rem;">Define Your
                    Payload</h2>
                <textarea id="payload" rows="9"
                    placeholder='{
  "users":[{"name":"string","age":"number"}],
  "members":["string"]
}'></textarea>
                <button onclick="generateMock()" class="btn">Generate API</button>
                <div style="margin-top:1.6em; color:#8ff7fa; font-size:0.97rem;">
                    <span class="badge">Supports Nested JSON</span>
                    <span class="badge">Custom Row Count</span>
                </div>
            </div>
        </div>
    </section>
    <!-- Documentation Section -->
    <section id="docs" style="background:#161621;padding:3rem 0 3rem 0;">
        <div class="container">
            <h2 class="section-title">📘 Payload Documentation</h2>
            <p
                style="text-align:center;color:#b5c9ff;max-width:760px;margin:0 auto 2.5rem auto;font-size:1.1rem;font-family:var(--font-sans);">
                Define your JSON schema using simple rules. Melvok will automatically generate realistic dummy data for
                each field.
            </p>

            <div class="card" style="margin-bottom:2rem;">
                <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">Basic Types</h3>
                <pre>{
  "user": {
    "name": "name",
    "email": "email",
    "age": "number",
    "active": "bool"
  }
}</pre>
                <p style="color:#9ad7ff;">✅ Will generate: a random name, email, number (1–100), and true/false
                    boolean.
                </p>
            </div>

            <div class="card" style="margin-bottom:2rem;">
                <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">String Length</h3>
                <pre>{
  "bio": "string-50",
  "title": "string-20"
}</pre>
                <p style="color:#9ad7ff;">✅ Will generate sentences clipped to 50 and 20 characters respectively.</p>
            </div>

            <div class="card" style="margin-bottom:2rem;">
                <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">Number Ranges</h3>
                <pre>{
  "score": "number-1-10",
  "price": "number-50-500"
}</pre>
                <p style="color:#9ad7ff;">✅ Will generate numbers between given min and max range.</p>
            </div>

            <div class="card" style="margin-bottom:2rem;">
                <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">Arrays</h3>
                <pre>{
  "tags": ["string"],
  "members": ["name"]
}</pre>
                <p style="color:#9ad7ff;">✅ Arrays generate multiple values of the given type, based on
                    <code>rows</code>.
                </p>
            </div>

            <div class="card" style="margin-bottom:2rem;">
                <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">Nested Objects</h3>
                <pre>{
  "users": [
    {
      "id": "number",
      "profile": {
        "fullName": "name",
        "email": "email"
      }
    }
  ]
}</pre>
                <p style="color:#9ad7ff;">✅ Supports deeply nested JSON objects (up to 8 levels).</p>
            </div>

            <div class="card">
                <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">Special Types</h3>
                <pre>{
  "phone": "string-10",
  "isAdmin": "bool",
  "createdAt": "date"
}</pre>
                <p style="color:#9ad7ff;">✅ Extra support: <code>date</code>, <code>bool</code>, custom string lengths.
                </p>
            </div>
        </div>
    </section>

    <!-- Extra Features Section -->
    <section id="features" style="background:#161621;padding:3rem 0 3rem 0;">
        <div class="container">
            <h2 class="section-title">Why Melvok Stands Out?</h2>
            <div class="grid features-grid">
                <div class="card" style="min-height:170px;">
                    <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">⚡ Blazing Fast</h3>
                    <p style="font-family:var(--font-sans);">Create APIs in seconds—no backend, no signup. Rapid
                        iterating for frontend teams.</p>
                </div>
                <div class="card" style="min-height:170px;">
                    <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">🤖 Realistic Fake Data</h3>
                    <p style="font-family:var(--font-sans);">Powered by Faker: emails, names, addresses,
                        numbers—perfect
                        for UI demos and tests.</p>
                </div>
                <div class="card" style="min-height:170px;">
                    <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">🛡️ Private & Temporary
                    </h3>
                    <p style="font-family:var(--font-sans);">Endpoints expire in 24 hours. No manual cleanup. Your mock
                        data is never stored permanently.</p>
                </div>
                <div class="card" style="min-height:170px;">
                    <h3 style="color:#bad6ff;font-weight:600;font-family:var(--font-sans);">🧩 Deeply Nested JSON</h3>
                    <p style="font-family:var(--font-sans);">Supports complex schemas—arrays, objects, nested objects
                        with a depth of up to 8 levels.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" style="background:#141425;padding:2.7rem 0 2rem 0;">
        <div class="container">
            <h2 class="section-title">Loved by Developers</h2>
            <div class="testimonials">
                <div class="testimonial-card">
                    <img class="testimonial-avatar" src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Dev avatar" />
                    <div>
                        <strong class="testimonial-author">Rohit D., Frontend Engineer</strong>
                        <p>Mocking endpoints in seconds seriously sped up our React dev workflow. Melvok is now part of
                            our prototyping toolkit.</p>
                    </div>
                </div>
                <div class="testimonial-card">
                    <img class="testimonial-avatar" src="https://randomuser.me/api/portraits/women/45.jpg"
                        alt="Dev avatar" />
                    <div>
                        <strong class="testimonial-author">Aaliya M., QA Lead</strong>
                        <p>Being able to test different payload formats, edge cases and error codes—without asking
                            backend for help—made our testing marathon much easier!</p>
                    </div>
                </div>
                <div class="testimonial-card">
                    <img class="testimonial-avatar" src="https://randomuser.me/api/portraits/men/99.jpg"
                        alt="Dev avatar" />
                    <div>
                        <strong class="testimonial-author">Jay P., Product Designer</strong>
                        <p>Great for component previews and copywriting reviews. The temporary endpoints are super
                            convenient!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" style="background:#181825;padding:3rem 0 .5rem 0;">
        <div class="container">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <div class="faq-list">
                <div class="faq-item">
                    <h3 onclick="toggleFaq(this)">What is a Mock API Generator?</h3>
                    <div class="faq-content">A Mock API Generator instantly creates dummy API endpoints responding with
                        flexible, fake JSON data. Useful for frontend, demos, testing, and integration prototyping.
                    </div>
                </div>
                <div class="faq-item">
                    <h3 onclick="toggleFaq(this)">Do I need to register?</h3>
                    <div class="faq-content">No registration or API key is needed. Just paste a JSON schema and
                        generate endpoints right away.</div>
                </div>
                <div class="faq-item">
                    <h3 onclick="toggleFaq(this)">Can I create nested and custom schemas?</h3>
                    <div class="faq-content">Absolutely! Melvok supports arrays, objects, and deeply nested JSON up to
                        8 levels. Each key value type may be "string", "number", etc.</div>
                </div>
                <div class="faq-item">
                    <h3 onclick="toggleFaq(this)">How long do endpoints exist?</h3>
                    <div class="faq-content">Your generated endpoint remains active for 24 hours then auto-deletes—no
                        cleanup required.</div>
                </div>
                <div class="faq-item">
                    <h3 onclick="toggleFaq(this)">Is it free to use?</h3>
                    <div class="faq-content">Yes, all basic Melvok endpoints are always free.</div>
                </div>
                <div class="faq-item">
                    <h3 onclick="toggleFaq(this)">Can I request specific data types?</h3>
                    <div class="faq-content">You can define types for each field: "string", "number", "date", "email",
                        etc. Faker will generate suitable mock data.</div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <p>&copy; 2025 Melvok. All rights reserved. </p>
    </footer>

    <!-- Typed Hero Animation -->
    <script>
        // Simple Typed.js replacement
        const typedStrings = [
            "Mock APIs, instantly.",
            "No backend required.",
            "Create endpoints with custom JSON.",
            "Faker-powered dummy data.",
            "Rapid prototyping, easier than ever!"
        ];
        let typedIndex = 0,
            charIndex = 0,
            isDeleting = false;

        function typeHero() {
            const el = document.getElementById("typed");
            const cursor = document.getElementById("typed-cursor");
            if (!el || !cursor) return;
            const current = typedStrings[typedIndex];
            if (!isDeleting) {
                el.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(typeHero, 1300);
                    cursor.style.opacity = 0;
                    setTimeout(() => cursor.style.opacity = 1, 800);
                } else {
                    setTimeout(typeHero, 55 + Math.random() * 18);
                }
            } else {
                el.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    typedIndex = (typedIndex + 1) % typedStrings.length;
                    setTimeout(typeHero, 500);
                } else {
                    setTimeout(typeHero, 30);
                }
            }
        }
        window.addEventListener('DOMContentLoaded', typeHero);

        // Mock API Playground logic: show response card above, hide on Clear
        async function generateMock() {
            const payload = document.getElementById('payload').value;
            const responseCard = document.getElementById('responseCard');
            const apiUrl = document.getElementById('apiUrl');
            const apiJson = document.getElementById('apiJson');
            // Show and indicate loading
            responseCard.style.display = 'block';
            apiUrl.textContent = '⏳ Generating endpoint...';
            apiJson.textContent = '';
            try {
                const res = await fetch("/api/mock/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        schema: payload,
                        rows: 5
                    })
                });
                const data = await res.json();
                if (data.endpoint) {
                    apiUrl.textContent = data.endpoint;
                    apiJson.textContent = JSON.stringify(data.preview, null, 2);
                } else {
                    apiUrl.textContent = "❌ Invalid response.";
                    apiJson.textContent = "";
                }
            } catch (e) {
                apiUrl.textContent = "❌ Request failed.";
                apiJson.textContent = e.message || "Unknown error.";
            }
        }

        // Hide the API response card
        function clearResponse() {
            document.getElementById('responseCard').style.display = 'none';
        }

        // FAQ accordion logic
        function toggleFaq(hdr) {
            const item = hdr.parentElement;
            item.classList.toggle('open');
        }
    </script>
</body>

</html>
