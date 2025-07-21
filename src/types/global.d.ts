import { Pool } from 'pg';

declare global {
  // allow global `var` declarations
  var db: Pool | undefined;
} 