-- Make this migration idempotent because it may run before table creation in some histories.
SET @schema_name := DATABASE();

SET @table_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = @schema_name
      AND LOWER(TABLE_NAME) = 'tbunificonfig'
);

SET @has_console := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND LOWER(TABLE_NAME) = 'tbunificonfig'
      AND COLUMN_NAME = 'consoleId'
);

SET @has_site := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND LOWER(TABLE_NAME) = 'tbunificonfig'
      AND COLUMN_NAME = 'siteId'
);

SET @alter_sql := NULL;

SET @alter_sql := IF(
    @table_exists = 1 AND @has_console = 1 AND @has_site = 1,
    'ALTER TABLE `tbUnifiConfig` DROP COLUMN `consoleId`, DROP COLUMN `siteId`',
    IF(
        @table_exists = 1 AND @has_console = 1,
        'ALTER TABLE `tbUnifiConfig` DROP COLUMN `consoleId`',
        IF(
            @table_exists = 1 AND @has_site = 1,
            'ALTER TABLE `tbUnifiConfig` DROP COLUMN `siteId`',
            NULL
        )
    )
);

SET @noop_sql := 'SELECT 1';
SET @exec_sql := COALESCE(@alter_sql, @noop_sql);

PREPARE stmt FROM @exec_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
