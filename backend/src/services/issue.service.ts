import * as issueRepository from "../repositories/issue.repository";

export async function getAllIssues() {
  return issueRepository.findAll();
}

export async function getIssueById(id: number) {
  return issueRepository.findById(id);
}

interface IssuePayload {
  title?: string;
  description?: string;
  status?: string;
}

export async function createIssue(payload: IssuePayload) {
  if (!payload.title || !payload.description) {
    throw new Error("Title and description are required");
  }

  const status = payload.status ?? "open";

  return issueRepository.create({
    title: payload.title,
    description: payload.description,
    status
  });
}

export async function updateIssue(id: number, payload: IssuePayload) {
  return issueRepository.update(id, payload);
}

export async function deleteIssue(id: number) {
  return issueRepository.remove(id);
}
