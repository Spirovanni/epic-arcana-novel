-- Create learning resources master table
CREATE TABLE learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id varchar(50) UNIQUE NOT NULL,
  title varchar(255) NOT NULL,
  author varchar(255),
  section_of_focus varchar(255),
  section_description text,
  connection_focus_area text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- Create index on resource_id for fast lookups
CREATE UNIQUE INDEX learning_resources_resource_id_idx ON learning_resources(resource_id);

-- Create junction table: learning resources to chapters
CREATE TABLE learning_resource_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_resource_id uuid NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  created_at timestamp DEFAULT now() NOT NULL,
  UNIQUE(learning_resource_id, chapter_id)
);

-- Create indexes for fast lookups
CREATE INDEX learning_resource_chapters_chapter_idx ON learning_resource_chapters(chapter_id);
CREATE INDEX learning_resource_chapters_resource_idx ON learning_resource_chapters(learning_resource_id);

-- Create connection points table
CREATE TABLE connection_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_resource_id uuid NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  point_number integer NOT NULL,
  description text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  UNIQUE(learning_resource_id, chapter_id, point_number)
);

-- Create indexes for fast lookups and filtering
CREATE INDEX connection_points_resource_chapter_idx ON connection_points(learning_resource_id, chapter_id);
CREATE INDEX connection_points_chapter_idx ON connection_points(chapter_id);

-- Create terminal learning objectives table
CREATE TABLE terminal_learning_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_resource_id uuid NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  objective_number integer NOT NULL,
  description text NOT NULL,
  bloom_level varchar(50),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  UNIQUE(learning_resource_id, chapter_id, objective_number)
);

-- Create indexes for fast lookups and filtering
CREATE INDEX terminal_learning_objectives_resource_chapter_idx ON terminal_learning_objectives(learning_resource_id, chapter_id);
CREATE INDEX terminal_learning_objectives_chapter_idx ON terminal_learning_objectives(chapter_id);
CREATE INDEX terminal_learning_objectives_bloom_idx ON terminal_learning_objectives(bloom_level);
