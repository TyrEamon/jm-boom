use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnqueueDownloadRequest {
    pub album_id: String,
    pub comic_title: String,
    pub endpoint: Option<String>,
    pub chapters: Vec<DownloadChapterRequest>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadChapterRequest {
    pub chapter_id: String,
    pub title: String,
    pub order: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadTask {
    pub task_id: String,
    pub album_id: String,
    pub comic_title: String,
    pub endpoint: String,
    pub chapters: Vec<DownloadChapterRequest>,
    pub status: DownloadTaskStatus,
    pub current_chapter_title: String,
    pub total_pages: u32,
    pub completed_pages: u32,
    pub eta_seconds: Option<u64>,
    pub speed_bytes_per_second: u64,
    pub output_dir: String,
    pub error: Option<String>,
    pub created_at: u64,
    pub started_at: Option<u64>,
    pub updated_at: u64,
    pub completed_at: Option<u64>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum DownloadTaskStatus {
    Queued,
    Running,
    Paused,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadTaskListResult {
    pub root_dir: String,
    pub tasks: Vec<DownloadTask>,
}
