# Database Migrations

This project uses [Flyway](https://flywaydb.org/) for database migrations.

## Production Settings

**IMPORTANT**: In production environments, always set these environment variables to prevent accidental data loss:

```bash
FLYWAY_CLEAN_DISABLED=true
FLYWAY_CLEAN_ON_VALIDATION_ERROR=false
```

| Variable | Production | Development | Description |
|----------|------------|-------------|-------------|
| `FLYWAY_CLEAN_DISABLED` | `true` | `false` | Prevents `flyway clean` from wiping your database |
| `FLYWAY_CLEAN_ON_VALIDATION_ERROR` | `false` | `true` | Prevents auto-clean when migration checksums don't match |

These are already configured in `docker-compose.yml` for local development safety.

## How It Works

- Migrations are SQL files in `src/main/resources/db/migration/`
- Files are named `V{version}__{description}.sql` (e.g., `V1__initial_schema.sql`)
- Flyway tracks applied migrations in a `flyway_schema_history` table
- Migrations run automatically on application startup

## Creating New Migrations

When making database schema changes:

1. **Create a new migration file** with the next version number:
   ```
   V2__add_user_avatar.sql
   V3__add_project_table.sql
   ```

2. **Naming convention**:
   - `V{number}__` prefix (two underscores)
   - Use descriptive names: `add_`, `alter_`, `drop_`, `create_`
   - Examples:
     - `V2__add_user_avatar_column.sql`
     - `V3__create_projects_table.sql`
     - `V4__add_index_on_email.sql`

3. **Write idempotent SQL when possible**:
   ```sql
   -- Good: Won't fail if already exists
   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

   -- For columns, check first
   ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
   ```

4. **Never modify existing migrations** that have been applied. Always create new ones.

## Migration History

| Version | Description | Date |
|---------|-------------|------|
| V1 | Initial schema (users, teams, team_members, team_invitations) | 2024-01-03 |

## Commands

```bash
# Flyway runs automatically on app start, but you can also:

# Check migration status
./mvnw flyway:info

# Run migrations manually
./mvnw flyway:migrate

# Repair failed migrations (use with caution)
./mvnw flyway:repair
```

## Rollback Strategy

Flyway Community doesn't support automatic rollbacks. For rollbacks:

1. Create a new migration that undoes the changes
2. Example: If V3 added a column, V4 can remove it

```sql
-- V4__rollback_user_avatar.sql
ALTER TABLE users DROP COLUMN IF EXISTS avatar;
```
