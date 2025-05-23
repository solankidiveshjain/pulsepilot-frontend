"use client"

import { motion } from "framer-motion"
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, MessageSquare, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const platformIcons = [
  { name: "YouTube", icon: "/youtube.svg" },
  { name: "Instagram", icon: "/instagram.svg" },
  { name: "X", icon: "/twitter.svg" },
  { name: "TikTok", icon: "/tiktok.svg" },
  { name: "Facebook", icon: "/facebook.svg" },
  { name: "LinkedIn", icon: "/linkedin.svg" },
]

export default function LandingPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGetStarted = () => {
    router.push("/onboarding/profile")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl">
              Pulse<span className="text-primary">Pilot</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              ))}
            </nav>
            <ModeToggle />
            <Button onClick={handleGetStarted}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/10 -z-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
                  Unified Social Media Management
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Manage All Your <span className="text-primary">Social Comments</span> In One Place
                </h1>
                <p className="text-xl text-muted-foreground">
                  PulsePilot helps creators and brands respond to comments across all platforms with AI-powered
                  suggestions and analytics.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={handleGetStarted} className="group">
                    <span>Get Started For Free</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">Integrates with all major platforms</p>
                  <div className="flex flex-wrap gap-4">
                    {platformIcons.map((platform) => (
                      <div
                        key={platform.name}
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-background shadow-sm"
                      >
                        <Image
                          src={platform.icon || "/placeholder.svg"}
                          alt={platform.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
              >
                <div className="relative z-10 bg-background rounded-xl shadow-2xl border border-border/40 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-secondary" />
                  <div className="p-1">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=600&width=800"
                        alt="PulsePilot Dashboard"
                        width={800}
                        height={600}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -z-10 -top-6 -left-6 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { label: "Active Users", value: "10,000+" },
                { label: "Comments Managed", value: "1M+" },
                { label: "Time Saved", value: "87%" },
                { label: "Platforms Supported", value: "6+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-background shadow-sm"
                  variants={fadeIn}
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features to Streamline Your Workflow</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to manage social media comments efficiently in one place
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: <MessageSquare className="h-10 w-10 text-primary" />,
                  title: "Unified Comment Stream",
                  description: "View and respond to comments from all your social platforms in a single dashboard.",
                },
                {
                  icon: <Zap className="h-10 w-10 text-primary" />,
                  title: "AI-Powered Replies",
                  description: "Generate personalized responses with our advanced AI that matches your brand voice.",
                },
                {
                  icon: <BarChart3 className="h-10 w-10 text-primary" />,
                  title: "Engagement Analytics",
                  description: "Track performance metrics and gain insights to improve your content strategy.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-8 rounded-xl bg-background border border-border/40 shadow-sm hover:shadow-md transition-all"
                  variants={fadeIn}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How PulsePilot Works</h2>
              <p className="text-xl text-muted-foreground">Get started in minutes with these simple steps</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Connection line (desktop only) */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 -translate-y-1/2 hidden md:block" />

              {[
                {
                  step: "01",
                  title: "Connect Your Accounts",
                  description: "Link your social media accounts with just a few clicks.",
                },
                {
                  step: "02",
                  title: "Customize Your Settings",
                  description: "Set up your preferences, tone, and response templates.",
                },
                {
                  step: "03",
                  title: "Manage & Respond",
                  description: "Start managing comments and engaging with your audience.",
                },
              ].map((step, index) => (
                <motion.div key={index} className="relative z-10" variants={fadeIn}>
                  <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background border border-border/40 shadow-sm h-full">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-6 text-primary-foreground font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground">Join thousands of creators and brands who love PulsePilot</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  quote: "PulsePilot has completely transformed how I manage comments. I save hours every day!",
                  author: "Sarah Johnson",
                  role: "Content Creator",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "The AI suggestions are spot-on and match our brand voice perfectly. Our engagement has increased by 40%.",
                  author: "Michael Chen",
                  role: "Marketing Director",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "As someone managing multiple social accounts, PulsePilot has been a game-changer for our team's workflow.",
                  author: "Emma Rodriguez",
                  role: "Social Media Manager",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-xl bg-background border border-border/40 shadow-sm flex flex-col h-full"
                  variants={fadeIn}
                >
                  <div className="flex-1">
                    <div className="text-4xl text-primary mb-4">&quot;</div>
                    <p className="italic mb-6">{testimonial.quote}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground">Choose the plan that works best for your needs</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  name: "Starter",
                  price: "$0",
                  description: "Perfect for individuals just getting started",
                  features: [
                    "Connect up to 3 social accounts",
                    "Basic comment management",
                    "5 AI-generated replies per day",
                    "7-day comment history",
                  ],
                  cta: "Get Started",
                  popular: false,
                },
                {
                  name: "Pro",
                  price: "$29",
                  period: "/month",
                  description: "Ideal for growing creators and small brands",
                  features: [
                    "Connect up to 10 social accounts",
                    "Advanced comment management",
                    "Unlimited AI-generated replies",
                    "30-day comment history",
                    "Priority support",
                  ],
                  cta: "Get Started",
                  popular: true,
                },
                {
                  name: "Business",
                  price: "$99",
                  period: "/month",
                  description: "For teams and established brands",
                  features: [
                    "Connect unlimited social accounts",
                    "Team collaboration tools",
                    "Advanced analytics dashboard",
                    "Custom AI training",
                    "90-day comment history",
                    "24/7 priority support",
                  ],
                  cta: "Contact Sales",
                  popular: false,
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  className={`p-8 rounded-xl bg-background border ${plan.popular ? "border-primary shadow-lg relative" : "border-border/40 shadow-sm"} flex flex-col h-full`}
                  variants={fadeIn}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex-1 mb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={handleGetStarted}
                    className={`w-full ${plan.popular ? "" : "bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground"}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Everything you need to know about PulsePilot</p>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto divide-y divide-border"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  question: "How does PulsePilot connect to my social accounts?",
                  answer:
                    "PulsePilot uses secure OAuth connections to integrate with your social media accounts. We never store your passwords and you can revoke access at any time.",
                },
                {
                  question: "Is my data secure with PulsePilot?",
                  answer:
                    "Absolutely. We use industry-standard encryption and security practices to protect your data. We never share your information with third parties without your explicit consent.",
                },
                {
                  question: "Can I customize the AI responses?",
                  answer:
                    "Yes! You can train the AI to match your brand voice, set tone preferences, and create custom response templates that the AI will use when generating suggestions.",
                },
                {
                  question: "Which social media platforms are supported?",
                  answer:
                    "PulsePilot currently supports YouTube, Instagram, Twitter/X, TikTok, Facebook, and LinkedIn. We're constantly adding more platforms based on user feedback.",
                },
                {
                  question: "Can I try PulsePilot before committing?",
                  answer:
                    "Yes, we offer a free Starter plan that lets you connect up to 3 social accounts and experience the core features of PulsePilot.",
                },
              ].map((faq, index) => (
                <motion.div key={index} className="py-6" variants={fadeIn}>
                  <button className="flex justify-between items-center w-full text-left">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <div className="mt-2 text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5">
          <div className="container">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Social Media Management?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators and brands who are saving time and increasing engagement with PulsePilot.
              </p>
              <Button size="lg" onClick={handleGetStarted} className="group">
                <span>Get Started For Free</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-lg">
                  Pulse<span className="text-primary">Pilot</span>
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                The all-in-one solution for managing social media comments and engaging with your audience.
              </p>
              <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <Link
                    key={social}
                    href={`#${social}`}
                    className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-4 w-4 bg-foreground/70 rounded-full" />
                  </Link>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Testimonials", "FAQ"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "API", "Status"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`#${link.toLowerCase()}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PulsePilot. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
