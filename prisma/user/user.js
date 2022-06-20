import { prisma } from '../prisma';

// Create User
export const createUser = async (data) => {
  const user = await prisma.user.create({ data });

  return user;
};

// Read User
export const getUser = async ({ username, email, phone, id }) => {
  if (!username && !email && !phone && !id) {
    const users = await prisma.user.findMany();
    return users;
  }

  const query = { OR: [] };

  if (username) query.OR.push({ username });
  if (id) query.OR.push({ id });
  if (email) query.OR.push({ email });
  if (phone) query.OR.push({ phone });

  const user = await prisma.user.findMany({
    where: query
  });

  return user;
};

// Update User
export const updateUser = async (id, updateData) => {
  const user = await prisma.user.update({
    where: { id },
    data: updateData
  });

  return user;
};

// Delete User
export const deleteUser = async (id) => {
  const deletedUser = await prisma.user.delete({
    where: { id }
  });

  return deletedUser;
};