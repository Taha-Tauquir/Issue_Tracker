import { Request, Response } from "express";
import * as issueService from "../services/issue.service";

export async function getIssues(_req: Request, res: Response): Promise<void> {
  try {
    const issues = await issueService.getAllIssues();
    res.json(issues);
  } catch (error: any) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
}

export async function getIssueById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const issue = await issueService.getIssueById(id);

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.json(issue);
  } catch (error: any) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ message: "Failed to fetch issue" });
  }
}

export async function createIssue(req: Request, res: Response): Promise<void> {
  try {
    const issue = await issueService.createIssue(req.body);
    res.status(201).json(issue);
  } catch (error: any) {
    console.error("Error creating issue:", error);
    res.status(400).json({ message: error.message || "Failed to create issue" });
  }
}

export async function updateIssue(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const issue = await issueService.updateIssue(id, req.body);

    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.json(issue);
  } catch (error: any) {
    console.error("Error updating issue:", error);
    res.status(400).json({ message: error.message || "Failed to update issue" });
  }
}

export async function deleteIssue(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const deleted = await issueService.deleteIssue(id);

    if (!deleted) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.json({ message: "Issue deleted" });
  } catch (error: any) {
    console.error("Error deleting issue:", error);
    res.status(400).json({ message: error.message || "Failed to delete issue" });
  }
}
