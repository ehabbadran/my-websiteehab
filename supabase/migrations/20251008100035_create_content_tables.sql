/*
  # Create Content Management Tables

  ## Overview
  This migration creates the core content management system for the Ehab Badran website,
  including blog posts, newsletter archives, and digital products from Gumroad.

  ## New Tables

  ### `blog_posts`
  Stores all blog articles with full content and metadata
  - `id` (uuid, primary key) - Unique identifier for each post
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `content` (text) - Full post content in markdown/HTML
  - `excerpt` (text) - Short preview text
  - `category` (text) - Post category (Entrepreneurship, Productivity, etc.)
  - `published_date` (date) - Publication date
  - `read_time` (integer) - Estimated reading time in minutes
  - `featured_image_url` (text) - URL to featured image
  - `is_featured` (boolean) - Whether to show on homepage
  - `view_count` (integer) - Number of views (default 0)
  - `external_url` (text) - Link to original post on ehabbadran.com
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `newsletters`
  Stores newsletter archive with preview content
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Newsletter title
  - `published_date` (date) - Publication date
  - `preview_content` (text) - Preview or excerpt
  - `external_url` (text) - Link to full newsletter
  - `created_at` (timestamptz) - Record creation timestamp

  ### `products`
  Stores digital products from Gumroad store
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (numeric) - Price in GBP
  - `gumroad_url` (text) - Direct link to Gumroad product page
  - `is_bestseller` (boolean) - Bestseller badge flag
  - `category` (text) - Product category (Guide, Template, Service)
  - `display_order` (integer) - Order for displaying products
  - `image_url` (text) - Product thumbnail/cover image
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access (SELECT) for all tables since this is public content
  - Restrict INSERT, UPDATE, DELETE to authenticated users only (for future admin functionality)
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL,
  published_date date NOT NULL,
  read_time integer DEFAULT 5,
  featured_image_url text,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  external_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  published_date date NOT NULL,
  preview_content text NOT NULL,
  external_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  gumroad_url text NOT NULL,
  is_bestseller boolean DEFAULT false,
  category text DEFAULT 'Guide',
  display_order integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for newsletters
CREATE POLICY "Anyone can view newsletters"
  ON newsletters
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert newsletters"
  ON newsletters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update newsletters"
  ON newsletters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete newsletters"
  ON newsletters
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for products
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_date_idx ON blog_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_is_featured_idx ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS newsletters_published_date_idx ON newsletters(published_date DESC);
CREATE INDEX IF NOT EXISTS products_display_order_idx ON products(display_order);
CREATE INDEX IF NOT EXISTS products_is_bestseller_idx ON products(is_bestseller) WHERE is_bestseller = true;
