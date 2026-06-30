use std::time::{Duration, SystemTime, UNIX_EPOCH};

pub(crate) fn estimate_eta(
    elapsed: Duration,
    completed_pages: u32,
    total_pages: u32,
) -> Option<u64> {
    if completed_pages == 0 || total_pages <= completed_pages {
        return Some(0);
    }

    let per_page = elapsed.as_secs_f64() / completed_pages as f64;
    Some(((total_pages - completed_pages) as f64 * per_page).ceil() as u64)
}

pub(crate) fn estimate_speed(elapsed: Duration, downloaded_bytes: u64) -> u64 {
    let elapsed_seconds = elapsed.as_secs_f64();
    if downloaded_bytes == 0 || elapsed_seconds <= 0.0 {
        return 0;
    }

    (downloaded_bytes as f64 / elapsed_seconds).round() as u64
}

pub(crate) fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or_default()
}

pub(crate) fn short_hash(value: &str) -> String {
    format!("{:x}", md5::compute(value))
        .chars()
        .take(8)
        .collect()
}
