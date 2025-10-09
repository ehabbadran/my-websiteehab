/*
  # Create Newsletter Subscribers Tracking Table

  ## Overview
  This migration creates a table to track newsletter subscriptions made through the website forms.
  This provides backup tracking independent of Kit (ConvertKit) and enables analytics.

  ## New Table
  
  ### `newsletter_subscribers`
  Tracks all newsletter subscription attempts from website forms
  - `id` (uuid, primary key) - Unique identifier for each subscription record
  - `email` (text, unique) - Subscriber email address
  - `subscribed_at` (timestamptz) - Timestamp when subscription was made
  - `kit_subscriber_id` (text) - Kit's subscriber ID (if available from API response)
  - `status` (text) - Subscription status: 'pending', 'active', 'failed', 'unsubscribed'
  - `source` (text) - Where the subscription came from: 'homepage_hero', 'homepage_cta', 'newsletter_page', 'footer'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on table
  - Allow public INSERT for new subscriptions (forms need to add records)
  - Allow public SELECT for checking if email exists (to prevent duplicate UI)
  - Restrict UPDATE and DELETE to authenticated users only

  ## Indexes
  - Create index on email for fast lookups
  - Create index on subscribed_at for analytics queries
  - Create index on status for filtering active subscribers
*/

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  kit_subscriber_id text,
  status text DEFAULT 'active',
  source text DEFAULT 'unknown',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Anyone can insert newsletter subscriptions"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view newsletter subscriptions"
  ON newsletter_subscribers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update newsletter subscriptions"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete newsletter subscriptions"
  ON newsletter_subscribers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_subscribed_at_idx ON newsletter_subscribers(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_source_idx ON newsletter_subscribers(source);
