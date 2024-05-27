'use client';
import { useEffect, useState } from 'react';

import Container from '@/components/common/container';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe, createStripePortal } from '@/utils/stripe/server';
import { checkIfUserIsCustomer } from '@/utils/supabase/api';
import { createClient } from '@/utils/supabase/client';

const Checkout = () => {
  const [userHasSubscription, setUserHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleStripeCheckout = async () => {
    if (userHasSubscription) {
      window.open(
        'https://billing.stripe.com/p/login/dR6dTPd8ZdOIeVa4gg',
        '_blank',
      );
    } else {
      const result = await checkoutWithStripe();

      if (result instanceof Error) {
        console.error(result);
        return;
      }

      const { sessionId } = result;

      console.log(sessionId);

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    }
  };

  useEffect(() => {
    const handleCheckIfUserIsCustomer = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      try {
        const res = await checkIfUserIsCustomer(user.id);

        if (res === null) {
          setUserHasSubscription(false);
          setLoading(false);
        } else {
          setUserHasSubscription(true);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    handleCheckIfUserIsCustomer();
  }, []);

  return (
    <Container className="flex items-center justify-between">
      {loading && <p>Check your subscription status...</p>}
      {!loading && userHasSubscription && (
        <p>You currently have an active subscription.</p>
      )}
      {!loading && !userHasSubscription && (
        <p>You currently have no active subscriptions.</p>
      )}
      <button
        onClick={handleStripeCheckout}
        className="rounded-md bg-gray-800 px-2 py-1 text-white"
        disabled={loading}
      >
        {userHasSubscription && !loading && 'Manage'}
        {!userHasSubscription && !loading && 'Subscribe'}
        {loading && '...'}
      </button>
    </Container>
  );
};

export default Checkout;
