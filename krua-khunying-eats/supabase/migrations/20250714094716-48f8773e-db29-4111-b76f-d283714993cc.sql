-- Fix duplicate order number issue by improving the order number generation
-- Create a more robust order number generation that includes microseconds and sequence
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  order_num TEXT;
  counter INTEGER;
  base_num TEXT;
BEGIN
  -- Create base number with date and time including microseconds
  base_num := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || TO_CHAR(NOW(), 'HH24MISS') || TO_CHAR(EXTRACT(MICROSECONDS FROM NOW())::INTEGER, 'FM000000');
  
  -- Check if this number already exists and add a counter if needed
  counter := 1;
  order_num := base_num;
  
  WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = order_num) LOOP
    order_num := base_num || '-' || counter::TEXT;
    counter := counter + 1;
  END LOOP;
  
  RETURN order_num;
END;
$$;