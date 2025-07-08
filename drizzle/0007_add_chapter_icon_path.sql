-- Migration: Add icon_path column to chapters table
-- This allows each chapter to have a custom icon reference

ALTER TABLE "chapters" ADD COLUMN "icon_path" varchar(255);