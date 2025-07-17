-- =============================================
-- SHOPPING LISTS FEATURE DATABASE SETUP
-- =============================================

-- Create shopping_list_folders table
CREATE TABLE IF NOT EXISTS public.shopping_list_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6', -- hex color for folder visualization
  is_favorite BOOLEAN DEFAULT false,
  item_count INTEGER DEFAULT 0, -- denormalized count for efficiency
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Constraints
  CONSTRAINT shopping_list_folders_name_length CHECK (length(name) >= 1 AND length(name) <= 100),
  CONSTRAINT shopping_list_folders_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_id UUID REFERENCES public.shopping_list_folders(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity TEXT, -- flexible text field (e.g., "2 lbs", "1 bottle", "3 cups")
  category TEXT, -- e.g., "dairy", "produce", "meat", "pantry"
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0, -- 0 = normal, 1 = high, -1 = low
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Constraints
  CONSTRAINT shopping_list_items_name_length CHECK (length(name) >= 1 AND length(name) <= 200),
  CONSTRAINT shopping_list_items_priority_range CHECK (priority BETWEEN -1 AND 1)
);

-- Enable RLS on both tables
ALTER TABLE public.shopping_list_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES FOR SHOPPING LIST FOLDERS
-- =============================================

-- Users can view their own folders
CREATE POLICY "Users can view their own shopping list folders" 
ON public.shopping_list_folders FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own folders
CREATE POLICY "Users can insert their own shopping list folders" 
ON public.shopping_list_folders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own folders
CREATE POLICY "Users can update their own shopping list folders" 
ON public.shopping_list_folders FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own folders
CREATE POLICY "Users can delete their own shopping list folders" 
ON public.shopping_list_folders FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================
-- RLS POLICIES FOR SHOPPING LIST ITEMS
-- =============================================

-- Users can view items in their own folders
CREATE POLICY "Users can view their own shopping list items" 
ON public.shopping_list_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_list_folders 
    WHERE id = shopping_list_items.folder_id 
    AND user_id = auth.uid()
  )
);

-- Users can insert items into their own folders
CREATE POLICY "Users can insert items into their own shopping list folders" 
ON public.shopping_list_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shopping_list_folders 
    WHERE id = shopping_list_items.folder_id 
    AND user_id = auth.uid()
  )
);

-- Users can update items in their own folders
CREATE POLICY "Users can update their own shopping list items" 
ON public.shopping_list_items FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_list_folders 
    WHERE id = shopping_list_items.folder_id 
    AND user_id = auth.uid()
  )
);

-- Users can delete items from their own folders
CREATE POLICY "Users can delete their own shopping list items" 
ON public.shopping_list_items FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_list_folders 
    WHERE id = shopping_list_items.folder_id 
    AND user_id = auth.uid()
  )
);

-- =============================================
-- TRIGGERS FOR TIMESTAMP MANAGEMENT
-- =============================================

-- Create triggers for updated_at on shopping_list_folders
CREATE TRIGGER update_shopping_list_folders_updated_at 
  BEFORE UPDATE ON public.shopping_list_folders
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create triggers for updated_at on shopping_list_items
CREATE TRIGGER update_shopping_list_items_updated_at 
  BEFORE UPDATE ON public.shopping_list_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- =============================================
-- FUNCTION TO UPDATE FOLDER ITEM COUNT
-- =============================================

-- Function to update item count in folder (for efficiency)
CREATE OR REPLACE FUNCTION public.update_folder_item_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT and UPDATE operations
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.shopping_list_folders 
    SET 
      item_count = (
        SELECT COUNT(*) 
        FROM public.shopping_list_items 
        WHERE folder_id = NEW.folder_id
      ),
      updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = NEW.folder_id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE operation
  IF TG_OP = 'DELETE' THEN
    UPDATE public.shopping_list_folders 
    SET 
      item_count = (
        SELECT COUNT(*) 
        FROM public.shopping_list_items 
        WHERE folder_id = OLD.folder_id
      ),
      updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = OLD.folder_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for item count updates
CREATE TRIGGER update_folder_item_count_on_insert
  AFTER INSERT ON public.shopping_list_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_folder_item_count();

CREATE TRIGGER update_folder_item_count_on_update
  AFTER UPDATE ON public.shopping_list_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_folder_item_count();

CREATE TRIGGER update_folder_item_count_on_delete
  AFTER DELETE ON public.shopping_list_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_folder_item_count();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for shopping_list_folders
CREATE INDEX IF NOT EXISTS shopping_list_folders_user_id_idx ON public.shopping_list_folders(user_id);
CREATE INDEX IF NOT EXISTS shopping_list_folders_created_at_idx ON public.shopping_list_folders(created_at DESC);
CREATE INDEX IF NOT EXISTS shopping_list_folders_is_favorite_idx ON public.shopping_list_folders(user_id, is_favorite) WHERE is_favorite = true;

-- Indexes for shopping_list_items
CREATE INDEX IF NOT EXISTS shopping_list_items_folder_id_idx ON public.shopping_list_items(folder_id);
CREATE INDEX IF NOT EXISTS shopping_list_items_category_idx ON public.shopping_list_items(folder_id, category);
CREATE INDEX IF NOT EXISTS shopping_list_items_completed_idx ON public.shopping_list_items(folder_id, is_completed);
CREATE INDEX IF NOT EXISTS shopping_list_items_priority_idx ON public.shopping_list_items(folder_id, priority DESC);

-- =============================================
-- USEFUL VIEWS FOR COMMON QUERIES
-- =============================================

-- View for folder summaries with completion stats
CREATE OR REPLACE VIEW public.shopping_list_folder_summary AS
SELECT 
  f.id,
  f.user_id,
  f.name,
  f.description,
  f.color,
  f.is_favorite,
  f.item_count,
  f.created_at,
  f.updated_at,
  COALESCE(
    (SELECT COUNT(*) FROM public.shopping_list_items WHERE folder_id = f.id AND is_completed = true),
    0
  ) as completed_items,
  CASE 
    WHEN f.item_count = 0 THEN 0
    ELSE ROUND(
      (COALESCE(
        (SELECT COUNT(*) FROM public.shopping_list_items WHERE folder_id = f.id AND is_completed = true),
        0
      ) * 100.0) / f.item_count, 
      1
    )
  END as completion_percentage
FROM public.shopping_list_folders f;

-- Grant access to the view
GRANT SELECT ON public.shopping_list_folder_summary TO authenticated;

-- RLS policy for the view (inherits from base table)
ALTER VIEW public.shopping_list_folder_summary OWNER TO postgres; 