@component('mail::message')
{{-- Header --}}
<p style="text-align:center;">
    <img src="https://melvok.com/logo-dark.png" alt="Melvok Logo" style="max-width:180px;margin-bottom:16px;">
</p>

# Welcome to **Melvok**!

Hello {{ $username }},

Thanks for registering at Melvok – the most powerful visual survey & forms builder designed for teams and creators.

---

## 🚀 What is Melvok?

Melvok lets you create, manage, and analyze advanced flow-based surveys and forms. Build with drag-and-drop, smart
logic, 100+ question types, team collaboration, and real-time analytics — all in one seamless experience.

> **Get started:**
> Browse our [Documentation](https://melvok.com/docs) to explore advanced features, automation, and pro tips.

---

@component('mail::button', ['url' => 'https://melvok.com/docs'])
Explore Documentation
@endcomponent

---

## Support & Contact

**Questions? Need help?**
Contact us any time:

- Email: <support@melvok.com>
    - Phone: +91-12345-67890
    - [melvok.com/contact](https://melvok.com/contact)

    ---

    Thanks again,<br>
    The Melvok Team

    @slot('footer')
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="background:#181818;color:#DDD;text-align:center;font-size:12px;padding:16px 0;">
        <tr>
            <td>
                &copy; {{ date('Y') }} Melvok. <a href="https://melvok.com"
                    style="color:#E2E2E2;text-decoration:underline;">melvok.com</a>
                <br>
                639 5th Avenue SW, Calgary, Alberta, Canada T2P 0M9
            </td>
        </tr>
    </table>
    @endslot
    @endcomponent