const { Client } = require('pg');
const logger = require('../../lib/logger');

module.exports = async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    logger.warn('DATABASE_URL not set; skipping collaboration permissions seed');
    return;
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  try {
    logger.info('011: Seeding collaboration permissions...');
    await client.query('BEGIN');

    // Get or create permission group for collaboration
    const groupRes = await client.query(
      `INSERT INTO "PermissionGroup" ("key", "name", "description", "createdAt")
       VALUES ($1, $2, $3, now())
       ON CONFLICT ("key") DO UPDATE
       SET "name" = EXCLUDED."name", "description" = EXCLUDED."description"
       RETURNING "id"`,
      [
        'collaboration',
        'Collaboration Management',
        'Permissions for managing collaboration page content',
      ]
    );
    const groupId = groupRes.rows[0].id;

    // Define collaboration permissions
    const permissions = [
      {
        key: 'collaboration.view',
        name: 'View Collaboration Content',
        description: 'Can view collaboration page content',
      },
      {
        key: 'collaboration.create',
        name: 'Create Collaboration Content',
        description: 'Can create new collaboration page content',
      },
      {
        key: 'collaboration.update',
        name: 'Update Collaboration Content',
        description: 'Can update collaboration page content',
      },
      {
        key: 'collaboration.delete',
        name: 'Delete Collaboration Content',
        description: 'Can delete collaboration page content',
      },
    ];

    // Insert permissions
    for (const perm of permissions) {
      await client.query(
        `INSERT INTO "Permission" ("key", "name", "description", "groupId", "createdAt")
         VALUES ($1, $2, $3, $4, now())
         ON CONFLICT ("key") DO UPDATE
         SET "name" = EXCLUDED."name", "description" = EXCLUDED."description"`,
        [perm.key, perm.name, perm.description, groupId]
      );
      logger.info(`  ✓ Created/Updated permission: ${perm.key}`);
    }

    // Assign all collaboration permissions to ADMIN and SUPERADMIN roles
    const roles = await client.query('SELECT id, key FROM "Role" WHERE key IN ($1, $2)', [
      'ADMIN',
      'SUPERADMIN',
    ]);

    for (const role of roles.rows) {
      for (const perm of permissions) {
        const permRes = await client.query('SELECT id FROM "Permission" WHERE key = $1', [
          perm.key,
        ]);
        if (permRes.rows[0]) {
          await client.query(
            `INSERT INTO "RolePermission" ("roleId", "permissionId")
             VALUES ($1, $2)
             ON CONFLICT ("roleId", "permissionId") DO NOTHING`,
            [role.id, permRes.rows[0].id]
          );
          logger.info(`  ✓ Assigned ${perm.key} to ${role.key}`);
        }
      }
    }

    await client.query('COMMIT');
    logger.info('011: Collaboration permissions seeded successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    logger.error('011 seeder error:', { error: e.message });
    throw e;
  } finally {
    await client.end();
  }
};
