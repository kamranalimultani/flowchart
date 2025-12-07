import { Helmet } from "react-helmet-async";

export const Policies = () => {
  return (
    <section id="contact" className="mb-20 scroll-mt-20">
      <Helmet>
        <title>Privacy Policy & Terms | Melvok</title>
        <meta
          name="description"
          content="Read Melvok’s privacy policy, terms of use, and data protection practices. We value your privacy and transparency in how we handle your data."
        />
        <link rel="canonical" href="https://melvok.com/policies" />
      </Helmet>

      <div className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-slate-700 mb-4">
          If you have questions about these policies, need support for an order,
          or want to exercise privacy rights, reach us at:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold">Email</h4>
            <p className="text-slate-700">
              <a className="text-sky-600" href="mailto:info@melvok.com">
                info@melvok.com
              </a>
            </p>

            <h4 className="font-semibold mt-4">Address</h4>
            <p className="text-slate-700">
              Melvok (registered office)
              <br />
              [Insert physical address here]
            </p>

            <h4 className="font-semibold mt-4">Support hours</h4>
            <p className="text-slate-700">
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
                className="w-full rounded border border-slate-200 px-3 py-2"
                placeholder="Your name"
              />
              <input
                required
                type="email"
                className="w-full rounded border border-slate-200 px-3 py-2"
                placeholder="Your email"
              />
              <textarea
                required
                className="w-full rounded border border-slate-200 px-3 py-2"
                rows={4}
                placeholder="How can we help?"
              />
              <div className="flex justify-end">
                <button className="rounded bg-sky-600 text-white px-4 py-2 hover:bg-sky-700">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Note: Replace the placeholder address and support hours with the
          correct company details in your admin settings.
        </p>
      </div>
    </section>
  );
};
