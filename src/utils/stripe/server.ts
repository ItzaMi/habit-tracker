'use server';
import { createClient } from '@/utils/supabase/server';

import { stripe } from './config';
import { createOrRetrieveCustomer } from '../supabase/api';

const getUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://your-production-url.com';
  }

  return 'http://localhost:3000';
};

const checkoutWithStripe = async () => {
  if (!stripe) {
    return Error('Stripe is not configured');
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Error('User not found');
  }

  let customer: string;
  try {
    customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
    });
  } catch (err) {
    console.error(err);
    throw new Error('Unable to access customer record.');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${getUrl()}`,
    });
  } catch (error) {
    console.error(error);
  }

  if (session) {
    return { sessionId: session.id };
  } else {
    throw new Error('Unable to create checkout session.');
  }
};

const createStripePortal = async () => {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || '',
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getUrl()}/dashboard/account`,
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Could not create billing portal');
  }
};

export { checkoutWithStripe, createStripePortal };
