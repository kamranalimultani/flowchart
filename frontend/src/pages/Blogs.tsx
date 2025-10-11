import { Helmet } from "react-helmet-async";
import { Calendar, ArrowRight } from "lucide-react";
import cardImage from "../assets/banner.png";

const blogs = [
  {
    title: "What is a Flow-Based Survey and Why It’s the Future",
    desc: "Discover how Melvok Flow Surveys turn static forms into engaging visual experiences for users and teams.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?workflow",
  },
  {
    title: "Visual Data Collection: The Power of Connected Flows",
    desc: "Learn how visual workflows help you understand and analyze responses better.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?data",
  },
  {
    title: "Boost Team Collaboration with Interactive Flow Surveys",
    desc: "See how teams can build, share, and analyze surveys visually using Melvok Flow.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?teamwork",
  },
  {
    title: "10 Reasons to Switch from Traditional Forms to Melvok",
    desc: "Traditional forms are outdated. Discover why Melvok Flow is the modern alternative.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?technology",
  },
  {
    title: "Connecting Surveys with Analytics Dashboards",
    desc: "Bridge the gap between survey data and insights — all within Melvok Flow.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?analytics",
  },
  {
    title: "How Melvok Simplifies Data-Driven Decision Making",
    desc: "Turn raw survey responses into actionable insights with Melvok’s smart flow engine.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?decision",
  },
  {
    title: "From Forms to Flows: The UX Revolution",
    desc: "Why user experience matters in surveys — and how Melvok Flow makes it delightful.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?ux",
  },
  {
    title: "Integrate AI with Your Surveys",
    desc: "Use Melvok Flow’s AI integration to auto-summarize responses and predict trends.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?ai",
  },
  {
    title: "Gamify Your Surveys for Better Engagement",
    desc: "Engage respondents like never before using interactive flows and progress-based visuals.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?gamification",
  },
  {
    title: "No-Code Survey Builder for Everyone",
    desc: "Melvok Flow lets anyone build powerful surveys with zero code.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?nocode",
  },
  {
    title: "Melvok Flow for Enterprises: Scale with Confidence",
    desc: "Built to handle teams, permissions, and analytics at enterprise scale.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?enterprise",
  },
  {
    title: "Export Survey Data to Excel, PDF, or API",
    desc: "Flexible export options let you work your way with Melvok Flow.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?export",
  },
  {
    title: "How Visual Surveys Improve Response Accuracy",
    desc: "Visual flow surveys lead to better understanding and more accurate data.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?accuracy",
  },
  {
    title: "Connect Your CRM with Melvok Flow Surveys",
    desc: "Seamlessly integrate with popular CRMs for automated response tracking.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?crm",
  },
  {
    title: "Understand User Journeys with Flow Maps",
    desc: "Visualize every step users take during a survey — from start to finish.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?journey",
  },
  {
    title: "Improve Feedback Loops with Flow Insights",
    desc: "Instant feedback visualization helps you act fast and smarter.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?feedback",
  },
  {
    title: "Melvok Flow for Education and Research",
    desc: "Perfect for teachers, universities, and research teams.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?education",
  },
  {
    title: "How to Embed Flow Surveys in Websites",
    desc: "Add interactive Melvok Flow surveys directly to your website or dashboard.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?embed",
  },
  {
    title: "Designing Surveys That Feel Human",
    desc: "Human-centered survey design is key to higher completion rates.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?design",
  },
  {
    title: "The Future of Flow-Based Analytics",
    desc: "See what’s next for Melvok and the world of visual data collection.",
    date: "Oct 2025",
    image: "https://source.unsplash.com/featured/?future",
  },
];

export default function BlogsPage() {
  return (
    <>
      <Helmet>
        <title>Flow-Based Survey Solutions | Melvok Use Cases</title>
        <meta
          name="description"
          content="Discover how flow-based surveys power market research, customer feedback, onboarding, workflow automation, and more. Melvok adapts to any organizational process."
        />
        <meta
          name="keywords"
          content="survey use cases, flow survey solutions, market research survey, employee onboarding, feedback surveys, workflow automation, customizable surveys, process surveys, HR survey tool"
        />
        <link rel="canonical" href="https://melvok.com/use-cases" />
        <meta
          property="og:title"
          content="Use Cases for Melvok Flow-Based Surveys"
        />
        <meta
          property="og:description"
          content="Explore powerful applications of Melvok in real business, research, and automation scenarios."
        />
        <meta
          property="og:image"
          content="https://melvok.com/og-image-usecases.jpg"
        />
        <meta property="og:url" content="https://melvok.com/use-cases" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Melvok Flow Blogs
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Insights, guides, and stories about the future of visual surveys &
          analytics.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden bg-white"
            >
              <img
                src={cardImage}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {blog.date}
                </div>
                <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{blog.desc}</p>
                <button className="flex items-center text-gray-800 font-medium hover:underline">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
