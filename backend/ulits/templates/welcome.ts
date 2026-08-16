import { emailLayout } from "./layout";

export const welcomeTemplate = (name: string): string => {
  return emailLayout({
    title: "Welcome to Omri's Home Kichen",
    preheader: "Thank you for joining our family! Authentic handcrafted pickles await.",
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Welcome, ${name}! 🎉</h2>
      <p style="color: #475569;">We are thrilled to have you join <strong>Omri's Home Kichen</strong>!</p>
      <p style="color: #475569;">Our family recipes are slow-crafted in small, fresh batches using 100% natural, sun-dried ingredients and cold-pressed sesame oil. Zero chemical preservatives—just pure home-cooked flavor.</p>

      <div className="info-card" style="background-color: #fefce8; border-left: 4px solid #d97706; padding: 18px; border-radius: 0 10px 10px 0; margin: 24px 0;">
        <h3 style="margin: 0 0 8px 0; color: #b45309; font-size: 16px;">What makes our kitchen special?</h3>
        <p style="margin: 4px 0; color: #475569;">🌶️ <strong>Authentic Family Recipe:</strong> Traditional secret masala blends.</p>
        <p style="margin: 4px 0; color: #475569;">🌿 <strong>Pure Ingredients:</strong> Cold-pressed oils & natural sea salt.</p>
        <p style="margin: 4px 0; color: #475569;">📦 <strong>Fresh Packing:</strong> Leak-proof glass jar delivery.</p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://omris-home-kichen.vercel.app/menu" class="btn">Explore Product Menu</a>
      </div>

      <p style="color: #64748b; font-size: 14px;">If you ever have any questions or need custom bulk orders, simply reply to this email or call us at <strong>+91 63014 53780</strong>.</p>
    `,
  });
};
