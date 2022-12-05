import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        projectId: req.query.ppi as string,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(process.env.NEXT_PUBLIC_STRIPE_STUDIO_PRICE),
            product_data: {
              name: "Studio model training + 100 shots",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&ppi=${req.query.ppi}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return res.redirect(303, session.url!);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }

  return res.status(400).json({});
}
