"use client";

import { Helmet } from "react-helmet-async"; // Should remove Helmet? Yes, removed in logic
// Wait, I should confirm removal. Yes, removing Helmet imports. 
// Re-writing content without Helmet.

export default function Policies() {
    return (
        <section id="contact" className="mb-20 scroll-mt-20 py-10 container mx-auto px-4">
            {/* Added container and padding for layout consistency as it was in DefaultLayout */}
            <div className="rounded-2xl bg-card p-8 shadow border">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                    If you have questions about these policies, need support for an order,
                    or want to exercise privacy rights, reach us at:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold">Email</h4>
                        <p className="text-muted-foreground">
                            <a className="text-primary hover:underline" href="mailto:info@flowchartsurvey.online">
                                info@flowchartsurvey.online
                            </a>
                        </p>

                        <h4 className="font-semibold mt-4">Address</h4>
                        <p className="text-muted-foreground">
                            Flow Survey (registered office)
                            <br />
                            [Insert physical address here]
                        </p>

                        <h4 className="font-semibold mt-4">Support hours</h4>
                        <p className="text-muted-foreground">
                            Mon–Fri, 9:00 AM — 6:00 PM (local time). We aim to reply within 48
                            business hours.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold">Contact form</h4>
                        <form
                            action="#"
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-3 mt-2"
                        >
                            <input
                                required
                                className="w-full rounded border border-border bg-background px-3 py-2" // Updated Tailwind classes for shadcn consistency
                                placeholder="Your name"
                            />
                            <input
                                required
                                type="email"
                                className="w-full rounded border border-border bg-background px-3 py-2"
                                placeholder="Your email"
                            />
                            <textarea
                                required
                                className="w-full rounded border border-border bg-background px-3 py-2"
                                rows={4}
                                placeholder="How can we help?"
                            />
                            <div className="flex justify-end">
                                <button className="rounded bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90">
                                    Send message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                    Note: Replace the placeholder address and support hours with the
                    correct company details in your admin settings.
                </p>
            </div>
        </section>
    );
}
