'use server';
import { User } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

import { createClient } from '@/utils/supabase/server';

import { stripe } from '../stripe/config';

const handleHabitOccurenceCheck = async (habitName: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id);

  if (!profilesData || profilesData.length === 0) {
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const newHabits = profilesData[0].habits.map(
      (habit: { name: string; occurences: string[] }) => {
        if (habit.name !== habitName) {
          return habit;
        }

        if (habit.occurences.includes(today)) {
          return habit;
        }

        return {
          ...habit,
          occurences: [...habit.occurences, today],
        };
      },
    );

    const { error, status } = await supabase
      .from('profiles')
      .update({ habits: newHabits })
      .eq('user_id', user?.id);

    if (error && status !== 406) {
      console.log(error);
      throw error;
    }

    revalidatePath('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

const handleHabitDelete = async (habitName: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id);

  if (!profilesData || profilesData.length === 0) {
    return;
  }

  const newHabits = profilesData[0].habits.filter(
    (habit: { name: string }) => habit.name !== habitName,
  );

  const { error, status } = await supabase
    .from('profiles')
    .update({ habits: newHabits })
    .eq('user_id', user?.id);

  if (error && status !== 406) {
    console.log(error);
    throw error;
  }

  revalidatePath('/dashboard');
};

const getHabits = async (user: User) => {
  const supabase = createClient();

  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id);

  if (!profilesData || profilesData.length === 0) {
    return [];
  }

  return profilesData[0].habits;
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const supabase = createClient();
  const { error: upsertError } = await supabase
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`,
    );

  return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error('Stripe customer creation failed.');

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const supabase = createClient();

  const { data: existingSupabaseCustomer, error: queryError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', uuid)
    .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  console.log('existingSupabaseCustomer', existingSupabaseCustomer);

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);

  console.log('stripeIdToInsert', stripeIdToInsert);
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabase
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`,
        );
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`,
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`,
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert,
    );
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.');

    return upsertedStripeCustomer;
  }
};

const checkIfUserIsCustomer = async (uuid: string) => {
  const supabase = createClient();
  const { data: customerData, error: queryError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', uuid)
    .maybeSingle();

  if (customerData) {
    const { data: subscriptionData, error: queryError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', uuid)
      .maybeSingle();

    console.log('s', subscriptionData);

    if (!subscriptionData) {
      return null;
    }

    if (subscriptionData.status === 'active') {
      return customerData;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );

  console.log('ssss', customerId);

  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId);

  console.log('customerData', customerData);

  // THIS FAILED HERE BUT WHY?
  // Error: Customer lookup failed: JSON object requested, multiple (or no) rows returned

  if (noCustomerError) {
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
  }

  const { id: uuid } = customerData[0]!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData = {
    subscription_id: subscription.id,
    user_id: uuid,
    status: subscription.status,
  };

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);

  if (upsertError) {
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`,
    );
  }

  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  );
};

export {
  getHabits,
  handleHabitOccurenceCheck,
  handleHabitDelete,
  createOrRetrieveCustomer,
  checkIfUserIsCustomer,
  manageSubscriptionStatusChange,
};
