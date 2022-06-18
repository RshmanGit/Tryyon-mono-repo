import { prisma } from '../prisma';

// Create Admin
export const createAdmin = async (data) => {
  const { role, ...rest } = data;
  let admin;

  if (role) {
    admin = await prisma.admin.create({
      data: {
        role: {
          connectOrCreate: {
            where: {
              title: role
            },
            create: {
              title: role
            }
          }
        },
        ...rest
      },
      include: {
        role: true
      }
    });
  } else admin = await prisma.admin.create({ data });

  return admin;
};

// Read Admin
export const getAdminByID = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    include: {
      role: true
    }
  });

  return admin;
};

export const getAdminByEmail = async (email) => {
  const admin = await prisma.admin.findUnique({
    where: { email },
    include: {
      role: true
    }
  });

  return admin;
};

// Check Admin
export const checkAdmin = async ({ username, email, phone, id }) => {
  if (!username && !email && !phone && !id) return [];

  const query = { OR: [] };

  if (username) query.OR.push({ username });
  if (id) query.OR.push({ id });
  if (email) query.OR.push({ email });
  if (phone) query.OR.push({ phone });

  const admin = await prisma.admin.findMany({
    where: query,
    include: {
      role: true
    }
  });

  return admin;
};

// Update Admin
export const updateAdmin = async (id, updateData) => {
  let admin;
  const { role, ...rest } = updateData;

  if (role) {
    admin = await prisma.admin.update({
      where: { id },
      data: {
        role: {
          connectOrCreate: {
            where: {
              title: role
            },
            create: {
              title: role
            }
          }
        },
        ...rest
      }
    });
  } else {
    admin = await prisma.admin.update({
      where: { id },
      data: { ...updateData }
    });
  }
  return admin;
};

// Delete Admin
export const deleteAdmin = async ({ id, email, username, phone }) => {
  let deletedUser;
  if (id)
    deletedUser = await prisma.admin.delete({
      where: { id },
      include: {
        role: true
      }
    });
  else if (email)
    deletedUser = await prisma.admin.delete({
      where: { email },
      include: {
        role: true
      }
    });
  else if (username)
    deletedUser = await prisma.admin.delete({
      where: { username },
      include: {
        role: true
      }
    });
  else if (phone)
    deletedUser = await prisma.admin.delete({
      where: { phone },
      include: {
        role: true
      }
    });

  return deletedUser;
};
