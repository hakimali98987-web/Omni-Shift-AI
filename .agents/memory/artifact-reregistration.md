---
name: Artifact re-registration after import/fresh session
description: What to do when artifacts/<slug>/.replit-artifact/artifact.toml exists on disk and the app runs, but listArtifacts() returns empty and workflows aren't configured.
---

Symptom: directories under `artifacts/*` have full app code and a valid `.replit-artifact/artifact.toml`, but `listArtifacts()` returns `[]` and `WorkflowsRestart` says the workflow doesn't exist. This can happen after a Vercel/multi-artifact import scaffold is applied but the artifact registry wasn't populated in the current session.

**Fix:** do not call `createArtifact` (it fails with `ARTIFACT_DIR_EXISTS` for existing dirs, and there is no "api" artifact type for backend-only artifacts anyway). Instead, copy the existing toml to a sibling temp file unchanged and call `verifyAndReplaceArtifactToml({ tempFilePath, artifactTomlPath })`. This re-registers the artifact and generates its managed workflow(s), even though the toml content didn't change.

**Why:** `createArtifact` is for bootstrapping brand-new artifacts; `verifyAndReplaceArtifactToml` is the general "reconcile this artifact.toml with the platform" entry point and works even for a no-op edit.
