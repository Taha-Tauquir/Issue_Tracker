import { Issue } from "@prisma/client";
import prisma from "../prisma/prisma";



export async function findAll(): Promise<Issue[]> {
  return prisma.issue.findMany({
    orderBy: { created_at: "desc" }
  });
}

export async function findById(id: number): Promise<Issue | null> {
  return prisma.issue.findUnique({ where: { id } });
}

interface IssueCreateData {
  title: string;
  description: string;
  status: string;
}

export async function create(data: IssueCreateData): Promise<Issue> {
  return prisma.issue.create({ data });
}

export async function update(
  id: number,
  data: Partial<IssueCreateData>
): Promise<Issue | null> {
  try {
    return await prisma.issue.update({
      where: { id },
      data
    });
  } catch {
    return null;
  }
}

export async function remove(id: number): Promise<boolean> {
  try {
    await prisma.issue.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
