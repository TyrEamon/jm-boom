use super::paths::{map_download_error, task_output_dir, tasks_path};
use super::progress::current_timestamp;
use super::types::{DownloadTask, DownloadTaskStatus};
use crate::api::{ApiError, ApiErrorKind, ApiResult};
use std::fs;
use tauri::AppHandle;

pub(crate) fn recover_interrupted_tasks(tasks: &mut [DownloadTask]) -> bool {
    let now = current_timestamp();
    let mut recovered = false;

    for task in tasks {
        if task.status != DownloadTaskStatus::Running {
            continue;
        }

        task.status = DownloadTaskStatus::Queued;
        task.started_at = None;
        task.completed_at = None;
        task.current_chapter_title.clear();
        task.total_pages = 0;
        task.completed_pages = 0;
        task.eta_seconds = None;
        task.speed_bytes_per_second = 0;
        task.error = None;
        task.updated_at = now;
        recovered = true;
    }

    recovered
}

pub(crate) fn migrate_pending_task_output_dirs(
    app: &AppHandle,
    tasks: &mut [DownloadTask],
) -> ApiResult<bool> {
    let mut migrated = false;

    for task in tasks {
        if !matches!(
            task.status,
            DownloadTaskStatus::Queued | DownloadTaskStatus::Running | DownloadTaskStatus::Paused
        ) {
            continue;
        }

        let output_dir = task_output_dir(app, &task.comic_title)?
            .to_string_lossy()
            .to_string();
        if task.output_dir == output_dir {
            continue;
        }

        task.output_dir = output_dir;
        task.updated_at = current_timestamp();
        migrated = true;
    }

    Ok(migrated)
}

pub(crate) fn load_tasks(app: &AppHandle) -> ApiResult<Vec<DownloadTask>> {
    let path = tasks_path(app)?;
    if !path.exists() {
        return Ok(Vec::new());
    }

    let bytes = fs::read(&path).map_err(map_download_error)?;
    serde_json::from_slice(&bytes)
        .map_err(|error| ApiError::new(ApiErrorKind::Payload, error.to_string()))
}

pub(crate) fn persist_tasks(app: &AppHandle, tasks: &[DownloadTask]) -> ApiResult<()> {
    let path = tasks_path(app)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(map_download_error)?;
    }
    let bytes = serde_json::to_vec_pretty(tasks)
        .map_err(|error| ApiError::new(ApiErrorKind::Payload, error.to_string()))?;
    let temp_path = path.with_extension("json.tmp");
    fs::write(&temp_path, bytes).map_err(map_download_error)?;
    fs::rename(&temp_path, &path).map_err(map_download_error)
}
