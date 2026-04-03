import { db } from "./client.js";
import { roles, permissions, rolePermissions } from "./schema/roles.js";
import { badges } from "./schema/badges.js";
import { seasons } from "./schema/seasons.js";
import { users } from "./schema/users.js";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function seed() {
  console.log("Seeding database...");

  // 1. Insert roles
  const roleData = [
    { name: "admin", description: "Full system administrator" },
    { name: "leader", description: "Church group leader" },
    { name: "parent", description: "Parent of children" },
    { name: "child", description: "Child participant" },
  ] as const;

  const insertedRoles = await db
    .insert(roles)
    .values([...roleData])
    .onConflictDoNothing()
    .returning();
  console.log(`Inserted ${insertedRoles.length} roles`);

  // 2. Insert permissions
  const permissionData = [
    { name: "manage_users", description: "Create, update, delete users" },
    { name: "manage_children", description: "Manage children profiles" },
    { name: "manage_scores", description: "Award and revoke points" },
    { name: "view_scores", description: "View scores and leaderboards" },
    { name: "play_games", description: "Play interactive games" },
    { name: "manage_games", description: "Create and configure games" },
    { name: "manage_readings", description: "Create and manage readings" },
    { name: "view_readings", description: "View available readings" },
    { name: "manage_seasons", description: "Create and manage seasons" },
    { name: "view_reports", description: "View analytics and reports" },
    { name: "manage_badges", description: "Create and manage badges" },
  ];

  const insertedPermissions = await db
    .insert(permissions)
    .values(permissionData)
    .onConflictDoNothing()
    .returning();
  console.log(`Inserted ${insertedPermissions.length} permissions`);

  // 3. Build permission map
  const allPermissions = await db.select().from(permissions);
  const permMap = new Map(allPermissions.map((p) => [p.name, p.id]));

  const allRoles = await db.select().from(roles);
  const roleMap = new Map(allRoles.map((r) => [r.name, r.id]));

  // 4. Role-permission mappings
  const rolePermissionMappings: { roleName: string; permissionNames: string[] }[] = [
    {
      roleName: "admin",
      permissionNames: allPermissions.map((p) => p.name),
    },
    {
      roleName: "leader",
      permissionNames: [
        "manage_children",
        "manage_scores",
        "view_scores",
        "manage_readings",
        "view_readings",
        "view_reports",
      ],
    },
    {
      roleName: "parent",
      permissionNames: ["view_scores", "view_readings"],
    },
    {
      roleName: "child",
      permissionNames: ["play_games", "view_scores", "view_readings"],
    },
  ];

  const rpValues: { roleId: number; permissionId: number }[] = [];
  for (const mapping of rolePermissionMappings) {
    const rId = roleMap.get(mapping.roleName);
    if (!rId) continue;
    for (const pName of mapping.permissionNames) {
      const pId = permMap.get(pName);
      if (!pId) continue;
      rpValues.push({ roleId: rId, permissionId: pId });
    }
  }

  if (rpValues.length > 0) {
    await db.insert(rolePermissions).values(rpValues).onConflictDoNothing();
    console.log(`Inserted ${rpValues.length} role-permission mappings`);
  }

  // 5. Insert badges
  const badgeData = [
    {
      name: "Primera Lectura",
      slug: "primera-lectura",
      description: "Completaste tu primera lectura biblica",
      tier: "bronze",
      criteria: { type: "readings_completed", threshold: 1 },
    },
    {
      name: "Explorador Biblico",
      slug: "explorador-biblico",
      description: "Completaste 10 lecturas biblicas",
      tier: "silver",
      criteria: { type: "readings_completed", threshold: 10 },
    },
    {
      name: "Maestro de Trivia",
      slug: "maestro-de-trivia",
      description: "Respondiste correctamente 50 preguntas de trivia",
      tier: "gold",
      criteria: { type: "correct_answers", threshold: 50 },
    },
    {
      name: "Estrella de la Temporada",
      slug: "estrella-de-la-temporada",
      description: "Terminaste en el top 3 de la temporada",
      tier: "platinum",
      criteria: { type: "season_top", threshold: 3 },
    },
  ];

  const insertedBadges = await db
    .insert(badges)
    .values(badgeData)
    .onConflictDoNothing()
    .returning();
  console.log(`Inserted ${insertedBadges.length} badges`);

  // 6. Create admin user for season creation
  const adminRoleId = roleMap.get("admin");
  if (!adminRoleId) {
    console.error("Admin role not found, skipping season creation");
    process.exit(1);
  }

  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@jordanlist.com"))
    .limit(1);

  let adminId: number;
  if (existingAdmin.length === 0) {
    const hashedPassword = await hashPassword("admin123");
    const [admin] = await db
      .insert(users)
      .values({
        email: "admin@jordanlist.com",
        passwordHash: hashedPassword,
        name: "Administrador",
        roleId: adminRoleId,
      })
      .returning();
    adminId = admin!.id;
    console.log("Created admin user (admin@jordanlist.com / admin123)");
  } else {
    adminId = existingAdmin[0]!.id;
    console.log("Admin user already exists");
  }

  // 7. Insert default season
  const seasonData = {
    name: "Temporada 2026-A",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    isActive: true,
    createdBy: adminId,
  };

  const insertedSeasons = await db
    .insert(seasons)
    .values(seasonData)
    .onConflictDoNothing()
    .returning();
  console.log(`Inserted ${insertedSeasons.length} seasons`);

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
