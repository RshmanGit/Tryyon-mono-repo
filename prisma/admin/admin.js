import { prisma } from '../prisma';

// Create Admin
export const createAdmin = async (data) => {
  const admin = await prisma.admin.create({
    data: data
  });

  return admin;
};

// Read Admin
export const getAdminByID = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: { id }
  });

  return admin;
};

export const getAdminByEmail = async (email) => {
  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  return admin;
};

// Check Admin
export const checkAdmin = async (username, email, phone) => {
  console.log(username);

  let admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin)
    admin = await prisma.admin.findUnique({
      where: { email }
    });

  if (!admin)
    admin = await prisma.admin.findUnique({
      where: { phone }
    });

  return admin;
};

// Update Admin
export const updateAdmin = async (id, updateData) => {
  const admin = await prisma.admin.update({
    where: { id },
    data: { ...updateData }
  });

  return admin;
};
