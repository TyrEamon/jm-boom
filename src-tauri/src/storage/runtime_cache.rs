use serde::de::DeserializeOwned;
use serde::Serialize;
use sqlx::Row;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use super::pool;

pub(crate) async fn get<T>(cache_kind: &str, cache_key: &str) -> Result<Option<T>, String>
where
    T: DeserializeOwned,
{
    let pool = pool()?;
    let now = current_timestamp();
    let row = sqlx::query(
        r#"
        SELECT value_json
        FROM runtime_cache_entries
        WHERE cache_key = ? AND cache_kind = ? AND expires_at > ?
        "#,
    )
    .bind(cache_key)
    .bind(cache_kind)
    .bind(now)
    .fetch_optional(pool)
    .await
    .map_err(map_sqlx_error)?;

    let Some(row) = row else {
        return Ok(None);
    };
    let value_json: String = row.get("value_json");

    serde_json::from_str(&value_json)
        .map(Some)
        .map_err(|error| format!("Runtime cache payload error: {error}"))
}

pub(crate) async fn set<T>(
    cache_kind: &str,
    cache_key: &str,
    value: &T,
    ttl: Duration,
) -> Result<(), String>
where
    T: Serialize,
{
    let pool = pool()?;
    let now = current_timestamp();
    let ttl_secs = ttl.as_secs().min(i64::MAX as u64) as i64;
    let value_json = serde_json::to_string(value)
        .map_err(|error| format!("Runtime cache payload error: {error}"))?;

    sqlx::query(
        r#"
        INSERT INTO runtime_cache_entries (
            cache_key, cache_kind, value_json, expires_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(cache_key) DO UPDATE SET
            cache_kind = excluded.cache_kind,
            value_json = excluded.value_json,
            expires_at = excluded.expires_at,
            updated_at = excluded.updated_at
        "#,
    )
    .bind(cache_key)
    .bind(cache_kind)
    .bind(value_json)
    .bind(now.saturating_add(ttl_secs))
    .bind(now)
    .execute(pool)
    .await
    .map(|_| ())
    .map_err(map_sqlx_error)
}

fn current_timestamp() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs().min(i64::MAX as u64) as i64)
        .unwrap_or_default()
}

fn map_sqlx_error(error: sqlx::Error) -> String {
    format!("SQLite runtime cache error: {error}")
}
