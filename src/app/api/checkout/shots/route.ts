import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const PRICES = {
  100: { price: 400, promptWizardQuantity: 20 },
  200: { price: 700, promptWizardQuantity: 40 },
  300: { price: 900, promptWizardQuantity: 80 },
};

export async function GET(req: Request) {
  const url = new URL(req.url);

  const quantity = Number(url.searchParams.get("quantity"));
  const ppi = url.searchParams.get("ppi");

  if (quantity !== 100 && quantity !== 200 && quantity !== 300) {
    return NextResponse.json("invalid_quantity", { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        projectId: ppi,
        quantity,
        promptWizardQuantity: PRICES[quantity].promptWizardQuantity,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICES[quantity].price,
            product_data: {
              name: `⚡️ Refill +${quantity} shots and ${PRICES[quantity].promptWizardQuantity} prompt assists`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/studio/${ppi}/?session_id={CHECKOUT_SESSION_ID}&ppi=${ppi}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/studio/${ppi}`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err: any) {
    return NextResponse.json(err.message, { status: 400 });
  }
}
